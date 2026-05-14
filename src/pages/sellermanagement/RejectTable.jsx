import { userPlaceholder } from "assets/icons";
import { song_banner, upload_img } from "assets/images";
import NotFound from "common/NotFound";
import CustomModal from "components/modals/CustomModal";
import DeleteModal from "components/modals/DeleteModal";
import React, { useState } from "react";
import { CgUnblock } from "react-icons/cg";
import { FaEye, FaRegEye, FaTrash } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import { PiLineVerticalLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import { formatDate } from "utils/dateFormat";
import { charLimit, findSerialNumber } from "utils/formValidator";
import { helperFunForNa } from "utils/helperFunForNa";

const RejectTable = ({ userList = [], limits = 10, activePage = 1 }) => {
   console.log("userList in reject table:--***kkkkk>", userList);
  const [descriptionModal, setDescriptionModal] = useState(false);
  const [description, setDescription] = useState("");
  const [descriptonTitle, setDescriptionTitle] = useState("Reason");

  // Handle answer description
  const handerAnswerDescription = (data, title) => {
    setDescriptionModal(true);
    setDescriptionTitle(title || "");
    setDescription(
      <p
        dangerouslySetInnerHTML={{
          __html: data,
        }}
      ></p>
    );
  };

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
            <th className="nowrap text-center">Artist ID</th>
            <th className="nowrap text-center">Profile</th>
            <th className="nowrap text-center">Name</th>
            <th className="nowrap text-center">Phone Number</th>
            <th className="nowrap text-center">Rejected Reason</th>
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
                {/* <td className="text-center">
                  <img
                    className="cstm_img_table"
                    src={data?.artistProfile || userPlaceholder}
                    alt=""
                    onClick={() =>
                      showImagePreviewHandler(data?.artistProfile || userPlaceholder)
                    }
                  />
                </td> */}

                                <td className="text-center">{helperFunForNa(data?.email)} </td>

                <td className="text-center">{helperFunForNa(data?.artistName)} </td>
                <td className="text-center">+91 {data?.mobile}</td>
                {/* <td className="text-center"> {formatDate(data?.createdAt)}</td> */}

                <td className="wrap text-center">
                  {data?.rejectedReason?.length > 20 ? (
                    <div className="btn-format">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: charLimit(data?.rejectedReason, 20),
                        }}
                      ></span>
                      &nbsp;
                      <button
                        type="button"
                        onClick={() =>
                          handerAnswerDescription(
                            data?.rejectedReason,
                            "Reason"
                          )
                        }
                        className="color-blue"
                      >
                        Read More
                      </button>
                    </div>
                  ) : (
                    <p
                      dangerouslySetInnerHTML={{
                        __html: data?.rejectedReason,
                      }}
                    ></p>
                  )}
                </td>

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

      {/* ----------title view */}
      {descriptionModal && (
        <CustomModal
          className={" md add_model descriptionModal_data"}
          show={descriptionModal}
          handleClose={() => {
            setDescriptionModal(false);
          }}
        >
          <div className="top-heading">
            <h2>{descriptonTitle}</h2>
          </div>
          {description}
        </CustomModal>
      )}

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

export default RejectTable;
