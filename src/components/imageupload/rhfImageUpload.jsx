import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { upload_img } from "assets/images";
import "./ImageUpload.scss";

const RhfImageUpload = ({ control, error, isImgValue = "", name = "" }) => {
  const [preview, setPreview] = React.useState(null);

  React.useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  //   ------------------------------------------for edit preview selected image
  useEffect(() => {
    if (isImgValue?.length > 0) {
      setPreview(isImgValue);
    }
  }, [isImgValue]);

  return (
    <Controller
      name={name || "image"}
      control={control}
      render={({ field }) => (
        <div className="wrap_upload_cstm">
          <label className={preview ? "image_uploaded" : ""}>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!(file instanceof File)) {
                  field.onChange(undefined);
                  // setPreview(null);
                  return;
                }

                field.onChange(file);
                setPreview(URL.createObjectURL(file));
              }}
            />
            <img src={preview || upload_img} alt="" />
            <span className="upload_btn_cstm">Cover Image</span>
          </label>

          {error && <p className="validation_err">{error?.message}</p>}
        </div>
      )}
    />
  );
};

export default RhfImageUpload;
