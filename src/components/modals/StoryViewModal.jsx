// import React from "react";
// import { FaTimes } from "react-icons/fa";

// const StoryViewModal = ({ open, onClose, story }) => {
//   if (!open || !story) return null;

//   return (
//     <div className="story_modal_overlay">
//       <div className="story_modal">
//         <button className="close_btn" onClick={onClose}>
//           <FaTimes />
//         </button>

//         <img src={story?.coverImage} alt="story" />

//         <h3>{story?.title || "Story"}</h3>

//         <p>{story?.text}</p>

//         <div className="likes_views">
//           <span>👍 {story?.totalLikes || 0}</span>
//           <span>👁 {story?.totalViews || 0}</span>
//         </div>
//       </div>
//     </div>
//   );
// };
    
// export default StoryViewModal;


import React from "react";
import { Modal } from "react-bootstrap";
import "./Modal.scss";
import { IoClose } from "react-icons/io5";

const StoryViewModal = ({
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

export default StoryViewModal;

