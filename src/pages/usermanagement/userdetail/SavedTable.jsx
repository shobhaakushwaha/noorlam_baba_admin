import { song_banner } from "assets/images";
import NotFound from "common/NotFound";
import React, { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { getUsersSaveListApi } from "services/userManagement";
import { userPlaceholder } from "assets/icons";
import { helperFunForNa } from "utils/helperFunForNa";
import { formatDate } from "utils/dateFormat";
import CustomModal from "components/modals/CustomModal";

const SavedTable = () => {
  const { userId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [total, setTotal] = useState();
  const [playList, setPlayList] = useState([]);
  const activePage = +searchParams.get("page") || 1;
  const limits = +searchParams.get("limit") || 10;
  const [userDetailsInfo, setUserDetailsInfo] = useState({});
   const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
    const [showAudio, setShowAudio] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");
    const [audioTitle, setAudioTitle] = useState("");

  const handlePageChange = (event) => {
    const urlInstance = new URLSearchParams(searchParams);

    urlInstance.set("page", event);
    setSearchParams(urlInstance);
  };

  const getUserSavedList = async () => {
    // onShow();
    let payload = {
      userId: userId,
      page: activePage,
      limit: limits,
      type: "saved",
    };
    try {
      const {
        data: { status, data },
      } = await getUsersSaveListApi(payload);

      if (status === 200) {
        setUserDetailsInfo(data || {});
        setPlayList(data.data);
        setTotal(data.total);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      // onHide();
    }
  };


  

  const showImagePreviewHandler = (profile) => {
    setShowImagePreviewModel(true);
    setImagePreview(profile);
  };

  useEffect(() => {
    if (userId) {
      getUserSavedList();
    }
  }, [userId,activePage,limits]);
  return (
    <div className="table_wrap table_responsive ">
      <table className="table custom_table">
        <thead>
          <tr>
            <th className="nowrap text-center">Playlists ID</th>
            <th className="nowrap text-center">Thubnail </th>
            <th className="nowrap text-center">Title</th>
            <th className="nowrap text-center">No. Of Songs</th>
            <th className="nowrap text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {playList && playList?.length > 0 ? (
            playList.map((data, index) => (
              <tr key={index}>
                <td className="text-center">
                  {data?.playlistNumber}
                </td>
                <td className="text-center">
                  <img
                    className="cstm_img_table profile_img"
                    src={data?.coverImage || userPlaceholder}
                    alt=""
                    onClick={() =>
                      showImagePreviewHandler(
                        data?.coverImage || userPlaceholder,
                      )
                    }
                  />
                </td>
                <td className="text-center">{helperFunForNa(data?.name)} </td>
                <td className="text-center">{data?.totalSongs}</td>

                <td className="text-center">
                  <div className="common_view single_view">
                    <Link
                      className="cstm_anchor"
                      to={`/user-management/user-detail/${userId}/saved-playlist/${data?._id}`}

                    >
                      <FaRegEye />
                      <span>View</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <NotFound msg="No Saved data found" onHide={true} />
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
        </tbody>
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
      </table>
    </div>
  );
};

export default SavedTable;
