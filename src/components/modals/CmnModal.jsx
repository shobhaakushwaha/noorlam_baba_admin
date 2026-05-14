import React from "react";
import { Modal } from "react-bootstrap";
import "./Modal.scss";
import { FaTrash } from "react-icons/fa";

const CmnModal = ({
  show,
  handleClose,
  title,
  content,
  action,
  children,
  onShow,
  buttonLoader,
  image,
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      centered
      className="delete_modal"
      onShow={onShow}
    >
      <Modal.Body>
        <span className="icon">{image}</span>
        <h3 className="title">{title}</h3>
        <p className="content">{content}</p>
        {children}
        <div className="button_wrap">
          <button type="button" className="button light" onClick={handleClose}>
            No
          </button>
          <button
            ref={buttonLoader}
            type="button"
            className="button"
            onClick={action}
          >
            Yes
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CmnModal;
