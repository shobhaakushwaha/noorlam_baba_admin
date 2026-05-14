import React from "react";
import { Modal } from "react-bootstrap";
import "./Modal.scss";
import { IoClose } from "react-icons/io5";

const CustomModal = ({
  show,
  handleClose,
  className,
  closeButton = true,
  children,
  ...rest
}) => {
  return (
    <>
      <Modal
        backdrop="static"
        show={show}
        onHide={handleClose}
        centered
        className={`custom_modal ${className}`}
        {...rest}
      >
        <Modal.Body>
          {closeButton && (
            <span className="close_button" onClick={handleClose}>
              <IoClose />
            </span>
          )}
          <div className="modal_content">{children}</div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomModal;
