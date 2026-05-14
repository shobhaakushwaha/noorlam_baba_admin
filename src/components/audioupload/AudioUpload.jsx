import React from "react";
import "./AudioUpload.scss";
import { musicimg  } from "assets/images";
import { FiUpload } from "react-icons/fi";

const AudioUpload = () => {
  return (
    <div className="wrap_audio_cstm">
      <label htmlFor="audio">
        <div className="wrap_left_side">
          <input
            type="file"
            accept="audio/*"
            id='audio'
            onChange={(e) => {
              const file = e.target.files[0];
              if (file && !file.type.startsWith("audio/")) {
                alert("Only audio files allowed");
                e.target.value = "";
              }
            }}
          />
          <img src={musicimg} alt="" />
          <div className="wrap_upload">
            <p className="upload_btn_cstm">Upload Audio File</p>
            <span>WAV, MP3, or FLAC up to 50MB</span>
          </div>
        </div>
        <FiUpload className="upload" />
      </label>
    </div>
  );
};

export default AudioUpload;
