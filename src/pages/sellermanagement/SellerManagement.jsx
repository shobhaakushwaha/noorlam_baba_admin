import { Button, Search } from "components/form";
import React, { useEffect, useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import "./SellerManagement.scss";
import ApprovedTable from "./ApprovedTable";
import RequestTable from "./RequestTable";
import { useSearchParams } from "react-router-dom";
import useFullPageLoader from "common/UseFullPageLoader";
import useDebounce from "hooks/UseDebounce";
import ReactPaginate from "react-paginate";
import { getSellerListApi } from "services/sellerManagement";
import ChangeSelectedUserStatus from "./ChangeSelectedUserStatus";
import DeleteUser from "./DeleteUser";
import RejectTable from "./RejectTable";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";

const SellerManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [detailsData, setDetailsData] = useState({});

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const closeAndCLear = () => {
    setDetailsData({});
    setShowStatusModal(false);
    setDeleteModalOpen(false);
  };

  // const [dashboardTab, setDashboardTab] = useState("approved");

  const dashboardTab = searchParams.get("dashboardTab") || "approved";

  // -----------------search params
  const [loader, onShow, onHide] = useFullPageLoader();

  const activePage = +searchParams.get("page") || 1;
  const limits = +searchParams.get("limit") || 10;
  const search = searchParams.get("search") || "";

  const debaunceValue = useDebounce(search, 300);

  const [userList, setUserLists] = useState([]);

  const [total, setTotal] = useState(null);

  const getSellerListFun = async () => {
    const payload = {
      page: activePage,
      limit: limits,
      type: dashboardTab,
    };
    if (debaunceValue && search) {
      payload.search = debaunceValue;
    }

    onShow();

    try {
      const response = await getSellerListApi(payload);
      console.log("seller list api response:-->", response);
      console.log("seller list response data:-->", response?.data);

      const {
        data: {
          data: { users, total },
          status,
        },
      } = response;

      console.log("seller list parsed response:-->", {
        status,
        users,
        total,
      });

      if (status === 200) {
        setUserLists(users || []);
        setTotal(total);
        console.log("seller list fetched:-->", users);
      }
    } catch (error) {
      console.log("error:-->", error);
    } finally {
      onHide();
    }
  };

  useEffect(() => {
    getSellerListFun();
  }, [debaunceValue, activePage, limits, dashboardTab]);

  const doResestFilter = () => {
    const urlInstance = new URLSearchParams(searchParams);
    urlInstance.delete("search");
    setSearchParams(urlInstance);
  };

  //---------------------------------------------------------------- Handle pagination
  const handlePageChange = (event) => {
    const urlInstance = new URLSearchParams(searchParams);

    urlInstance.set("page", event);
    setSearchParams(urlInstance);
  };

  const deleteSearchAndPage = () => {
    const urlInstance = new URLSearchParams(searchParams);
    urlInstance.delete("page");
    urlInstance.delete("search");
    setSearchParams(urlInstance);
  };

  // -----------------------------------------------------

  const setTabStatus = (name) => {
    const URLIns = new URLSearchParams(searchParams);
    URLIns.set("dashboardTab", name);
    setSearchParams(URLIns);
  };

  return (
    <div className="wrapper_seller_management">
      {loader}

      <div className="dashboard_title">
        <h3>Seller Management </h3>
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
        <div className="wrapper_cstm_tabers">
          <ul>
            <li
              className={dashboardTab === "approved" ? "active" : ""}
              onClick={() => {
                deleteSearchAndPage();
                setTabStatus("approved");
              }}
            >
              Approved
            </li>
            <li
              className={dashboardTab === "pending" ? "active" : ""}
              onClick={() => {
                deleteSearchAndPage();

                setTabStatus("pending");
              }}
            >
              Requests
            </li>

            <li
              className={dashboardTab === "rejected" ? "active" : ""}
              onClick={() => {
                deleteSearchAndPage();

                setTabStatus("rejected");
              }}
            >
              Rejected
            </li>
          </ul>
        </div>
      </div>
      <>
        {dashboardTab === "approved" && (
          <ApprovedTable
            userList={userList}
            activePage={activePage}
            limits={limits}
            setShowStatusModal={setShowStatusModal}
            setDetailsData={setDetailsData}
            setDeleteModalOpen={setDeleteModalOpen}
            dashboardTab={dashboardTab}
          />
        )}
        {dashboardTab === "pending" && (
          <RequestTable
            userList={userList}
            activePage={activePage}
            limits={limits}
            dashboardTab={dashboardTab}
          />
        )}

        {dashboardTab === "rejected" && (
          <RejectTable
            userList={userList}
            activePage={activePage}
            limits={limits}
            dashboardTab={dashboardTab}
          />
        )}
      </>

      {/* -------------------------------pagination */}
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

      {/* ------------user status */}

      {showStatusModal && (
        <ChangeSelectedUserStatus
          showStatusModal={showStatusModal}
          selectedUserDetail={detailsData}
          onClose={closeAndCLear}
          getUserListFun={getSellerListFun}
        />
      )}

      {/* ---------delete user */}
      {deleteModalOpen && (
        <DeleteUser
          deleteModalOpen={deleteModalOpen}
          userDetails={detailsData}
          closeAndClear={closeAndCLear}
          getUserListFun={getSellerListFun}
        />
      )}
    </div>
  );
};

export default SellerManagement;
