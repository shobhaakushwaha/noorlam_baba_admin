import { musicimg, userplaceholder } from "assets/images";
import DeleteModal from "components/modals/DeleteModal";
import CustomModal from "components/modals/CustomModal";
import { TextArea } from "components/form";
import { formatDate } from "utils/dateFormat";


import React, { useEffect, useState } from "react";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { PiLineVerticalLight } from "react-icons/pi";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

import {
  acceptRejectSongReqApi,
  songManagementRequestDetailsApi,
} from "services/songMangement";

import { firstWordCapital } from "utils/common";
import { helperFunForNa } from "utils/helperFunForNa";
import { logger } from "utils/logger";
import { toastMessage } from "utils/toastMessage";

const RequestDetails = () => {
  const { songId } = useParams();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  //  const tabs = searchParams.get("tabs");
   console.log(tab,"+++++++++++++++++++++++++++++++*******************")

  

  /* ---------------- STATES ---------------- */
  const [songDetails, setSongDetails] = useState({});
  const [showAcceptModel, setShowAcceptModel] = useState(false);
  const [showRejectModel, setShowRejectModel] = useState(false);

  /* ---------------- CLOSE BOTH MODALS ---------------- */
  const closeAndClear = () => {
    setShowAcceptModel(false);
    setShowRejectModel(false);
  };

  /* ---------------- FETCH DETAILS ---------------- */
  const fetchSongManagementDetailsFun = async () => {
    try {
      const response = await songManagementRequestDetailsApi({ songId });

      if (response?.status === 200) {
        setSongDetails(response?.data?.data?.song || {});
      }
    } catch (error) {
      logger.log(error);
    }
  };

  useEffect(() => {
    if (songId) fetchSongManagementDetailsFun();
  }, [songId]);

  /* ---------------- UI ---------------- */
  return (
    <div className="wrapper_user_details">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <ul>
          <li>
            <Link to={-1}>Song Management</Link>
          </li>
          <li>
            <PiLineVerticalLight />
          </li>
          {/* <li>{tab === "approved " ? "Song Details" : "Requests Details"}</li> */}
          <li>{tab === "approved" || tab === "artist" ? "Song Details" : "Requests Details"}</li>

        </ul>
      </div>

      {/* Card */}
      <div className="card cstm_card">
        <h5>Personal Details</h5>

        <div className="wrap_img overwrite_wrap_img">
          <figure>
            <img
              src={songDetails?.artist?.profile || userplaceholder}
              alt=""
            />
          </figure>

          <ul>
            <li>
              <strong>Artist ID :</strong>{" "}
              {helperFunForNa(songDetails?.artist?.userNumber)}
            </li>

            <li>
              <strong>Genres :</strong>{" "}
              {helperFunForNa(
                songDetails?.genres?.name || songDetails?.genres
              )}
            </li>

            <li>
              <strong>Name :</strong>{" "}
              {helperFunForNa(songDetails?.artist?.name)}
            </li>

            <li>
              <strong>Moods :</strong>{" "}
              {songDetails?.moods?.length
                ? songDetails.moods.join(", ")
                : "NA"}
            </li>

            <li>
              <strong>Cover Image :</strong>
              <img src={songDetails?.coverImage || musicimg} alt="" />
            </li>

            <li>
              <strong>Songs :</strong>
              {songDetails?.songAudioFile && (
                <audio controls src={songDetails.songAudioFile} />
              )}
            </li>

            <li>
              <strong>Song Name :</strong> {songDetails?.songTitle}
            </li>
{tab === "artist" && (
  <li>
    <strong>Total Like  :</strong> {songDetails?.totalLikes}
  </li>
)}



{tab === "artist" && (
  <li>
    <strong>Stream Count :</strong> {songDetails?.playCount}
  </li>
)}

            <li>
              <strong>Exclusive :</strong>{" "}
              {songDetails?.songExclusively == 1 ? "NO" : "YES"}
            </li>

            <li>
              <strong>Explicit :</strong>{" "}
              {songDetails?.explicitContent === 1 ? "NO" : "YES"}
            </li>

            <li>
  <strong>Collaborators :</strong>{" "}
  {songDetails?.isCollaborator && songDetails?.collaborators?.length
    ? songDetails.collaborators.map(c => c.name).join(", ")
    : "NA"}
</li>

 {tab === "artist" && (
  <li>
    <strong>Added On :</strong> {formatDate(songDetails?.createdAt)}
  </li>
)}

          </ul>
        </div>

        {/* Buttons */}
{songDetails?.status === "pending" && tab !== "artist" && (
          <div className="button_wrap">
            <button
              className="button light"
              onClick={() => setShowRejectModel(true)}
            >
              Reject
            </button>

            <button
              className="button"
              onClick={() => setShowAcceptModel(true)}
            >
              Accept
            </button>
          </div>
        )}
      </div>

      {/* Accept Modal */}
      {showAcceptModel && (
        <AcceptSong
          showAcceptModel={showAcceptModel}
          closeAndClear={closeAndClear}
          songDetails={songDetails}
        />
      )}

      {/* Reject Modal */}
      {showRejectModel && (
        <RejectSong
          showRejectModel={showRejectModel}
          closeAndClear={closeAndClear}
          songDetails={songDetails}
        />
      )}
    </div>
  );
};

