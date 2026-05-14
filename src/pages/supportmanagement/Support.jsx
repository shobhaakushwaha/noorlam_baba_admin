import NotFound from "common/NotFound";
import useFullPageLoader from "common/UseFullPageLoader";
import useDebounce from "hooks/UseDebounce";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supportApi, supportListApi } from "services/supportManagment";
import { findSerialNumber } from "utils/formValidator";
import { dateFormat } from "../../utils/dateFormat";
import ReactPaginate from "react-paginate";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import { BiMessageDetail } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import ChatModal from "components/modals/ChatModal";
import { toastMessage } from "utils/toastMessage";

const Support = () => {
  const [search, setSearch] = useState("");
  const debouncedValue = useDebounce(search, 300);

  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedId, setSelectedId] = useState(null);
  const [loader, onShow, onHide] = useFullPageLoader();

  const [faqList, setFaqList] = useState([]);

  const activePage = +searchParams.get("page") || 1;
  const limits = +searchParams.get("limit") || 10;
  const [count, setCount] = useState();
  const [total, setTotal] = useState();
  const [logoutModal, setLogoutModal] = useState(false);
  const [logoutModals, setLogoutModals] = useState(false);

  const [descriptionModal, setDescriptionModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedData, setSelectedData] = useState({});

  // Handle pagination
  const handlePageChange = (event) => {
    searchParams.set("page", event);
    setSearchParams(searchParams);
  };

  // handle limit of page
  const handleLimit = (event) => {
    searchParams.set("limit", event.target.value);
    searchParams.delete("page");
    setSearchParams(searchParams);
  };

  const listData = async () => {
    let data = {
      page: activePage,
      limit: limits,
    };

    try {
      const { data: response, status } = await supportListApi(data);

      if (status === 200) {
        setFaqList(response?.data?.listing);
        console.log(response?.data?.listing, " list");
        setTotal(response.data.total);
        setCount(response?.counts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resolveQuery = async () => {
    let data = {
      ticketId: selectedId,
    };
    try {
      const { data: response, status } = await supportApi(data);
      if (status === 200) {
        setFaqList(response?.data?.list);
        toastMessage(response.message, "success");
        listData();
        setLogoutModals(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    listData();
  }, [activePage, limits]);

  return (
    <div className="wrapper_support">
      <div className="table_wrap table_responsive">
        <table className="table nowrap_table">
          <thead>
            <tr>
              <th className="nowrap text-center">Sr. No. </th>
              <th className="nowrap text-center">User Name</th>
              <th className="nowrap text-center">User Role</th>
              <th className="nowrap text-center">Reported On</th>
              <th className="nowrap text-center">Mobile Number</th>
              <th className="nowrap text-center">Message</th>
              <th className="nowrap text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqList && faqList.length > 0 ? (
              faqList.map((data, index) => {
                return (
                  <tr key={index}>
                    <td className="text-center">
                      {" "}
                      {findSerialNumber(index, activePage, limits)}
                    </td>

                    <td className="text-center">{data.userName}</td>
                    <td className="text-center">{data.userRole[0]}</td>
                    <td className="text-center">
                      {" "}
                      {dateFormat(data?.createdAt)}
                    </td>

                    <td className="text-center">
                      {data?.userMobile ? "+91" : ""}{" "}
                      {data?.userMobile ? data?.userMobile : "N/A"}
                    </td>

                    <td className="text-center message-cell">
                      {data?.subject?.length > 10 ? (
                        <span className="message-preview">
                          {data?.subject?.slice(0, 15)}...
                          <span
                            className="read-more"
                            style={{
                              color: "#007bff",
                              cursor: "pointer",
                              marginLeft: "5px",
                              textDecoration: "underline",
                              fontWeight: "600",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDescription(data?.subject);
                              setDescriptionModal(true);
                            }}
                          >
                            Read more
                          </span>
                        </span>
                      ) : (
                        data?.subject
                      )}
                    </td>

                    <td className="text-center">
                      <div className="action-buttons">
                        {data.ticketStatus === "closed" ? (
                          <button className="action-btn resolved-btn" disabled>
                            <FaCheckCircle />
                            <span>Resolved</span>
                          </button>
                        ) : (
                          <button
                            className="action-btn chat-btn"
                            onClick={() => {
                              console.log("Ticket Data:", data);
                              console.log("Room ID:", data.roomId);
                              setSelectedId(data._id);
                              setSelectedData(data);
                              setLogoutModals(true);
                            }}
                          >
                            <BiMessageDetail />
                            <span>Reply</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <NotFound
                cols={10}
                msg={"Support Data not found"}
                onHide={onHide}
              />
            )}
          </tbody>
        </table>
      </div>
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

      {/* Description/Read More Modal */}
      {descriptionModal && (
        <div
          className="description-modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setDescriptionModal(false)}
        >
          <div
            className="description-modal-content"
            style={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              padding: "24px",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "70vh",
              overflowY: "auto",
              position: "relative",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                borderBottom: "1px solid #eee",
                paddingBottom: "12px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600" }}>
                Message
              </h3>
              <button
                onClick={() => setDescriptionModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "22px",
                  color: "#666",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IoClose />
              </button>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                lineHeight: "1.6",
                color: "#333",
                wordBreak: "break-word",
              }}
            >
              {selectedDescription}
            </p>
          </div>
        </div>
      )}

      <ChatModal
        heading={"Are you sure you want to resolve this query"}
        show={logoutModals}
        onClose={() => setLogoutModals(false)}
        onConfirm={resolveQuery}
        selectedChat={{
          ...selectedData,
          roomId: selectedData?.roomId || selectedData?._id,
          userId: selectedData?.userId || selectedData?.createdBy,
        }}
      />
    </div>
  );
};

export default Support;