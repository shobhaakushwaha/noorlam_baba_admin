import { song_banner, stories_img } from "assets/images";
import useFullPageLoader from "common/UseFullPageLoader";
import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { useParams, useSearchParams } from "react-router-dom";
import { getUserstoryApi } from "services/userManagement";
import StoryViewModal from "components/modals/StoryViewModal";
import { userPlaceholder } from "assets/icons";
import CustomModal from "components/modals/CustomModal";
import NotFound from "common/NotFound";
import "../../../components/modals/StoryViewModal.scss"

const StoriesData = () => {
  const Array = [1, 2, 3, 4, 5, 6, 7, 8];
  const [searchParams, setSearchParams] = useSearchParams();
  const [loader, onShow, onHide] = useFullPageLoader();
  const [openModal, setOpenModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [storyList, setStorySongs] = useState([]);
  const { userId } = useParams();
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

  const handleView = (item) => {
    setSelectedStory(item);
    setOpenModal(true);
  };

  const getUserStoryFun = async () => {
    onShow();
    let payload = {
      userId: userId,
      page: activePage,
      limit: limits,
    };
    try {
      const {
        data: { status, data },
      } = await getUserstoryApi(payload);
      if (status === 200) {
        setStorySongs(data.stories || []);
        setTotal(data.totalUploadedSongs);
      }
    } catch (error) {
      console.log("error", error);
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
    if (userId) {
      getUserStoryFun();
    }
  }, [userId, limits, activePage]);

  return (
    <>
      <div className="wrap_stories_data">
        <div className="wrap_cards">
          {storyList?.length > 0 ? (
            storyList.map((item, index) => (
              <div className="wrap_inner_card" key={item?._id || index}>
                <figure>
                  <img
                    src={item?.coverImage || userPlaceholder}
                    alt=""
                    onClick={() =>
                      showImagePreviewHandler(item?.coverImage || userPlaceholder)
                    }
                  />
                </figure>

                <p>{item?.song?.songTitle}</p>

                <span>{item?.text}</span>

                <button
                  className="button light_btn"
                  onClick={() => handleView(item)}
                >
                  <FaEye />
                  View
                </button>
              </div>
            ))
          ) : (
            <NotFound msg="Story list not available" onHide={true} />
            
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      <StoryViewModal
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
            alt="story-cover-preview"
          />
        </div>
      </StoryViewModal>

      {/* Story Details Modal */}
      <StoryViewModal
        className={"lg story_details_modal"}
        show={openModal}
        handleClose={() => {
          setSelectedStory(null);
          setOpenModal(false);
        }}
      >
        {selectedStory && (
          <div className="story_details_content">
            <div className="story_image_section">
              <img
                src={selectedStory?.coverImage || userPlaceholder}
                alt="story-cover"
                className="story_cover_image"
              />
            </div>

            <div className="story_info_section">
              {selectedStory?.song?.songTitle && (
                <div className="info_item">
                  <h4>Song Title</h4>
                  <p>{selectedStory.song.songTitle}</p>
                </div>
              )}

              {selectedStory?.text && (
                <div className="info_item">
                  <h4>Story Text</h4>
                  <p>{selectedStory.text}</p>
                </div>
              )}

              <div className="stats_row">
                {selectedStory?.totalLikes !== undefined && (
                  <div className="stat_item">
                    <span className="stat_icon">👍</span>
                    <div>
                      <h5>Likes</h5>
                      <p>{selectedStory.totalLikes || 0}</p>
                    </div>
                  </div>
                )}

                {selectedStory?.totalViews !== undefined && (
                  <div className="stat_item">
                    <span className="stat_icon">👁</span>
                    <div>
                      <h5>Views</h5>
                      <p>{selectedStory.totalViews || 0}</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedStory?.createdAt && (
                <div className="info_item">
                  <h4>Posted On</h4>
                  <p>{new Date(selectedStory.createdAt).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </StoryViewModal>

      {loader}
    </>
  );
};

export default StoriesData;