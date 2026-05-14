import React, { useEffect, useState } from "react";
import "./bannermanagement.scss";
import { Button, SwitchButton, TextArea } from "components/form";
import { song_banner } from "assets/images";
import { Link, useSearchParams } from "react-router-dom";
import { FaEye, FaTrash } from "react-icons/fa";
import BannerModal from "./BannerModal";
import ReactPaginate from "react-paginate";
import Toggle from "../../components/modals/Toggle";
// import {SwitchButton } from "../../components/form";

import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";

import {
  getBannerListApi,
  deleteBannerApi,
  changeStatusAPI,
} from "services/bannerManagment";
import useFullPageLoader from "common/UseFullPageLoader";
import NotFound from "common/NotFound";

import DeleteModal from "../../components/modals/DeleteModal";

import { toastMessage } from "utils/toastMessage";
import CustomModal from "components/modals/CustomModal";
import { userPlaceholder } from "assets/icons";


const BannerManagement = () => {
  const [modalAdd, setModalAdd] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loader, onShow, onHide] = useFullPageLoader();
  const [total, setTotal] = useState(null);
  const [detailsData, setDetailsData] = useState({});
  const [logoutModal, setLogoutModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedUser, setSelectedUser] = useState({});
  const [logoutModals, setLogoutModals] = useState(false);
  const [descriptionModal, setDescriptionModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [updateModal, setUpdateModal] = useState(false);


  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const closeAndCLear = () => {
    setDetailsData({});
    setShowStatusModal(false);
    setDeleteModalOpen(false);
  };

  const [bannerList, setBannerData] = useState([]);
  const activePage = +searchParams.get("page") || 1;
  const limits = +searchParams.get("limit") || 10;

  const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const showImagePreviewHandler = (profile) => {
    setShowImagePreviewModel(true);
    setImagePreview(profile);
  };

  const getBanner = async () => {
    const payload = {
      page: activePage,
      limit: limits,
    };

    onShow();

    try {
      const response = await getBannerListApi(payload);

      if (response?.status === 200) {
        const bannerData = response?.data?.data;

        setBannerData(bannerData?.bannerList || bannerData?.data || []);
        setTotal(bannerData?.total || 0);
      }
    } catch (error) {
      console.log("error:-->", error);
    } finally {
      onHide();
    }
  };

  const handleDeleteBanner = async () => {
    if (!detailsData?._id) return;
    onShow();
    try {
      const { data } = await deleteBannerApi(detailsData._id);

      if (data?.status === 200) {
        toastMessage(data.message, "success");
        setIsModalOpen(false);
        setDetailsData({});
        getBanner();
      }
    } catch (error) {
      console.log("Delete error:", error);
    } finally {
      onHide();
    }
  };

  // Handle pagination
  const handlePageChange = (event) => {
    const urlInstance = new URLSearchParams(searchParams);

    urlInstance.set("page", event);
    setSearchParams(urlInstance);
  };

  const handleConfirmStatus = async () => {
    if (!selectedUser?._id) return;

    const currentStatus = selectedUser?.status ?? selectedUser?.isActive;
    const newStatus = !currentStatus;

    onShow();

    try {
      const res = await changeStatusAPI({
        bannerId: selectedUser._id,
        status: newStatus,
      });

      if (res.status === 200) {
        toastMessage("Status updated successfully", "success");

        setLogoutModal(false);
        setSelectedUser({});

        getBanner();
      }
    } catch (err) {
      toastMessage("Failed to update status", "error");
    } finally {
      onHide();
    }
  };

  const logoutModalOpen = (banner) => {
    setSelectedUser(banner);
    setLogoutModal(true);
  };

  useEffect(() => {
    getBanner();
  }, [activePage, limits]);


  const closeAndClear = () => {
    setModalAdd(false);
  };
  return (
    <div className="wrapper_banner_management">
      <div className="dashboard_title">
        <h3>Banner Management</h3>
      </div>

      <div className="banner_management_toolbar">
        <Button className="light_button" onClick={() => setModalAdd(true)}>
          + Add Banner
        </Button>
      </div>

      <div className="table_wrap table_responsive">
        <table className="table custom_table">
          <thead>
            <tr>
              <th className="nowrap text-center">Banner ID</th>
              <th className="nowrap text-center">Image</th>
              <th className="nowrap text-center">Text</th>
              <th className="nowrap text-center">Placement</th>
              <th className="nowrap text-center">Total Clicks</th>
              <th className="nowrap text-center">Status</th>
              <th className="nowrap text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bannerList && bannerList?.length > 0 ? (
              bannerList.map((data, index) => (
                <tr key={index}>
                  <td className="text-center">
                    {data?.bannerNumber ? data?.bannerNumber : "N/A"}
                  </td>
                  <td className="text-center">
                    <img className="cstm_img_table" src={data?.image} alt="" onClick={() =>
                          showImagePreviewHandler(
                            data?.image || userPlaceholder,
                          )
                        } />
                  </td>
                  {/* <td className="text-center">{data?.description}</td> */}

                  <td
                    className="text-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedDescription(data?.description);
                      setDescriptionModal(true);
                    }}
                  >
                    {data?.description?.length > 10 ? (
                      <>{data?.description?.slice(0, 15)}... Read more</>
                    ) : (
                      data?.description
                    )}
                  </td>
                  <td className="text-center">{data?.type} </td>
                  <td className="text-center">
                    {data?.totalClicks ? data?.totalClicks : "0"}
                  </td>
                  <td className="text-center">
                    {/* <SwitchButton /> */}
                    <SwitchButton
                      status={data?.status ?? data?.isActive}
                      onChange={() => logoutModalOpen(data)}
                    />
                  </td>
                  <td className="text-center">
                    <div className="common_view actions_wrap">
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
              <NotFound msg="Banner list not available" onHide={true} />
            )}
          </tbody>
        </table>
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

      <BannerModal
        modalAdd={modalAdd}
        closeAndClear={closeAndClear}
        refreshList={getBanner}
      />

      <DeleteModal
        heading="Are you sure you want to delete this banner?"
        show={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setDetailsData({});
        }}
        onConfirm={handleDeleteBanner}
      />

      <Toggle
        heading="Are you sure you want to Change Status of this Banner?"
        show={logoutModal}
        onClose={() => {
          setLogoutModal(false);
          setSelectedUser({});
        }}
        onConfirm={handleConfirmStatus}
      />

      <CustomModal
        show={descriptionModal}
        handleClose={() => setDescriptionModal(false)}
      >
        <h3>Banner Message</h3>

        <div className="form_field" style={{ marginTop: "10px" }}>
          <TextArea
            name="fullMessage"
            value={selectedDescription}
            readOnly
            style={{
              height: "150px",
              padding: "12px",
              resize: "none",
            }}
          />
        </div>

        <div className="button_wrap" style={{ marginTop: "15px" }}>
          <Button onClick={() => setDescriptionModal(false)}>Close</Button>
        </div>
      </CustomModal>


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
    </div>
  );
};

export default BannerManagement;
