import React, { useEffect, useState } from "react";
import { timeIconUpdate } from "../../assets/icons";
import { FaTrash } from "react-icons/fa";
import { data, Link, useSearchParams } from "react-router-dom";
import useFullPageLoader from "common/UseFullPageLoader";
import useDebounce from "hooks/UseDebounce";
import {
  deleteNotificationApi,
  getNotificationListApi,
} from "services/notification";
import NotFound from "common/NotFound";
import { dateFormat, dateFormatWithTime } from "utils/dateFormat";
import DeleteModal from "components/modals/DeleteModal";
import { toastMessage } from "utils/toastMessage";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import ReactPaginate from "react-paginate";

const SentNotification = ({ refreshKey }) => {

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSet] = useSearchParams();
  const [loader, onShow, onHide] = useFullPageLoader();

  const activePage = +searchParams.get("page") || 1;
  const limits = +searchParams.get("limit") || 10;
  const tab = searchParams.get("tab") || "sentNotification";

  const debaunceValue = useDebounce(search, 300);
  const [detailsData, setDetailsData] = useState({});

  const [isBlocked, setIsBlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  // -----------date filter

  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  // ---------------lists
  const [notificationList, setNotificationLists] = useState([]);

  const [total, setTotal] = useState(null);

   // Handle pagination
  const handlePageChange = (event) => {
    const urlInstance = new URLSearchParams(searchParams);

    urlInstance.set("page", event);
    setSearchParams(urlInstance);
  };


  const getNotificationList = async () => {
    const payload = {
      page: activePage,
      limit: limits,
      type: "sent",
    };

    onShow();

    try {
      const { data, status } = await getNotificationListApi(payload);

      if (status === 200) {
        console.log(data?.data, " HELLOW");
        setNotificationLists(data?.data.data || []);
        setTotal(data?.data?.total || 0);
      }
    } catch (error) {
      console.log("error:-->", error);
    } finally {
      onHide();
    }
  };

  const handleDeleteNotification = async () => {
    if (!detailsData?._id) return;

    try {
      const id = detailsData._id;

      const { data } = await deleteNotificationApi({ id });
      toastMessage(data.message, "success");
      setIsModalOpen(false);
      setNotificationLists((prev) => prev.filter((item) => item._id !== id));
      setDetailsData({});
            getNotificationList();

      // }
    } catch (error) {
      console.log("Delete error:", error);
    }
  };


  useEffect(() => {
    getNotificationList();
  }, [activePage, limits, refreshKey]);

 

 
  return (
    <div className="sentNotification">
      {notificationList && notificationList?.length > 0 ? (
        notificationList.map((data, index) => (
          <div className="title_cards" key={data._id || index}>
            <div className="top-content">
              <div className="heading">
                <h5>{data?.title}</h5>
              </div>

              <div className="hours">
                <img src={timeIconUpdate} alt="time-icon" />
                <span>{dateFormatWithTime(data.createdAt)}</span>
              </div>
            </div>
            <div className="btm-content">
              <div className="short_content">
                <p>{data?.message}</p>
              </div>
              <div className="dlt-icon">
                <FaTrash
                  className="red"
                  onClick={() => {
                    setIsModalOpen(true);
                    setDetailsData(data);
                  }}
                />{" "}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Notification list not available</p>
      )}

      {total > limits && (
        <div className="pagination-wrapper">
          <ReactPaginate
            forcePage={activePage - 1} 
            pageCount={Math.ceil(total / limits)}
            onPageChange={(e) => handlePageChange(e.selected + 1)}
            previousLabel={<TbPlayerTrackPrevFilled size={25} />}
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

      <DeleteModal
        heading="Are you sure you want to delete this Notification"
        show={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setDetailsData({});
        }}
        onConfirm={handleDeleteNotification}
      />
    </div>
  );
};
export default SentNotification;
