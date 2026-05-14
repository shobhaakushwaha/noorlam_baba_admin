import { userPlaceholder } from "assets/icons";
import { song_banner } from "assets/images";
import NotFound from "common/NotFound";
import useFullPageLoader from "common/UseFullPageLoader";
import DeleteModal from "components/modals/DeleteModal";
import useDebounce from "hooks/UseDebounce";
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { PiLineVerticalLight } from "react-icons/pi";
import { TbEdit } from "react-icons/tb";
import { useSearchParams } from "react-router-dom";
import {
  ContentListApi,
  ContentStoryListApi,
  deleteContanentStoryApi,
} from "services/contentsmgmt";
import { formatCount } from "utils/numberFormat";
import { dateFormat } from "utils/dateFormat";
import { findSerialNumber } from "utils/formValidator";
import { toastMessage } from "utils/toastMessage";
import CustomModal from "components/modals/CustomModal";

const StoriesTable = ({ search, refreshKey }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loader, onShow, onHide] = useFullPageLoader();
  const [storyList, setStoryList] = useState([]);
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

  // Image preview modal states
  const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // Text/Read More modal states
  const [showTextModal, setShowTextModal] = useState(false);
  const [fullText, setFullText] = useState("");

  const closeAndClear = () => {
    setAddSongModal(false);
  };

  const debouncedValue = useDebounce(search, 300);

  const activePage = +searchParams.get("page") || 1;
  const limits = +searchParams.get("limit") || 10;

  const showImagePreviewHandler = (profile) => {
    setShowImagePreviewModel(true);
    setImagePreview(profile);
  };

  // Truncate text and show "Read More" link
  const truncateText = (text, maxLength = 50) => {
    if (!text) return "N/A";
    if (text.length <= maxLength) return text;
    return (
      <>
        {text.substring(0, maxLength)}...{" "}
        <span
          className="read_more_link"
          style={{ color: "#007bff", cursor: "pointer", fontWeight: "600" }}
          onClick={() => {
            setFullText(text);
            setShowTextModal(true);
          }}
        >
          Read More
        </span>
      </>
    );
  };

  const listData = async () => {
    let data = {
      page: activePage,
      limit: limits,
      search: debouncedValue,
    };

    try {
      const { data: response, status } = await ContentStoryListApi(data);
      if (status === 200) {
        setStoryList(response?.data?.stories);
        setTotal(response.data.total);
        setCount(response?.counts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteStory = async () => {
    if (!detailsData?._id) return;

    onShow();
    try {
      const { data } = await deleteContanentStoryApi(detailsData._id);

      if (data?.status === 200) {
        toastMessage(data.message, "success");
        setIsModalOpen(false);
        setDetailsData({});
        listData(); // re-fetch the updated list
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
              <th className="nowrap text-center">Cover Image</th>
              <th className="nowrap text-center">Text</th>
              <th className="nowrap text-center">Added By</th>
              <th className="nowrap text-center">Likes</th>
              <th className="nowrap text-center">Added On</th>
              <th className="nowrap text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {storyList && storyList.length > 0 ? (
              storyList.map((data, index) => {
                return (
                  <tr key={index}>
                    <td className="text-center">
                      {findSerialNumber(index, activePage, limits)}
                    </td>
                    <td className="text-center">
                      <img
                        className="cstm_img_table"
                        src={data?.coverImage || userPlaceholder}
                        alt=""
                        onClick={() =>
                          showImagePreviewHandler(
                            data?.coverImage || userPlaceholder
                          )
                        }
                      />
                    </td>
                    <td className="text-center">{truncateText(data?.text)}</td>
                    <td className="text-center">
                      {data?.user?.artistName ? data?.user?.artistName : "N/A"}
                    </td>
                    <td className="text-center">
                      {formatCount(data?.totalLikes)}
                    </td>
                    <td className="text-center">
                      {dateFormat(data?.createdAt)}
                    </td>
                    <td className="text-center">
                      <div className="common_view actions_wrap">
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
                msg={"Story Data not found"}
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

      {/* Image Preview Modal */}
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

      {/* Text / Read More Modal */}
      <CustomModal
        className={"md text_preview_modal"}
        show={showTextModal}
        handleClose={() => {
          setFullText("");
          setShowTextModal(false);
        }}
      >
        <div className="text_preview_content">
          <h4>Story Description</h4>
          <p>{fullText}</p>
        </div>
      </CustomModal>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        heading={"Are you sure you want to delete this Story?"}
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteStory}
      />
    </>
  );
};

export default StoriesTable;