export default RequestDetails;





/* =========================================================
   ACCEPT MODAL
========================================================= */
const AcceptSong = ({
  showAcceptModel,
  closeAndClear,
  songDetails,
}) => {
  const navigate = useNavigate();
  const [buttonLoader, setButtonLoader] = useState(false);

  const acceptSongFun = async () => {
    try {
      setButtonLoader(true);

      const response = await acceptRejectSongReqApi({
        songId: songDetails?._id,
        status: "approved",
      });

      if (response?.status === 200) {
        toastMessage(response?.data?.message, "success");
        closeAndClear();
        navigate(-1);
      }
    } finally {
      setButtonLoader(false);
    }
  };

  return (
    <DeleteModal
      show={showAcceptModel}
      onClose={closeAndClear}
      heading={`Are you sure you want to accept this ${firstWordCapital(
        songDetails?.songTitle
      )}`}
      onConfirm={acceptSongFun}
      buttonLoader={buttonLoader}
      image={<IoCheckmarkDoneSharp />}
    />
  );
};





/* =========================================================
   REJECT MODAL
========================================================= */
const RejectSong = ({
  showRejectModel,
  closeAndClear,
  songDetails,
}) => {
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [buttonLoader, setButtonLoader] = useState(false);

  useEffect(() => {
    if (!showRejectModel) setReason("");
  }, [showRejectModel]);

  const rejectSongFun = async () => {
    if (!reason.trim()) return;

    try {
      setButtonLoader(true);

      const response = await acceptRejectSongReqApi({
        songId: songDetails?._id,
        status: "rejected",
        rejectedReason: reason,
      });

      if (response?.status === 200) {
        toastMessage(response?.data?.message, "success");
        closeAndClear();
        navigate(-1);
      }
    } finally {
      setButtonLoader(false);
    }
  };

  return (
    <CustomModal
      show={showRejectModel}
      handleClose={closeAndClear}
      className="content_management_modal md"
    >
      <div className="form_field">
        <h3>Reject song request</h3>

        <TextArea
          label="Reason to reject"
          placeholder="Please enter rejection reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      <div className="button_wrap">
        <button className="button light" onClick={closeAndClear}>
          Cancel
        </button>

        <button
          className="button"
          onClick={rejectSongFun}
          disabled={!reason.trim() || buttonLoader}
        >
          {buttonLoader ? "Rejecting..." : "Reject"}
        </button>
      </div>
    </CustomModal>




  );
};
