import { song_banner } from "assets/images";
import DeleteModal from "components/modals/DeleteModal";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { PiLineVerticalLight } from "react-icons/pi";
import { TbEdit } from "react-icons/tb";
import { useSearchParams } from "react-router-dom";
// import { ContentListApi } from "services/contentManagement";
import {
  ContentListApi,
  deleteContanentApi,
} from "../../services/contentsmgmt";
import useFullPageLoader from "common/UseFullPageLoader";
import useDebounce from "hooks/UseDebounce";
import NotFound from "common/NotFound";
import ReactPaginate from "react-paginate";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import { dateFormat } from "utils/dateFormat";
import { toastMessage } from "utils/toastMessage";
import AddSongsModal from "./AddSongsModal";
import CustomModal from "components/modals/CustomModal";
import { userPlaceholder } from "assets/icons";


const SongTable = ({ search, refreshKey }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, onShow, onHide] = useFullPageLoader();
  const [songList, setSongList] = useState([]);
  const [editSong, setEditSong] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [detailsData, setDetailsData] = useState({});

  const [faqList, setFaqList] = useState([]);
  const [total, setTotal] = useState();
  const [count, setCount] = useState();
  const [selectedId, setSelectedId] = useState(null);

  const [addSongModal, setAddSongModal] = useState(false);
   const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const showImagePreviewHandler = (profile) => {
    setShowImagePreviewModel(true);
    setImagePreview(profile);
  };

  const closeAndClear = () => {
    setAddSongModal(false);
  };

  const debouncedValue = useDebounce(search, 300);

  const activePage = +searchParams.get("page") || 1;
  const limits = +searchParams.get("limit") || 10;

  const listData = async () => {
    let data = {
      page: activePage,
      limit: limits,
      search: debouncedValue,
    };

    try {
      const { data: response, status } = await ContentListApi(data);
      if (status === 200) {
        console.log(response, " SONG DETAILS");
        setFaqList(response?.data?.songs);
        console.log(response?.data?.songs, " jjjj");
        setTotal(response.data.total);
        setCount(response?.counts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteBanner = async () => {
    if (!detailsData?._id) return;

    onShow();
    try {
      const { data } = await deleteContanentApi(detailsData._id);

      if (data?.status === 200) {
        toastMessage(data.message, "success");

        setFaqList((prev) =>
          prev.filter((item) => item._id !== detailsData._id),
        );
        setTotal((prev) => prev - 1);

        setIsModalOpen(false);
        setDetailsData({});
      }
    } catch (error) {
      console.log("Delete error:", error);
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

  const openAddModal = () => {
    setEditSong(null);
    setShowModal(true);
  };

  const openEditSong = (song) => {
    setEditSong(song);
    setAddSongModal(true);
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
              <th className="nowrap text-center">Added On</th>
              <th className="nowrap text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqList && faqList.length > 0 ? (
              faqList.map((data, index) => {
                return (
                  <tr key={index}>
                    <td className="text-center">
                      {data.songNumber ? data.songNumber : "N/A"}
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
                    <td className="text-center">{data?.songTitle} </td>
                    <td className="text-center">{data.addedBy[0]}</td>
                    <td className="text-center">
                      {data?.genre[0] ? data?.genre[0] : "N/A"}
                    </td>

                    <td className="text-center">
                      {data.moodList[0] ? data.moodList[0] : "N/A"}
                    </td>
                    {/* {data?.moods?.length > 0 ? data?.moods.join(", ") : "NA"} */}

                    <td className="text-center">
                      {" "}
                      {dateFormat(data?.releaseDate)}
                    </td>
                    <td className="text-center">
                      <div className="common_view actions_wrap">
                        <TbEdit
                          onClick={() => {
                            setEditSong(data);
                            setAddSongModal(true);
                          }}
                        />

                        <PiLineVerticalLight />
                        {/* <FaTrash
                          className="red"
                          onClick={() => setIsModalOpen(true)}
                        /> */}

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
                cols={10}
                msg={"Song List not found"}
                onHide={onHide}
              />
            )}
          </tbody>
        </table>
      </div>
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

      <DeleteModal
        heading={"Are you sure you want to delete this Song?"}
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteBanner} // <--- CALL DELETE FUNCTION
      />

      {/* <AddSongsModal modalAdd={addSongModal} closeAndClear={closeAndClear} /> */}
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

      <AddSongsModal
        modalAdd={addSongModal}
        closeAndClear={closeAndClear}
        editFaq={editSong}
        onSuccess={listData}
      />
    </>
  );
};
//
export default SongTable;
