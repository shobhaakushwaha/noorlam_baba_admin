import { zodResolver } from "@hookform/resolvers/zod";
import { bootstrapLoaderHelperFun } from "common/bootstrapLoader";
import { secondsToMMSS } from "common/RhfHelper/rhfAudioUpload/audioUtils";
import RhfAudioUpload from "common/RhfHelper/rhfAudioUpload/RhfAudioUpload";
import RhfAudioWithSizeUpload from "common/RhfHelper/rhfAudioUpload/RhfAudioWithSizeUpload";
import SelectOptionsArtist from "common/RhfHelper/selectArtist";
import SelectMultiSelect from "common/RhfHelper/SelectMultiSelect";
import SelectOptions from "common/RhfHelper/SelectOptions";
import { contentManagementValidate } from "common/validationRules/contentMgmtValidationRule";
import AudioUpload from "components/audioupload/AudioUpload";
import { Button, Input, Select } from "components/form";
import ImageUpload from "components/imageupload/ImageUpload";
import RhfImageUpload from "components/imageupload/rhfImageUpload";
import CustomModal from "components/modals/CustomModal";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllCategoryOptionListApi } from "services/CategoryManagement";
import {
  addSongApi,
  contentArrayListApi,
  getArtistNameListApi,
} from "services/contentsmgmt";
import { logger } from "utils/logger";
import { toastMessage } from "utils/toastMessage";

