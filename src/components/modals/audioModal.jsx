import React, { useEffect, useRef } from "react";
import CustomModal from "components/modals/CustomModal";

const AudioModal = ({ open, audioUrl, title, onClose }) => {
  const audioRef = useRef(null);

  // autoplay when open
  useEffect(() => {
    if (open && audioRef.current) {
      audioRef.current.play();
    }
  }, [open]);

  // stop audio when close
  const handleClose = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onClose();
  };

  return (
    <CustomModal
      className={"md audio_modal"}
      show={open}
      handleClose={handleClose}
    >
      <div style={{ padding: 20 }}>
        <h3 style={{ marginBottom: 16 }}>{title || "Audio Player"}</h3>

        {audioUrl ? (
          <audio ref={audioRef} controls style={{ width: "100%" }}>
            <source src={audioUrl} />
          </audio>
        ) : (
          <p>No audio available</p>
        )}
      </div>
    </CustomModal>
  );
};

export default AudioModal;
