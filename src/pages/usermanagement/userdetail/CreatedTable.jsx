import { song_banner } from "assets/images";
import NotFound from "common/NotFound";
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getUsersSaveListApi } from "services/userManagement";
import { userPlaceholder } from "assets/icons";
import { formatDate } from "utils/dateFormat";
import ReactPaginate from "react-paginate";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import CustomModal from "components/modals/CustomModal";

const CreatedTable = () => {
  const { userId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [total, setTotal] = useState();

  const [createplayList, setcreatePlayList] = useState([]);
  const activePage = +searchParams.get("page") || 1;
  const limits = +searchParams.get("limit") || 10;
  const [userDetailsInfo, setUserDetailsInfo] = useState({});
     const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const handlePageChange = (event) => {
    const urlInstance = new URLSearchParams(searchParams);

    urlInstance.set("page", event);
    setSearchParams(urlInstance);
  };



  const showImagePreviewHandler = (profile) => {
    setShowImagePreviewModel(true);
    setImagePreview(profile);
  };

  const getUserSavedList = async () => {
    // onShow();
    let payload = {
      userId: userId,
      // role: "",
      page: activePage,
      limit: limits,
      type: "created",
    };
    try {
      const {
        data: { status, data },
      } = await getUsersSaveListApi(payload);

      if (status === 200) {
        setUserDetailsInfo(data || {});
        setcreatePlayList(data.data);
        console.log(data.data, "Save Playlist");
        setTotal(data.total);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      // onHide();
    }
  };

  useEffect(() => {
    if (userId) {
      getUserSavedList();
    }
  }, [userId]);
  return (
    <div className="table_wrap table_responsive ">
      <table className="table custom_table">
        <thead>
          <tr>
            <th className="nowrap text-center">Playlists ID</th>
            <th className="nowrap text-center">Thubnail</th>
            <th className="nowrap text-center">Title</th>
            <th className="nowrap text-center">No. Of Songs</th>
            <th className="nowrap text-center">Created On</th>
          </tr>
        </thead>
        <tbody>
          {createplayList && createplayList?.length > 0 ? (
            createplayList.map((data, index) => (
              <tr key={index}>
                <td className="text-center">{data?.playlistNumber}</td>
                <td className="text-center">
                  {/* <img className="cstm_img_table" src={data?.coverImage} alt="" /> */}
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
                <td className="text-center">
                  {data?.name ? data?.name : "N/A"}{" "}
                </td>

                <td className="text-center">{data?.totalSongs}</td>
                <td className="text-center">{formatDate(data?.createdAt)}</td>
              </tr>
            ))
          ) : (
            <NotFound msg="Play list not available" onHide={true} />
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
    </div>
    
  );
};

export default CreatedTable;
