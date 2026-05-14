import { song_banner } from "assets/images";
import NotFound from "common/NotFound";
import useFullPageLoader from "common/UseFullPageLoader";
import DeleteModal from "components/modals/DeleteModal";
import useDebounce from "hooks/UseDebounce";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { PiLineVerticalLight } from "react-icons/pi";
import { TbEdit } from "react-icons/tb";
import { userPlaceholder } from "assets/icons";

import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
} from "react-icons/tb";
import ReactPaginate from "react-paginate";
import { useSearchParams } from "react-router-dom";
import {
  ContentPlayListApi,
  deleteContanentPlayListApi,
} from "services/contentsmgmt";
import { dateFormat } from "utils/dateFormat";
import { toastMessage } from "utils/toastMessage";
import CustomModal from "components/modals/CustomModal";

const PlaylistTable = ({ search, refreshKey, onEdit }) => {
  const [loader, onShow, onHide] = useFullPageLoader();
  const [detailsData, setDetailsData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playList, setPlayList] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  const debouncedValue = useDebounce(search, 300);
  const activePage = +searchParams.get("page") || 1;
  const limits = +searchParams.get("limit") || 10;
   const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const showImagePreviewHandler = (profile) => {
    setShowImagePreviewModel(true);
    setImagePreview(profile);
  };
  

  const listData = async () => {
    let data = {
      page: activePage,
      limit: limits,
      search: debouncedValue,
    };

    try {
      const { data: response, status } = await ContentPlayListApi(data);
      if (status === 200) {
        console.log(response.data.data, " SONG DETAILS Playlist");
        setPlayList(response.data.data);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlayListDelete = async () => {
    if (!detailsData?._id) return;

    onShow();
    try {
      const { data } = await deleteContanentPlayListApi(detailsData._id);

      if (data?.status === 200) {
        toastMessage(data.message, "success");

        setPlayList((prev) =>
          prev.filter((item) => item._id !== detailsData._id)
        );

        setIsModalOpen(false);
        setDetailsData({});
      }
    } catch (error) {
      console.log("Delete error:", error);
    } finally {
      onHide();
    }
  };

  const handlePageChange = (event) => {
    const urlInstance = new URLSearchParams(searchParams);
    urlInstance.set("page", event);
    setSearchParams(urlInstance);
  };

  useEffect(() => {
    listData();
  }, [activePage, limits, debouncedValue, refreshKey]);

  return (
    <>
      <div className="table_wrap table_responsive">
        <table className="table custom_table">
          <thead>
            <tr>
              <th className="nowrap text-center">Content ID</th>
              <th className="nowrap text-center">Cover</th>
              <th className="nowrap text-center">Name</th>
              <th className="nowrap text-center">Added By</th>
              <th className="nowrap text-center">Genre</th>
              <th className="nowrap text-center">Mood</th>
              <th className="nowrap text-center">Created At</th>
              <th className="nowrap text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {playList && playList.length > 0 ? (
              playList.map((data, index) => {
                return (
                  <tr key={data._id || index}>
                    <td className="text-center">
                      {data.playlistNumber ? data.playlistNumber : "N/A"}
                    </td>
                    <td className="text-center">
                      <img
                        className="cstm_img_table"
                        src={data?.coverImage}
                        alt=""  onClick={() =>
                          showImagePreviewHandler(
                            data?.coverImage || userPlaceholder,
                          )
                        }
                      />
                    </td>
                    <td className="text-center">{data?.name}</td>
                    <td className="text-center">{data.addedBy}</td>
                    <td className="text-center">
                      {data?.genres?.name ? data?.genres?.name : "N/A"}
                    </td>
                    <td className="text-center">
                      {data?.moods?.name ? data.moods?.name : "N/A"}
                    </td>
                    <td className="text-center">
                      {dateFormat(data?.createdAt)}
                    </td>
                    <td className="text-center">
                      <div className="common_view actions_wrap">
                        <TbEdit
                          onClick={() => {
                            if (onEdit) onEdit(data);
                          }}
                        />
                        <PiLineVerticalLight />
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
                );
              })
            ) : (
              <NotFound
                cols={8}
                msg={"Play list  not found"}
                onHide={onHide}
              />
            )}
          </tbody>
        </table>
      </div>

      {total > limits && (
        <div className="pagination-wrapper">
          <ReactPaginate
            forcePage={activePage - 1}
            pageCount={Math.ceil(total / limits)}
            onPageChange={(e) => handlePageChange(e.selected + 1)}
            previousLabel={<TbPlayerTrackPrevFilled size={25} />}
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
      <DeleteModal
        heading={"Are you sure you want to delete this Playlist?"}
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePlayListDelete}
      />
    </>
  );
};

export default PlaylistTable;