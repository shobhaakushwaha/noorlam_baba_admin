import { song_banner } from "assets/images";
import { Button, DatePicker, Search } from "components/form";
import React, { useEffect, useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import { MdBlock, MdSkipNext } from "react-icons/md";
import { PiLineVerticalLight } from "react-icons/pi";
import { CgUnblock } from "react-icons/cg";
import { Link, useSearchParams } from "react-router-dom";
import DeleteModal from "components/modals/DeleteModal";
import useDebounce from "hooks/UseDebounce";
import { getUserListApi, deleteUserApi } from "services/userManagement";
import { findSerialNumber } from "utils/formValidator";
import { helperFunForNa } from "utils/helperFunForNa";
import { formatDate } from "utils/dateFormat";
import useFullPageLoader from "common/UseFullPageLoader";
import NotFound from "common/NotFound";
import ReactPaginate from "react-paginate";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import ChangeSelectedUserStatus from "./ChangeSelectedUserStatus";
import DeleteUser from "./DeleteUser";
import { userPlaceholder } from "assets/icons";
import CustomModal from "components/modals/CustomModal";
import { LuCalendarDays } from "react-icons/lu";
import { toastMessage } from "utils/toastMessage";
import { logger } from "utils/logger";
import { dateFormat, formatDates, toDate } from "../../utils/dateFormat";

const UserManagement = () => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [detailsData, setDetailsData] = useState({});
  const [modalAdd, setModalAdd] = React.useState(false);
  // const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const closeAndCLear = () => {
    setDetailsData({});
    setShowStatusModal(false);
    setDeleteModalOpen(false);
  };

  // -----------------search params
  const [searchParams, setSearchParams] = useSearchParams();
  const [loader, onShow, onHide] = useFullPageLoader();

  const activePage = +searchParams.get("page") || 1;
  const limits = +searchParams.get("limit") || 10;
  const search = searchParams.get("search") || "";

  const debaunceValue = useDebounce(search, 300);

  const [isBlocked, setIsBlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  // -----------date filter

  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  // ---------------lists
  const [userList, setUserLists] = useState([]);

  const [total, setTotal] = useState(null);

  const getUserListFun = async () => {
    const payload = {
      page: activePage,
      limit: limits,
      role: "listener",

      startDate: formatDates(dateFilter.startDate) || "",
      endDate: formatDates(dateFilter.endDate) || "",
    };
    if (debaunceValue && search) {
      payload.search = debaunceValue;
    }

    console.log(dateFilter?.startDate, "DATE APPLY");
    onShow();

    try {
      const response = await getUserListApi(payload);
      console.log("decrypted user list response:-->", response?.data);

      const {
        data: {
          data: { userList, total },
          status,
        },
      } = response;

      if (status === 200) {
        setUserLists(userList || []);
        setTotal(total);
      }
    } catch (error) {
      console.log("error:-->", error);
    } finally {
      onHide();
    }
  };

  useEffect(() => {
    getUserListFun();
  }, [
    debaunceValue,
    activePage,
    limits,
    dateFilter?.startDate,
    dateFilter?.endDate,
  ]);

  // Handle pagination
  const handlePageChange = (event) => {
    const urlInstance = new URLSearchParams(searchParams);

    urlInstance.set("page", event);
    setSearchParams(urlInstance);
  };

  // ---------------------doResestFilter

  const doResestFilter = () => {
    setDateFilter({
      startDate: "",
      endDate: "",
    });

    const urlInstance = new URLSearchParams(searchParams);

    urlInstance.delete("search");
    setSearchParams(urlInstance);
  };

  const deleteSearchAndPage = () => {
    const urlInstance = new URLSearchParams(searchParams);
    urlInstance.delete("page");
    urlInstance.delete("search");
    setSearchParams(urlInstance);
  };

  
  const handleDeleteUser = async () => {
    if (!detailsData?._id) return;
    onShow();
    try {
      const { data } = await deleteUserApi(detailsData._id);
      logger.log("data:-->", data);

      if (data?.status === 200) {
        toastMessage(data.message, "success");
        setIsModalOpen(false);
        setDetailsData({});
        getUserListFun();
      }
    } catch (error) {
      console.log("Delete error:", error);
    } finally {
      onHide();
    }
  };

  const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const showImagePreviewHandler = (profile) => {
    setShowImagePreviewModel(true);
    setImagePreview(profile);
  };
  return (
    <>
      <div className="wrappep_user_management">
        {loader}
        <div className="dashboard_title">
          <h3>User Management</h3>
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
            <div className="wrap_common_search">
              <DatePicker
                icon={<LuCalendarDays />}
                placeholder="from"
                value={dateFilter?.startDate}
                maxDate={dateFilter?.endDate}
                onChange={(date) => {
                  setDateFilter((prev) => ({ ...prev, startDate: date }));
                  deleteSearchAndPage();
                }}
              />
            </div>
            <div className="wrap_common_search">
              <DatePicker
                icon={<LuCalendarDays />}
                placeholder="to"
                value={dateFilter?.endDate}
                minDate={dateFilter?.startDate}
                onChange={(date) => {
                  setDateFilter((prev) => ({ ...prev, endDate: date }));
                  deleteSearchAndPage();
                }}
              />
            </div>
            <Button onClick={doResestFilter}>
              <FiRefreshCcw />
            </Button>
          </div>
        </div>
        <div className="table_wrap table_responsive">
          <table className="table custom_table">
            <thead>
              <tr>
                                                <th className="nowrap text-center">S.No</th>

                <th className="nowrap text-center">User ID</th>

                <th className="nowrap text-center">Profile</th>
                <th className="nowrap text-center">Name</th>
                <th className="nowrap text-center">Phone Number</th>
                <th className="nowrap text-center">Registration Date</th>
                <th className="nowrap text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList && userList?.length > 0 ? (
                userList.map((data, index) => (
                  <tr key={index}>
                      <td className="text-center">
                      {findSerialNumber(index, activePage, limits)}
                    </td>
                    <td className="text-center">
                      {/* {findSerialNumber(index, activePage, limits)} */}
                      {data?.noorUserId || "N/A"}
                    </td>
                    <td className="text-center">
                      <img
                        className="cstm_img_table profile_img"
                        src={data?.profileImage || userPlaceholder}
                        alt=""
                        onClick={() =>
                          showImagePreviewHandler(
                            data?.profileImage || userPlaceholder,
                          )
                        }
                      />
                    </td>
                    <td className="text-center">
                      {helperFunForNa(data?.fullName)}{" "}
                    </td>
                    <td className="text-center">
                      {data.mobile != null ? data?.countryCode : ""}
                      {data.mobile != null ? data?.mobile : "N/A"}
                    </td>

                    <td className="text-center">
                      {formatDate(data?.createdAt)}
                    </td>
                    <td className="text-center">
                      <div className="common_view actions_wrap">
                        <div
                          onClick={() => {
                            setShowStatusModal(true);
                            setDetailsData(data);
                          }}
                          style={{ display: "inline-block" }}
                        >
                          {(data?.status === true ||
                            data?.status === "true" ||
                            data?.isActive === true ||
                            data?.isActive === "true") ? (
                            <MdBlock className="block" />
                          ) : (
                            <CgUnblock className="unblock" />
                          )}
                        </div>
                        <PiLineVerticalLight />
                        <Link to={`/user-management/user-detail/${data?._id}`}>
                          <FaEye />
                        </Link>
                        <PiLineVerticalLight />
                        {/* <FaTrash
                          className="red"
                          onClick={() => {
                            setDeleteModalOpen(true);
                            setDetailsData(data);
                          }}
                        /> */}

                        <FaTrash
                          className="red"
                          onClick={() => {
                            setIsModalOpen(true);
                            setDetailsData(data);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <NotFound msg="User list not available" onHide={true} />
              )}
            </tbody>
          </table>
        </div>
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

      {/* ------------user status */}

      {showStatusModal && (
        <ChangeSelectedUserStatus
          showStatusModal={showStatusModal}
          selectedUserDetail={detailsData}
          onClose={closeAndCLear}
          getUserListFun={getUserListFun}
        />
      )}

      <DeleteModal
        heading="Are you sure you want to delete this User?"
        show={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setDetailsData({});
        }}
        onConfirm={handleDeleteUser}
      />
      {/* Image Preview model */}
      <CustomModal
        className={"md image_preview_modal image_modal_sec"}
        show={showImagePreviewModel}
        handleClose={() => {
          setImagePreview("");
          setShowImagePreviewModel(false);
        }}
      >
        <div className="image_preview">
          <img
            src={imagePreview || userPlaceholder}
            alt="user-profile-preview"
          />
        </div>
      </CustomModal>
    </>
  );
};

export default UserManagement;
