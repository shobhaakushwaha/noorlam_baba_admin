import { upload_img } from "assets/images";
import React, { useState } from "react";
import "./ImageUpload.scss";

const ImageUpload = ({ image, onChange,showError }) => {
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
          src={image ? URL.createObjectURL(image) : upload_img}
          alt="cover"
        />

        <span className="upload_btn_cstm">Cover Image</span>
      </label>
    {showError && !image && (
        <p style={{ color: "red" }}>Cover image is required</p>
      )}
  </div>
  );
};

export default ImageUpload;
