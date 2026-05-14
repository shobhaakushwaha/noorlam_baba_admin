import {
  profile_img,
  song_banner,
  upload_img,
  userplaceholder,
} from "assets/images";
import useFullPageLoader from "common/UseFullPageLoader";
import React, { useEffect, useRef, useState } from "react";
import { PiLineVerticalLight } from "react-icons/pi";
import { Link, useParams } from "react-router-dom";
import { getUserdetailsApi } from "services/userManagement";
import { firstWordCapital } from "utils/common";
import { formatNumber, helperFunForNa } from "utils/helperFunForNa";
import { logger } from "utils/logger";
import AcceptOrRejectRequest from "./AcceptOrRejectRequest";
import CustomModal from "components/modals/CustomModal";

const RequestDetail = () => {
  const [showAcceptModel, setShowAcceptModel] = useState(false);
  const [showRejectModel, setShowRejectModel] = useState(false);

  const closeAndClear = () => {
    setShowAcceptModel(false);
    setShowRejectModel(false);
  };
  // ------------ref
  const audioRef = useRef(null);

  const [loader, onShow, onHide] = useFullPageLoader();

  const { userId } = useParams();

  const [userDetailsInfo, setUserDetailsInfo] = useState({});
  logger.log("userDetailsInfo", userDetailsInfo);

  const getUserDetailsFun = async () => {
    onShow();
    let payload = {
      userId: userId,
      role: "artist",
    };
    try {
      const {
        data: { status, data },
      } = await getUserdetailsApi(payload);

      if (status === 200) {
        // setUserDetailsInfo(data?.user || {});
        setUserDetailsInfo(data || {});

        
      }



    } catch (error) {
      console.log("error", error);
    } finally {
      onHide();
    }
  };

  useEffect(() => {
    if (userId) {
      getUserDetailsFun();
    }
  }, [userId]);

  const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const showImagePreviewHandler = (profile) => {
    setShowImagePreviewModel(true);
    setImagePreview(profile);
  };

  return (
    <div className="wrapper_user_details">
      {loader}
      <div className="breadcrumb">
        <ul>
          <li>
            <Link to={-1}>Seller Management</Link>
          </li>
          <li>
            <PiLineVerticalLight />
          </li>
          <li>Requests Details</li>
        </ul>
      </div>
      <div className="card cstm_card">
        <h5>Personal Details</h5>
        <div className="wrap_img overwrite_wrap_img">
          <figure>
            <img
              src={userDetailsInfo?.data?.artistProfile || userplaceholder}
              alt=""
              onClick={() =>
                showImagePreviewHandler(
                  userDetailsInfo?.data.artistProfile || userplaceholder,
                )
              }
            />
          </figure>
          <ul>
            <li>
              <strong>Artist ID : </strong>
              {userDetailsInfo?.data?.userNumber}
            </li>
            <li>
              <strong>Genres : </strong>
              {userDetailsInfo?.genres && userDetailsInfo?.genres?.length > 0
                ? userDetailsInfo.genres
                    .map((data) => firstWordCapital(data?.name))
                    .join(", ")
                : "NA"}
            </li>
            <li>
              <strong>Name : </strong>
              {helperFunForNa(userDetailsInfo?.data?.artistName)}
            </li>
            <li>
              <strong>Moods : </strong>{" "}
              {userDetailsInfo?.moods && userDetailsInfo?.moods?.length > 0
                ? userDetailsInfo.moods
                    .map((data) => firstWordCapital(data?.name))
                    .join(", ")
                : "NA"}
            </li>
            <li>
              <strong>Cover Image : </strong>
              {/* <img
                src={userDetailsInfo?.artist?.songs[0]?.coverImage  ||userDetailsInfo?.songs[0]?.coverImage|| upload_img}
                alt=""
                onClick={() =>
                  showImagePreviewHandler(
                    userDetailsInfo?.songs[0]?.coverImage || upload_img,
                  )
                }
              /> */}

              <img
  src={userDetailsInfo?.artist?.songs?.coverImage || upload_img}
  alt=""
  onClick={() =>
    showImagePreviewHandler(
      userDetailsInfo?.artist?.songs?.coverImage || upload_img
    )
  }
/>
            </li>
            <li>
              <strong>Bio : </strong>{" "}
              {helperFunForNa(userDetailsInfo?.data?.bio)}
            </li>

     
            <li>
              <strong>Song Names : </strong>

              {userDetailsInfo?.artist?.songs?.songTitle
                ? userDetailsInfo?.artist?.songs?.songTitle
                : "NA"}
            </li>
            <li>
          

              <li>
                {userDetailsInfo?.artist?.songs?.songAudioFile && (
                  <li>
                    <audio
                      controls
                      src={userDetailsInfo?.artist?.songs?.songAudioFile}
                    />
                  </li>
                )}
              </li>
            </li>
            <li>
              <strong>Exclusives : </strong>{" "}
              {userDetailsInfo?.artist?.songs?.songExclusively === 0
                ? "Yes"
                : "No"}
            </li>
            <li>
              <strong>Explicit : </strong>
              {userDetailsInfo?.artist?.songs.explicitContent === 0
          
                  ? "Yes"
                  : "No"
                }
            </li>
            <li>
              <strong>Collaborations : </strong>
              {userDetailsInfo?.collaboration
                ? userDetailsInfo?.collaboration
                  ? "Yes"
                  : "No"
                : "NA"}
            </li>
            {/* <li></li> */}
            {/* <p>Social Links</p> */}
        





  <li>
  <strong>Social Links:</strong>

  <ul className="cstm_ul">
    {Array.isArray(userDetailsInfo?.data?.socialLinks) &&
    userDetailsInfo.data.socialLinks.filter(link => link?.trim()).length > 0 ? (
      userDetailsInfo.data.socialLinks
        .filter(link => link?.trim())
        .map((link, ind) => (
          <li key={ind}>{link}</li>
        ))
    ) : (
      <li>NA</li>
    )}
  </ul>


</li>





          </ul>
        </div>

        {/* --------------cancel button */}

        {userDetailsInfo?.data?.artistStatus === "pending" && (
          <div className="button_wrap">
            <button
              type="button"
              className="button light"
              onClick={() => {
                setShowRejectModel(true);
              }}
            >
              Reject
            </button>
            <button
              type="button"
              className="button"
              onClick={() => {
                setShowAcceptModel(true);
              }}
            >
              Accept
            </button>
          </div>
        )}

        {userDetailsInfo?.data?.artistStatus === "rejected" && (
          <div className="button_wrap">
            <button type="button" className="button" disabled>
              Rejected
            </button>
          </div>
        )}
      </div>

      {showAcceptModel && (
        <AcceptOrRejectRequest
          showAcceptModel={showAcceptModel}
          userDetailsInfo={userDetailsInfo}
          closeAndClear={closeAndClear}
          getUserDetailsFun={getUserDetailsFun}
        />
      )}

      {showRejectModel && (
        <AcceptOrRejectRequest
          showAcceptModel={showRejectModel}
          userDetailsInfo={userDetailsInfo}
          closeAndClear={closeAndClear}
          getUserDetailsFun={getUserDetailsFun}
          isReject={true}
        />
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
          <img src={imagePreview || upload_img} alt="user-profile-preview" />
        </div>
      </CustomModal>
    </div>
  );
};

export default RequestDetail;
