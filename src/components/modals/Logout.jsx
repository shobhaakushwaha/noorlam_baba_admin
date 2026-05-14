import React from "react";
import CustomModal from "./CustomModal";

const LogoutModal = ({ show = false, onClose, heading, onConfirm }) => {
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
          <button
            type="button"
            className="button light"
            onClick={onConfirm} // <-- IMPORTANT
          >
            Yes
          </button>
          <button type="button" className="button" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

// export default Logout;

export default LogoutModal;
