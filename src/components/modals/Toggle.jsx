import React from "react";
import CustomModal from "./CustomModal";

const Toggle = ({
  show = false,
  onClose,
  heading,
  onConfirm,
  buttonLoader = false,
}) => {
  return (
    <CustomModal
      className="logoutModal"
      show={show}
      handleClose={onClose}
      closeButton={false}
    >
      <div className="content">
        <h3>{heading}</h3>
        <div className="button_wrap">
          {/* <button
            type="button"
            className="button light"
            onClick={onConfirm} // <-- IMPORTANT
          >
            Yes
          </button> */}
          <button
            type="button"
            className="button"
            onClick={onConfirm}
            disabled={buttonLoader}
          >
            {buttonLoader ? (
              <div
                className="spinner-border"
                role="status"
                style={{ width: "20px", height: "20px" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Yes"
            )}
          </button>

          <button type="button" className="button" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default Toggle;
