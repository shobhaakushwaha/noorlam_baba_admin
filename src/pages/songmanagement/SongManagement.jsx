import React, { useEffect, useState } from "react";
import { song_banner } from "assets/images";
import { Button, Input, Search } from "components/form";
import ImageUpload from "components/imageupload/ImageUpload";
import CustomModal from "components/modals/CustomModal";
import DeleteModal from "components/modals/DeleteModal";
import { FaTrash } from "react-icons/fa";
import { PiLineVerticalLight } from "react-icons/pi";
import { FiRefreshCcw } from "react-icons/fi";
import {
  TbEdit,
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import ApprovedTable from "./ApprovedTable";
import RequestTable from "./RequestTable";
import { getSongListApi } from "services/songMangement";
import { logger } from "utils/logger";
import ReactPaginate from "react-paginate";
import { useSearchParams } from "react-router-dom";
import useFullPageLoader from "common/UseFullPageLoader";
import useDebounce from "hooks/UseDebounce";

const SongManagement = () => {
  // -----------------search params
  const [searchParams, setSearchParams] = useSearchParams();
  const [loader, onShow, onHide] = useFullPageLoader();

  const activePage = +searchParams.get("page") || 1;
  const limits = +searchParams.get("limit") || 10;
  const search = searchParams.get("search") || "";

  const debaunceValue = useDebounce(search, 300);

  const dashboardTab = searchParams.get("dashboardTab") || "pending";

  const [songsList, setSongsList] = useState([]);
  const [total, setTotal] = useState(null);

  const getSongsListForManagement = async () => {
    const payload = {
      status: dashboardTab,
      ...(search && debaunceValue && { search: debaunceValue }),
      page: activePage,
      limit: limits,
    };
    try {
      onShow();
      const resposne = await getSongListApi(payload);

      logger.log("resposne:--->", resposne);

      if (resposne?.status === 200) {
        setSongsList(resposne?.data?.data?.songs || []);
        setTotal(resposne?.data?.data?.total || null);
      }
    } catch (error) {
      console.log("error:--->", error);
    } finally {
      onHide();
    }
  };

  useEffect(() => {
    getSongsListForManagement();
  }, [dashboardTab, debaunceValue, activePage]);

  const handlePageChange = (event) => {
    const urlInstance = new URLSearchParams(searchParams);

    urlInstance.set("page", event);
    setSearchParams(urlInstance);
  };

  const doResestFilter = () => {
    const urlInstance = new URLSearchParams(searchParams);
    urlInstance.delete("search");

    setSearchParams(urlInstance);
  };

  return (
    <>
      <div className="wrapper_category_management">
        {loader}
        <div className="dashboard_title">
          <h3>Song Management</h3>
          <div className="wrapper_cstm_tabers">
            <ul>
              {[
                { value: "approved", title: "Approved" },
                { value: "pending", title: " Requests" },

                // { value: "rejected", title: "Rejected" },
              ].map((data, ind) => (
                <li
                  key={ind}
                  className={dashboardTab === data?.value ? "active" : ""}
                  onClick={() => {
                    const urlInstance = new URLSearchParams(searchParams);
                    urlInstance.set("dashboardTab", data?.value);
                    setSearchParams(urlInstance);
                  }}
                >
                  {data?.title}
                </li>
              ))}

              {/* <li
                className={dashboardTab === "Request" ? "active" : ""}
                onClick={() => setDashboardTab("Request")}
              >
                Requests
              </li> */}
            </ul>
          </div>
        </div>
        <div className="wrapper_search">
          <div className="wrap_search">
            <Search
              value={search}
              onChange={(e) => {
                const urlInstance = new URLSearchParams(searchParams);
                urlInstance.delete("page");
                urlInstance.set("search", e.target.value);
                setSearchParams(urlInstance);
              }}
            />
            <Button onClick={doResestFilter}>
              <FiRefreshCcw />
            </Button>
          </div>
        </div>

        {dashboardTab === "approved" && (
          // <ApprovedTable
          //   songsList={songsList}
          //   activePage={activePage}
          //   limits={limits}
          //               dashboardTab={dashboardTab}

          // />
          <ApprovedTable
  songsList={songsList}
  activePage={activePage}
  limits={limits}
  dashboardTab={dashboardTab}
  refreshList={getSongsListForManagement}  // ✅ MUST ADD
/>

        )}
        {dashboardTab === "pending" && (
          <RequestTable
            songsList={songsList}
            activePage={activePage}
            limits={limits}
            dashboardTab={dashboardTab}
          />
        )}

        {dashboardTab === "rejected" && (
          <RequestTable
            songsList={songsList}
            activePage={activePage}
            limits={limits}
            dashboardTab={dashboardTab}
          />
        )}
      </div>

      {total > limits && (
        <div className="pagination-wrapper">
          <ReactPaginate
            forcePage={activePage - 1} // ZERO-based index
            pageCount={Math.ceil(total / limits)}
            onPageChange={(e) => handlePageChange(e.selected + 1)}
            // previousLabel="Previous"
            previousLabel={<TbPlayerTrackPrevFilled size={25} />}
            // nextLabel="Next"
            nextLabel={<TbPlayerTrackNextFilled size={25} />}
            breakLabel="..."
            marginPagesDisplayed={1}
            pageRangeDisplayed={5}
            containerClassName="pagination"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            activeClassName="active"
            previousClassName="page-item"
            nextClassName="page-item"
            disabledClassName="disabled"
          />
        </div>
      )}
    </>
  );
};

export default SongManagement;
