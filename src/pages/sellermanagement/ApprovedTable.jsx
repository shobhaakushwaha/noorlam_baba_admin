import { userPlaceholder } from "assets/icons";
import { song_banner, upload_img } from "assets/images";
import NotFound from "common/NotFound";
import { SwitchButton } from "components/form";
import CustomModal from "components/modals/CustomModal";
import DeleteModal from "components/modals/DeleteModal";
import React, { useState } from "react";
import { CgUnblock } from "react-icons/cg";
import { FaEye, FaTrash } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import { PiLineVerticalLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import { findSerialNumber } from "utils/formValidator";
import { helperFunForNa } from "utils/helperFunForNa";

const ApprovedTable = ({
  userList = [],
  limits = 10,
  activePage = 1,
  setShowStatusModal = () => {},
  setDetailsData = () => {},
  setDeleteModalOpen = () => {},
  dashboardTab = { dashboardTab },
}) => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  console.log(userList,"*********************")
  // show image preview handler

  const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const showImagePreviewHandler = (profile) => {
    setShowImagePreviewModel(true);
    setImagePreview(profile);
  };
  return (
    <>
      <div className="table_wrap table_responsive">
        <table className="table custom_table">
          <thead>
            <tr>
                            <th className="nowrap text-center">S.No</th>

              <th className="nowrap text-center">Artist ID</th>
              <th className="nowrap text-center">Profile</th>
              <th className="nowrap text-center">Name</th>
              <th className="nowrap text-center">Phone Number</th>
              <th className="nowrap text-center">Total Songs Uploaded </th>
              <th className="nowrap text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList && userList?.length > 0 ? (
              userList.map((data, index) => (
                <tr key={index}>
                    <td className="text-center">
  {findSerialNumber(index, activePage, limits)}                  </td>
                  
                  <td className="text-center">
                    {helperFunForNa(data?.userNumber)}
                  </td>
                  <td className="text-center">
                    <img
                      className="cstm_img_table"
                      src={data?.artistProfile || userPlaceholder}
                      alt=""
                      onClick={() =>
                        showImagePreviewHandler(
                          data?.artistProfile || userPlaceholder,
                        )
                      }
                    />
                  </td>
                  <td className="text-center">
                    {helperFunForNa(data?.artistName)}
                  </td>
                  <td className="text-center">+91 {data?.mobile}</td>
                  <td className="text-center">
                    {data?.totalApprovedSongs ?? "NA"}
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
                        {!data?.isArtistActive ? (
                          <MdBlock className="block" />
                        ) : (
                          <CgUnblock className="unblock" />
                        )}
                      </div>
                      <PiLineVerticalLight />
                      <Link to={`/seller-management/seller-detail/${data._id}`}>
                        <FaEye />
                      </Link>
                      <PiLineVerticalLight />
                      <FaTrash
                        className="red"
                        onClick={() => {
                          setDeleteModalOpen(true);
                          setDetailsData(data);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <NotFound msg="Approved list not available" onHide={true} />
            )}
          </tbody>
        </table>
      </div>
      {/* delet modal */}
      <DeleteModal
        show={isModalOpen}
        image={<FaTrash />}
        onClose={() => setIsModalOpen(false)}
        heading="Are you sure you want to delete this User?"
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

export default ApprovedTable;
