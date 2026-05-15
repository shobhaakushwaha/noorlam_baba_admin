import { zodResolver } from "@hookform/resolvers/zod";
import { bootstrapLoaderHelperFun } from "common/bootstrapLoader";
import { schemaValidate } from "common/validationRules/validationRules";
import { Input } from "components/form";
import RhfImageUpload from "components/imageupload/rhfImageUpload";
import CustomModal from "components/modals/CustomModal";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { addCategoryApi} from "services/CategoryManagement";
import { firstWordCapital } from "utils/common";
import { toastMessage } from "utils/toastMessage";

const AddCategory = ({
  modalAdd,
  closeAndClear,
  catTabName,
  getCatListFun = () => {},
  //   ---------------------------------to perform edit
  isEdit = false,
  catDetails = {},
}) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,

    formState: {
      errors,
      isValid,
      isDirty,
      isSubmitting,
      //  isSubmitSuccessful,
      //  reset,
    },
  } = useForm({
    resolver: zodResolver(
      schemaValidate(isEdit ? "editCategorySchema" : "addCategorySchema")
    ),
    mode: "onChange",
  });

  const [imgForPreview, setImgForPreview] = useState("");

  // -------------------------------------submit
  const doSubmit = async (dataInp) => {
    const formData = new FormData();
    formData.append("name", dataInp?.playListName);
    formData.append("type", catTabName);

    if (isEdit && catDetails?._id) {
      formData.append("categoryId", catDetails?._id);
    }

    if (dataInp.image instanceof File) {
      formData.append("image", dataInp?.image);
    }
    try {
      const {
        data: { status, message },
      } = await addCategoryApi(formData);

      if (status === 201 || status === 200) {
        toastMessage(message, "success");
        getCatListFun();
        closeAndClear();
      }
    } catch (error) {
      console.log("error:-->", error);
    }
  };

  //   --------------disable buttom

  const disableButton = isValid && isDirty;

  //   ---------------clear all inputs

  //   ----------------------------------------  for edit functionality

  useEffect(() => {
    if (isEdit) {
      setValue("playListName", catDetails?.name || "");
      setImgForPreview(catDetails?.image);
    }
  }, [isEdit, catDetails, setValue]);

  return (
    <CustomModal
      className={"add_genre_modal"}
      show={modalAdd}
      handleClose={closeAndClear}
    >
      <h3>
        {" "}
        {isEdit ? "Edit" : "Add"} {firstWordCapital(catTabName)}
      </h3>

      <form onSubmit={handleSubmit(doSubmit)}>
        <RhfImageUpload
          control={control}
          error={errors?.image}
          isImgValue={imgForPreview}
        />
        <div className="form_field">
          <Input
            placeholder="Enter here..."
            label={`${firstWordCapital(catTabName)} Name`}
            {...register("playListName")}
          />

          {/* ----------------for error message */}
          {errors?.playListName && (
            <div className="validation_err">
              <p>{errors?.playListName?.message}</p>
            </div>
          )}
        </div>
        <div className="button_wrap">
          <button
            className="button"
            type="submit"
            disabled={!disableButton || isSubmitting}
          >
            {isSubmitting && bootstrapLoaderHelperFun()}
            {isEdit ? "Edit" : "Add"}
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default AddCategory;
