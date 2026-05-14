import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { FiUpload } from "react-icons/fi";
import { musicimg } from "assets/images";
import "./AudioUpload.scss";

const RhfAudioUpload = ({
  control,
  error,
  name = "audio",
  existingAudioName = "", // for edit mode
}) => {
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (existingAudioName) {
      setFileName(existingAudioName);
    }
  }, [existingAudioName]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="wrap_audio_cstm">
          <label htmlFor={name}>
            <div className="wrap_left_side">
              <input
                id={name}
                type="file"
                accept="audio/mpeg,audio/wav,audio/flac,.mp3,.wav,.flac"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (!(file instanceof File)) {
                    field.onChange(undefined);
                    setFileName("");
                    return;
                  }

                  field.onChange(file);
                  setFileName(file.name);
                }}
              />

              <img src={musicimg} alt="audio placeholder" />

              <div className="wrap_upload">
                <p className="upload_btn_cstm">
                  {fileName || "Upload Audio File"}
                </p>
                <span>WAV, MP3, FLAC • Max 50MB</span>
              </div>
            </div>

            <FiUpload className="upload" />
          </label>

          {error && <p className="validation_err">{error.message}</p>}
        </div>
      )}
    />
  );
};

export default RhfAudioUpload;
