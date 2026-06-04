import { zodResolver } from "@hookform/resolvers/zod";
import { bootstrapLoaderHelperFun } from "common/bootstrapLoader";
import { schemaValidate } from "common/validationRules/validationRules";
import { Input, Select } from "components/form";
import RhfImageUpload from "components/imageupload/rhfImageUpload";
import CustomModal from "components/modals/CustomModal";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  addCategoryApi,
  getCategoryListApi,
} from "services/CategoryManagement";
import {
  addSubcategoryApi,
  
} from "services/subcategoryManagment";
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
  const isSubcategory = catTabName === "sub category";
  const validationSchema = isSubcategory
    ? isEdit
      ? "editSubcategorySchema"
      : "addSubcategorySchema"
    : isEdit
    ? "editCategorySchema"
    : "addCategorySchema";

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
    resolver: zodResolver(schemaValidate(validationSchema)),
    mode: "onChange",
  });

  const [imgForPreview, setImgForPreview] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);

  // -------------------------------------submit
  const doSubmit = async (dataInp) => {
    const formData = new FormData();
    formData.append("name", dataInp?.playListName);
    formData.append("type", catTabName);

    if (isSubcategory) {
      formData.append("categoryId", dataInp?.categoryId);
    } else if (isEdit && catDetails?._id) {
      formData.append("categoryId", catDetails?._id);
    }

    if (isSubcategory && isEdit && catDetails?._id) {
      formData.append("subcategoryId", catDetails?._id);
    }

    if (dataInp.image instanceof File) {
      formData.append("image", dataInp?.image);
    }
    try {
      const apiHandler = isSubcategory
        ? isEdit
          ? addSubcategoryApi
          : addSubcategoryApi
        : addCategoryApi;
      const {
        data: { status, message },
      } = await apiHandler(formData);

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
      setValue("playListName", catDetails?.name || "", {
        shouldValidate: true,
      });
      setValue(
        "categoryId",
        catDetails?.categoryId?._id || catDetails?.categoryId || "",
        { shouldValidate: true }
      );
      setImgForPreview(catDetails?.image);
    }
  }, [isEdit, catDetails, setValue]);

  useEffect(() => {
    const getCategoryOptions = async () => {
      if (!isSubcategory) return;

      try {
        const { data: responseData } = await getCategoryListApi({
          page: 1,
          limit: 1000,
        });

        if (responseData?.status === 200) {
          const listData =
            responseData?.data?.categoryList ||
            responseData?.data?.data ||
            responseData?.data?.categories ||
            [];

          setCategoryOptions(listData);
        }
      } catch (error) {
        console.log("category list error:-->", error);
      }
    };

    getCategoryOptions();
  }, [isSubcategory]);

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
        {isSubcategory && (
          <div className="form_field">
            <Select
              label="Category"
              required
              {...register("categoryId")}
              error={errors?.categoryId?.message}
            >
              <option value="">Select Category</option>
              {categoryOptions.map((category) => (
                <option key={category?._id} value={category?._id}>
                  {category?.name}
                </option>
              ))}
            </Select>

            {errors?.categoryId && (
              <div className="validation_err">
                <p>{errors?.categoryId?.message}</p>
              </div>
            )}
          </div>
        )}
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
