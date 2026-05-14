import { upload_img } from "assets/images";
import React, { useState } from "react";
import "./ImageUpload.scss";

const ImageUploads = ({ image, onChange,showError }) => {
  return (
    <div className="wrap_upload_cstm">
      <label
        htmlFor="image"
        className={`${image ? "image_uploaded" : ""}`}
      >
        <input
          type="file"
          accept="image/*"
          id="image"
          onChange={onChange}
        />

        <img
         src={image ? (image instanceof File ? URL.createObjectURL(image) : image) : upload_img}

          alt="cover"
        />

        <span className="upload_btn_cstm">Profile Image</span>
      </label>
    {showError && !image && (
        <p style={{ color: "red" }}>Profile  image is required</p>
      )}
  </div>
  );
};

export default ImageUploads;
