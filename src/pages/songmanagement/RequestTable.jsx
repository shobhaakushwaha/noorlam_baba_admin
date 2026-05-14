import { musicimg, song_banner } from "assets/images";
import CustomModal from "components/modals/CustomModal";
import React, { useEffect, useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import { PiLineVerticalLight } from "react-icons/pi";
import { TbEdit } from "react-icons/tb";
import { Link } from "react-router-dom";
import { findSerialNumber } from "utils/formValidator";
import { helperFunForArrayNa, helperFunForNa } from "utils/helperFunForNa";
import { userPlaceholder } from "assets/icons";


const RequestTable = ({ songsList, activePage, limits, dashboardTab }) => {
  const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const showImagePreviewHandler = (profile) => {
    setShowImagePreviewModel(true);
    setImagePreview(profile);
  };
  return (
    <div className="table_wrap table_responsive">
      <table className="table custom_table">
        <thead>
          <tr>
                                    <th className="nowrap text-center">S.No</th>

            <th className="nowrap text-center">Song ID</th>
            <th className="nowrap text-center">Cover Image</th>
            <th className="nowrap text-center">Song Name </th>
            <th className="nowrap text-center">Artist Name</th>
            <th className="nowrap text-center">Genre</th>
            <th className="nowrap text-center">Mood</th>
            <th className="nowrap text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {songsList &&
            songsList?.length > 0 &&
            songsList.map((data, ind) => (
              <tr key={ind}>
                   <td className="text-center">
                  {findSerialNumber(ind, activePage, limits)}
                </td>
                <td className="text-center">
                  {/* {findSerialNumber(ind, activePage, limits)} */}
                  {data?.songNumber}
                </td>
                <td className="text-center">
                  <img
                    className="cstm_img_table"
                    src={data?.coverImage || musicimg}
                    alt="" onClick={() =>
                          showImagePreviewHandler(
                            data?.coverImage || userPlaceholder,
                          )
                        }
                  />
                </td>
                <td className="text-center">
                  {helperFunForNa(data?.songTitle)}
                </td>
                <td className="text-center">
                  {helperFunForNa(data?.artist?.artistName)}{" "}
                </td>
                <td className="text-center">
                  {helperFunForNa(data?.genre?.name)}
                </td>
                <td className="text-center">
                  {data?.moods?.length > 0 ? data?.moods.join(", ") : "NA"}
                </td>
                <td className="text-center">
                  <div className="common_view single_view">
                    <Link
                      className="cstm_anchor"
                      to={`/song-management/request-detail/${data?._id}`}
                    >
                      <FaEye />
                      <span>View</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
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
            
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;