const AddSongsModal = ({
  modalAdd,
  closeAndClear,
  editFaq,
  dashboardTab,
  onSuccess,
}) => {
  const [exclusiveTab, setExclusiveTab] = useState("Yes");
  const [explicitTab, setExplicitTab] = useState("Yes");
  const [isEdit, setIsEdit] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // ---------------audio duration
  const [audioDuration, setAudioDuration] = useState(null);

  const tab = searchParams.get("tab");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const {
    register,
    control,
    handleSubmit,
    resetField,
    reset,
    formState: { errors, isValid, isDirty, touchedFields, isSubmitting },
  } = useForm({
    resolver: zodResolver(contentManagementValidate("addSongs")),
    mode: "onChange",
    defaultValues: {
      audio: null,
      profile: null,
      title: "",
      artistName: null,
      genre: null,
      mood: [],
    },
  });

  // ---------data
  const [categoriesList, setCategoriesList] = useState({
    genereList: [],
    moodList: [],
    artist: [],
  });

  logger.log("categoriesList", categoriesList);

  // -----------fetching data at a time
  const getApiListing = async () => {
    try {
      const [genereList, moodList, artistList] = await Promise.all([
        getAllCategoryOptionListApi({ type: "genres" }),
        getAllCategoryOptionListApi({ type: "moods" }),
        getArtistList(),
      ]);

      if (genereList?.status === 200 && moodList?.status === 200) {
        setCategoriesList((prevData) => ({
          ...prevData,
          genereList: genereList?.data?.data?.categories?.map((data) => ({
            label: data?.name,
            value: data?._id,
          })),
          moodList: moodList?.data?.data?.categories?.map((data) => ({
            label: data?.name,
            value: data?._id,
          })),
          artist: artistList?.map((data) => ({
            label: data?.label,
            value: data?.value,
          })),
        }));
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const getArtistList = async () => {
    try {
      const { data, status } = await getArtistNameListApi();

      if (status === 200) {
        return (
          data?.data?.artists?.map((artist) => ({
            label: artist.artistName,
            value: artist._id,
          })) || []
        );
      }

      return [];
    } catch (error) {
      console.log("error:-->", error);
      return [];
    }
  };

  useEffect(() => {
    getApiListing();
  }, [modalAdd]);

  // --------reset form
  const doRestForm = () => {
    reset({
      audio: null,
      profile: null,
      title: "",
      artistName: null,
      genre: null,
      mood: [],
    });
  };

  useEffect(() => {
    doRestForm();
  }, [modalAdd]);

  useEffect(() => {
    if (editFaq?.duration) {
      setAudioDuration(editFaq.duration);
    }
  }, [editFaq]);

  // -------------------------------------submit
  const doSubmit = async (dataInp) => {
    console.log("dataInp:--->", {
      ...dataInp,
      audioDuration: audioDuration,
    });

    const formData = new FormData();
    formData.append("songTitle", dataInp?.title);
    formData.append("artistName", dataInp?.artistName?.label);
    formData.append("genres", dataInp?.genre?.value);
    formData.append(
      "moods",
      JSON.stringify(dataInp?.mood?.map((data) => data?.value))
    );
    formData.append("songExclusively", exclusiveTab === "Yes" ? 0 : 1);
    formData.append("explicitContent", explicitTab === "Yes" ? 0 : 1);
    formData.append("songAudioFile", dataInp?.audio);
    formData.append("coverImage", dataInp?.profile);
   formData.append("duration", audioDuration || dataInp.audioDuration);

    
    // formData.append("id", editFaq?._id);
if (editFaq && editFaq._id) {
  formData.append("id", editFaq._id);
}

  console.log(audioDuration,"setAudioDurationsetAudioDuration***********")
    try {
      const response = await addSongApi(formData);

      logger.log("data response:-->", response);

      if (response?.status === 200) {
        toastMessage(response?.data?.message, "success");
        closeAndClear();
        onSuccess();
      }
    } catch (error) {
      console.log("error:--->", error);
    }
  };

  // -----------------------------to disable and enable button
  const isSubmitEnabled = isDirty && isValid;
  console.log(isValid, "isValid");

  useEffect(() => {
    if (!modalAdd) return;

    if (editFaq) {
      setIsEdit(true);
      reset({
        title: editFaq?.songTitle || "",
        profile: editFaq?.coverImage || null,
        audio: editFaq?.songAudioFile || null,
        audioDuration: editFaq?.duration || undefined,

        artistName:
          categoriesList.artist.find(
            (a) => a.label === editFaq?.addedBy?.[0]
          ) || null,

        genre:
          categoriesList.genereList.find(
            (g) => g.label === editFaq?.genre?.[0]
          ) || null,

        mood:
          editFaq?.moodList
            ?.map((m) =>
              categoriesList.moodList.find((ml) => ml.label === m)
            )
            .filter(Boolean) || [],
      });
    } else {
      setIsEdit(false);
      doRestForm();
    }
  }, [editFaq, modalAdd, categoriesList]);

  return (
    <CustomModal
      className={"Add_Songs_modal md"}
      show={modalAdd}
      handleClose={closeAndClear}
    >
      <h3>Add Songs </h3>
      <div className="wrap_sent_notify">
        <form onSubmit={handleSubmit(doSubmit)}>
          <div className="wrap_flex">
            <RhfImageUpload
              control={control}
              error={errors?.profile}
              name="profile"
              isImgValue={editFaq?.coverImage}
            />

            <div className="wrap_cstm_field">
              <div className="form_field">
                <Input
                  label="Title"
                  {...register("title")}
                  placeholder="Enter Here..."
                ></Input>

                {errors?.title && (
                  <div className="validation_err">
                    <p>{errors?.title?.message}</p>
                  </div>
                )}
              </div>
              <div className="form_field">
                <SelectMultiSelect
                  control={control}
                  error={errors}
                  name="mood"
                  options={categoriesList?.moodList}
                />

                {errors?.mood && (
                  <div className="validation_err">
                    <p>{errors?.mood?.message}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="form_field_wrap mt-3">
            <div className="form_field">
              <SelectOptions
                control={control}
                error={errors}
                name="genre"
                options={categoriesList?.genereList}
              />
               {/* ✅ Add genre error */}
    {errors?.genre && (
      <div className="validation_err">
        <p>{errors?.genre?.message || errors?.genre?.root?.message}</p>
      </div>
    )}
            </div>
            <div className="form_field">
              <SelectOptionsArtist
                control={control}
                error={errors}
                name="artistName"
                options={categoriesList?.artist}
              />
                {/* ✅ Add artistName error */}
    {errors?.artistName && (
      <div className="validation_err">
        <p>{errors?.artistName?.message || errors?.artistName?.root?.message}</p>
      </div>
    )}
            </div>
          </div>
          <div className="form_field_wrap">
            <div className="form_field">
              <label className="label" htmlFor="">
                Exclusive
              </label>
              <ul className="toggle-wrapper">
                <li
                  className={exclusiveTab === "Yes" ? "active" : ""}
                  onClick={() => setExclusiveTab("Yes")}
                >
                  Yes
                </li>
                <li
                  className={exclusiveTab === "No" ? "active" : ""}
                  onClick={() => setExclusiveTab("No")}
                >
                  No
                </li>
              </ul>
            </div>
            <div className="form_field">
              <label className="label" htmlFor="">
                Explicit
              </label>
              <ul className="toggle-wrapper">
                <li
                  className={explicitTab === "Yes" ? "active" : ""}
                  onClick={() => setExplicitTab("Yes")}
                >
                  Yes
                </li>
                <li
                  className={explicitTab === "No" ? "active" : ""}
                  onClick={() => setExplicitTab("No")}
                >
                  No
                </li>
              </ul>
            </div>
          </div>

          <RhfAudioWithSizeUpload
            control={control}
            error={errors.audio}
            setAudioDuration={setAudioDuration}
            existingAudioName="Existing Audio"
            existingAudioUrl={editFaq?.songAudioFile}
          />

          <div className="button_wrap">
            <Button type="submit">
              {isSubmitting && bootstrapLoaderHelperFun()}
              {isEdit ? "Update" : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </CustomModal>
  );
};

export default AddSongsModal;