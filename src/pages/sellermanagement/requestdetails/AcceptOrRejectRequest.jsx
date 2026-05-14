import { Input, TextArea } from "components/form";
import CustomModal from "components/modals/CustomModal";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserStatusApi } from "services/userManagement";
import { logger } from "utils/logger";
import { toastMessage } from "utils/toastMessage";

const AcceptOrRejectRequest = ({
  showAcceptModel = false,
  userDetailsInfo = {},
  closeAndClear = () => {},
  getUserDetailsFun = () => {},
  isReject = false,
}) => {
  const navigate = useNavigate();

  const [reasonToReject, setReasonToReject] = useState("");
  const [error, setError] = useState({});

  const checkValidation = () => {
    let isValid = true;

    const isError = {};

    if (reasonToReject?.length === 0) {
      isError.reasonToReject = "Please enter rejection reason";

      isValid = false;
    }
    setError(isError);

    return isValid;
  };

  const doSubmitReq = async () => {
    if (!checkValidation) return;

    const payload = {
      userId: userDetailsInfo?.data?.id,
      artistStatus: isReject ? "rejected" : "approved",
      ...(isReject && { rejectedReason: reasonToReject }),
    };
    try {
      const response = await updateUserStatusApi(payload);

      logger.log("response>  updateUserStatusApi:---> ", response);
      if (response?.status === 200) {
        toastMessage(response?.message, "success", "changeUserStatus");
        getUserDetailsFun();
        if (isReject) {
          navigate("/seller-management?dashboardTab=rejected");
          closeAndClear();
        } else {
          navigate("/seller-management?dashboardTab=approved");

          closeAndClear();
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <CustomModal
      className={"content_management_modal md"}
      show={showAcceptModel}
      handleClose={closeAndClear}
    >
      {isReject && (
        <div className="form_field">
          <h3>Reject user request</h3>
          <TextArea
            placeholder="Please enter a valid reason"
            label="Reason to reject"
            value={reasonToReject}
            onChange={(e) => {
              setReasonToReject(e.target.value);
            }}
            // error={error}
          />
        </div>
      )}

      {!isReject && (
        <div className="form_field">
          <h3>Accept user request</h3>
          <p>Are you sure you want to accept this user request</p>
        </div>
      )}
      {/* -----------------------------------------button wrap */}
      <div className="button_wrap">
        <button type="button" className="button light" onClick={closeAndClear}>
          Cancel
        </button>
        <button
          type="button"
          className="button"
          onClick={doSubmitReq}
          disabled={reasonToReject?.length === 0 && isReject}
        >
          {isReject ? "Reject" : "Accept"}
        </button>
      </div>
    </CustomModal>
  );
};

export default AcceptOrRejectRequest;
