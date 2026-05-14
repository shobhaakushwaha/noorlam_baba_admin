import { userPlaceholder } from "assets/icons";
import NotFound from "common/NotFound";
import CustomModal from "components/modals/CustomModal";
import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { formatDate } from "utils/dateFormat";
import { findSerialNumber } from "utils/formValidator";
import { helperFunForNa } from "utils/helperFunForNa";

const RequestTable = ({ userList = [], limits = 10, activePage = 1 }) => {
  // show image preview handler

  const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const showImagePreviewHandler = (profile) => {
    setShowImagePreviewModel(true);
    setImagePreview(profile);
  };
  return (
    <div className="table_wrap table_responsive ">
      <table className="table custom_table">
        <thead>
          <tr>
            <th className="nowrap text-center">S.No</th>
            <th className="nowrap text-center">Artist ID</th>
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
                  {helperFunForNa(data?.userNumber || data?.email)}
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
                  {helperFunForNa(data?.artistName)}{" "}
                </td>
                <td className="text-center">
                  {data?.mobile
                    ? `${data?.countryCode || "+91"} ${data.mobile}`
                    : "N/A"}
                </td>
                <td className="text-center"> {formatDate(data?.createdAt)}</td>
                <td className="text-center">
                  <div className="common_view single_view">
                    <Link
                      className="cstm_anchor"
                      to={`/seller-management/request-detail/${data?._id}`}
                    >
                      <FaRegEye />
                      <span>View</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <NotFound msg="Request list not available" onHide={true} />
          )}
        </tbody>
      </table>

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
    </div>
  );
};

export default RequestTable;
