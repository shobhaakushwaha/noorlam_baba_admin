import { song_banner } from "assets/images";
import NotFound from "common/NotFound";
import useFullPageLoader from "common/UseFullPageLoader";
import React, { useEffect, useState } from "react";
import { CiPlay1 } from "react-icons/ci";
import { FaRegEye } from "react-icons/fa";
import { PiLineVerticalLight } from "react-icons/pi";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getSongdetailsApi, getUserdetailsApi } from "services/userManagement";
import { formatDate } from "utils/dateFormat";
import ReactPaginate from "react-paginate";
import { userPlaceholder } from "assets/icons";

import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import AudioModal from "components/modals/audioModal";
import CustomModal from "components/modals/CustomModal";
import { findSerialNumber } from "utils/formValidator";

const UpdatedTable = () => {
  const [loader, onShow, onHide] = useFullPageLoader();
  const [showAudio, setShowAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioTitle, setAudioTitle] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const activePage = +searchParams.get("page") || 1;
  const limits = +searchParams.get("limit") || 10;
  const search = searchParams.get("search") || "";

  const { userId } = useParams();
  const [total, setTotal] = useState([]);

  const [userDetailsInfo, setUserDetailsInfo] = useState({});
  const [songList, setSongList] = useState([]);
  

  const getUserdetailsApi = async () => {
    onShow();
    try {
      const {
        data: { status, data },
      } = await getUserdetailsApi({ id: userId });

      if (status === 200) {
        setUserDetailsInfo(data || {});
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      onHide();
    }
  };
  const getUserDetailsFun = async () => {
    onShow();
    let payload = {
      userId: userId,
      role: "artist",
    };
    try {
      const {
        data: { status, data },
      } = await getSongdetailsApi(payload);

      // logger.log("data data:++++++++++++++++++++++++++--->", data);
      console.log(data, "++++++++++++++ details ++++++++++");

      if (status === 200) {
        // setUserDetailsInfo(data?.user || {});
        setUserDetailsInfo(data?.songData || {});
        // console.log(data.totalUploadedSongs," HELLOW")
        setTotal(data.totalUploadedSongs);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      onHide();
    }
  };

  const getUserSongFun = async () => {
    onShow();
    let payload = {
      userId: userId,
      // role :'artist'
      page: activePage,
      limit: limits,
    };
    try {
      const {
        data: { status, data },
      } = await getSongdetailsApi(payload);

      if (status === 200) {
        setSongList(data?.songData || {});
        setTotal(data?.totalUploadedSongs);
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
      getUserDetailsFun();
      getUserSongFun();
    }
  }, [userId, activePage, limits]);

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
          <tr>            <th className="nowrap text-center">S.No</th>

            <th className="nowrap text-center">Song ID</th>
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
          {songList && songList?.length > 0 ? (
            songList.map((data, index) => (
             

              <tr key={index}>
                <td className="text-center">
                                  {findSerialNumber(index, activePage, limits)}</td>
                <td className="text-center">{data?.songNumber}</td>
                <td className="text-center">
                  <img
                    className="cstm_img_table"
                    src={data?.coverImage}
                    alt=""
                    onClick={() =>
                          showImagePreviewHandler(
                            data?.coverImage || userPlaceholder,
                          )
                        }
                  />
                </td>
                <td className="text-center">{data.songTitle} </td>
                <td className="text-center">{data?.artistName}</td>
                <td className="text-center">{data?.genres[0]}</td>
                <td className="text-center">{data?.moods[0]}</td>
                <td className="text-center">{formatDate(data?.createdAt)}</td>
                <td className="text-center">
                  <div className="common_view">
                    {/* <Link to={"/"}>
                      <CiPlay1 />
                    </Link> */}
                    <CiPlay1
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setAudioUrl(data?.songAudioFile); // your audio file path
                        setAudioTitle(data?.songTitle);
                        setShowAudio(true);
                      }}
                    />
                    <PiLineVerticalLight />
                    <Link
                      to={`/song-management/request-detail/${data?._id}?tab=artist`}
                    >
                      <FaRegEye />
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <NotFound msg="User list not available" onHide={true} />
          )}

          {/* {total > limits && (
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
      )} */}
        </tbody>
      </table>
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
      <AudioModal
        open={showAudio}
        audioUrl={audioUrl}
        title={audioTitle}
        onClose={() => setShowAudio(false)}
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

export default UpdatedTable;
