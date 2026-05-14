import { song_banner } from "assets/images";
import React, { useEffect, useState } from "react";
import { CiPlay1 } from "react-icons/ci";
import { FaRegEye } from "react-icons/fa";
import { PiLineVerticalLight } from "react-icons/pi";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getUserPopularApi } from "services/userManagement";

import ReactPaginate from "react-paginate";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import useFullPageLoader from "common/UseFullPageLoader";
import AudioModal from "components/modals/audioModal";
import CustomModal from "components/modals/CustomModal";
import { userPlaceholder } from "assets/icons";
import { findSerialNumber } from "utils/formValidator";

const PopularTable = ({}) => {
  const [showAudio, setShowAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioTitle, setAudioTitle] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const [loader, onShow, onHide] = useFullPageLoader();

  const { userId } = useParams();
  const [popularSongs, setPopularSongs] = useState([]);
  const [total, setTotal] = useState();
  const activePage = +searchParams.get("page") || 1;
  const limits = +searchParams.get("limit") || 10;
  const search = searchParams.get("search") || "";
  const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const showImagePreviewHandler = (profile) => {
    setShowImagePreviewModel(true);
    setImagePreview(profile);
  };

  const getUserPopularFun = async () => {
    onShow();
    let payload = {
      userId: userId,
      page: activePage,
      limit: limits,
    };
    try {
      const {
        data: { status, data },
      } = await getUserPopularApi(payload);
      if (status === 200) {
        setPopularSongs(data.songData || []);
        setTotal(data.totalUploadedSongs);

        // setTotal
      }
    } catch (error) {
      console.log("error", error);
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

  useEffect(() => {
    if (userId) {
      getUserPopularFun();
    }
  }, [userId, limits, activePage]);

  return (
    <div className="table_wrap table_responsive">
      <table className="table custom_table">
        <thead>
          <tr>
                        <th className="nowrap text-center">S.No</th>

            <th className="nowrap text-center">Song ID </th>
            <th className="nowrap text-center">Cover Image</th>
            <th className="nowrap text-center">Name</th>
            <th className="nowrap text-center">Added By</th>
            <th className="nowrap text-center">Genre</th>
            <th className="nowrap text-center">Mood</th>
            <th className="nowrap text-center">Added On</th>
            <th className="nowrap text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {popularSongs.length > 0 ? (
            popularSongs.map((song, index) => (
              <tr key={song?._id || index}>
                   <td className="text-center">
                  {findSerialNumber(index, activePage, limits)}</td>
                  
                <td className="text-center">{song?.songNumber || "—"}</td>

                <td className="text-center">
                  <img
                    className="cstm_img_table"
                    src={song?.coverImage || song_banner}
                    alt=""
                    onClick={() =>
                      showImagePreviewHandler(
                        song?.coverImage || userPlaceholder,
                      )
                    }
                  />
                </td>

                <td className="text-center">{song?.songTitle || "—"}</td>

                <td className="text-center">{song?.artistName || "—"}</td>

                <td className="text-center">{song?.genres[0] || "—"}</td>

                <td className="text-center">{song?.moods[0] || "—"}</td>

                <td className="text-center">
                  {song?.createdAt
                    ? new Date(song.createdAt).toLocaleDateString()
                    : "—"}
                </td>

                <td className="text-center">
                  <div className="common_view">
                    {/* <Link to={`/song/play/${song?._id}`}>
                      <CiPlay1 />
                    </Link> */}

                    <CiPlay1
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setAudioUrl(song?.songAudioFile); // your audio file path
                        setAudioTitle(song?.songTitle);
                        setShowAudio(true);
                      }}
                    />

                    <PiLineVerticalLight />
                    {/* <Link to={`/song/view/${song?._id}`}>
                      <FaRegEye />
                    </Link> */}
                    <Link
                      to={`/song-management/request-detail/${song?._id}?tab=artist`}
                    >
                      <FaRegEye />
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No Popular Songs Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {total > limits && (
        <div className="pagination-wrapper">
          <ReactPaginate
            forcePage={activePage - 1}
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
      {/* ✅ ALWAYS render modal */}
      <AudioModal
        open={showAudio}
        audioUrl={audioUrl}
        title={audioTitle}
        onClose={() => setShowAudio(false)}
      />
    </div>
  );
};

export default PopularTable;
