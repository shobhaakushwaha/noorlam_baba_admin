import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { FiUpload } from "react-icons/fi";
import { musicimg } from "assets/images";
import "./AudioUpload.scss";
import { getMp3Duration } from "./getMp3Duration";

const RhfAudioWithSizeUpload = ({
  control,
  error,
  name = "audio",
  existingAudioName = "",
  existingAudioUrl = "",   // 🔥 NEW
  setAudioDuration = () => {},
}) => {
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState(""); // 🔥 NEW

  // ✅ Edit mode preview
  useEffect(() => {
    if (existingAudioName) setFileName(existingAudioName);
  }, [existingAudioName]);

  useEffect(() => {
    if (existingAudioUrl) setPreviewUrl(existingAudioUrl);
  }, [existingAudioUrl]);

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
                onChange={async (e) => {
                  const file = e.target.files?.[0];

                  if (!(file instanceof File)) {
                    field.onChange(undefined);
                    setFileName("");
                    setPreviewUrl("");
                    return;
                  }

                  try {
                    const duration = await getMp3Duration(file);
                      console.log(duration,"durationdurationdurationdurationdurationdurationdurationdurationdurationdurationdurationdurationdurationdurationdurationdurationduration")

                    setAudioDuration(Math.round(duration));

                    field.onChange(file);

                    setFileName(
                      `${file.name} • ${Math.floor(duration / 60)}:${String(
                        Math.floor(duration % 60),
                      ).padStart(2, "0")}`,
                    );

                    // 🔥 preview new file
                    setPreviewUrl(URL.createObjectURL(file));

                  } catch (err) {
                    field.onChange(undefined);
                    setFileName("");
                    setPreviewUrl("");
                    alert(err.message || "Invalid audio file");
                  }
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

          {/* 🔥 AUDIO PREVIEW */}
          {previewUrl && (
            <audio controls src={previewUrl} className="audio_preview" />
          )}

          {error && <p className="validation_err">{error.message}</p>}
        </div>
      )}
    />
  );
};

export default RhfAudioWithSizeUpload;
