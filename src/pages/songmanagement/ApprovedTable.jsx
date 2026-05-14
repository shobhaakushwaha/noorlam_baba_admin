import React, { useEffectEvent, useRef, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { songManagementRequestDetailsApi } from "services/songMangement";
import { helperFunForNa } from "utils/helperFunForNa";
import { logger } from "utils/logger";
import { dateFormat } from "../../utils/dateFormat";
import { deleteSongApi } from "../../services/songMangement";
import DeleteModal from "components/modals/DeleteModal";
import useFullPageLoader from "common/UseFullPageLoader";
import { PiLineVerticalLight } from "react-icons/pi";
import { toastMessage } from "utils/toastMessage";
import { userplaceholder } from "assets/images";
import { userPlaceholder } from "assets/icons";
import CustomModal from "components/modals/CustomModal";
import { findSerialNumber } from "utils/formValidator";


// const ApprovedTable = (songsLists, activePage, limits, dashboardTab,refreshList) => {

  const ApprovedTable = ({
  songsList,
  activePage,
  limits,
  dashboardTab,
  refreshList
}) => {

  // const songsList = songsLists?.songsList;
 const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const showImagePreviewHandler = (profile) => {
    setShowImagePreviewModel(true);
    setImagePreview(profile);
  };

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [loader, onShow, onHide] = useFullPageLoader();
  const [total, setTotal] = useState(null);
  const [detailsData, setDetailsData] = useState({});

  const [logoutModal, setLogoutModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);



  const handleDeleteSong = async () => {
  if (!detailsData?._id) return;

  onShow();

  try {
    const { data } = await deleteSongApi(detailsData._id);

    if (data?.status === 200) {
      toastMessage(data.message, "success");

      setIsModalOpen(false);
      setDetailsData({});

      refreshList(); // ✅ auto refresh table
    }
  } catch (error) {
    console.log("Delete error:", error);
  } finally {
    onHide();
  }
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
            <th className="nowrap text-center">AddedOn</th>
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
                    src={data?.coverImage || userplaceholder}
                    alt=""
                    onClick={() =>

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
                  {data?.createdAt ? dateFormat(data?.createdAt) : "NA"}
                </td>
                <td className="text-center">
                  <div className="common_view actions_wrap">
                    {/* <FaEdit/> */}
                    {/* <PiLineVerticalLight/> */}

                    <Link
                      className="cstm_anchor"
                      to={`/song-management/request-detail/${data?._id}?tab=${dashboardTab}`}

                    >

                    {/* <Link
  className="cstm_anchor"
  to={`/song-management/request-detail/${data?._id}`}
  state={{ tab: dashboardTab }}
> */}

                      <FaEye />
                    </Link>
                    <PiLineVerticalLight/>
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
            ))}
        </tbody>
      </table>
      <DeleteModal
        show={isModalOpen}
        heading="Are you sure you want to delete this song?"
        onClose={() => {
          setIsModalOpen(false);
          setDetailsData({});
        }}
        onConfirm={handleDeleteSong}
      />
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

export default ApprovedTable;
