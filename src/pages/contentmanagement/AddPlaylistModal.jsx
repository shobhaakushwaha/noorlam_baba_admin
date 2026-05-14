import { musicimg } from "assets/images";
import { Button, Input, Select } from "components/form";
import ImageUpload from "components/imageupload/ImageUpload";
import CustomModal from "components/modals/CustomModal";
import { FaEye } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SelectOptionsArtist from "common/RhfHelper/selectArtist";
import SelectMultiSelect from "common/RhfHelper/SelectMultiSelect";
import SelectOptions from "common/RhfHelper/SelectOptions";
import RhfImageUpload from "components/imageupload/rhfImageUpload";
import { bootstrapLoaderHelperFun } from "common/bootstrapLoader";
import { playlistValidate } from "common/validationRules/playlistValidation";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getAllCategoryOptionListApi } from "services/CategoryManagement";
import {
  getArtistNameListApi,
  songList,
  addSongApi,
  addPlayListApi,
} from "services/contentsmgmt";
import SelectOptionsMoods from "common/RhfHelper/selectMoods";
import SelectMultiSongSelect from "common/RhfHelper/selectMultipleSong";
import { toastMessage } from "utils/toastMessage";
import { userPlaceholder } from "assets/icons";

const AddPlaylistModal = ({
  modalAdd,
  closeAndClear,
  editFaq,
  dashboardTab,
  onSuccess,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEdit, setIsEdit] = useState(false);
  const [audioDuration, setAudioDuration] = useState(null);
  const [showSelectedSongs, setShowSelectedSongs] = useState(false);

  const tab = searchParams.get("tab");
  const navigate = useNavigate();

  // ✅ First: useForm
  const {
    register,
    control,
    handleSubmit,
    resetField,
    reset,
    formState: { errors, isValid, isDirty, touchedFields, isSubmitting },
  } = useForm({
    resolver: zodResolver(playlistValidate("addSongs")),
    mode: "onChange",
    defaultValues: {
      profile: undefined,
      title: "",
      artistName: [],
      genre: null,
      mood: null,
    },
  });

  // ✅ Then: useWatch (AFTER control is defined)
  const selectedSongs = useWatch({ control, name: "artistName" }) || [];

  const [categoriesList, setCategoriesList] = useState({
    genereList: [],
    moodList: [],
    artist: [],
  });

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
      const { data, status } = await songList();

      if (status === 200) {
        return (
          data?.data?.songs?.map((artist) => ({
            label: artist.songTitle,
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

  const doRestForm = () => {
    reset({
      profile: undefined,
      title: "",
      artistName: [],
      genre: null,
      mood: null,
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
    console.log("dataInp:--->", dataInp);

    const formData = new FormData();
    formData.append("name", dataInp?.title);

    formData.append(
      "songs",
      JSON.stringify(dataInp?.artistName?.map((a) => a.value))
    );

    formData.append("genres", dataInp?.genre?.value);
    formData.append("moods", dataInp?.mood?.value);

    if (dataInp?.profile instanceof File) {
      formData.append("coverImage", dataInp?.profile);
    }

    if (isEdit && editFaq?._id) {
      formData.append("playlistId", editFaq._id);
    }

    try {
      const response = await addPlayListApi(formData);

      console.log("data response:-->", response);

      if (response?.status === 200) {
        toastMessage(
          response?.data?.message || "Playlist created successfully",
          "success"
        );
        closeAndClear();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.log("error:--->", error);
    }
  };

  const isSubmitEnabled = isDirty && isValid;

  useEffect(() => {
    if (!modalAdd) return;

    if (editFaq) {
      setIsEdit(true);
      reset({
        title: editFaq?.name || "",
        profile: editFaq?.coverImage || undefined,

        artistName:
          editFaq?.songs
            ?.map((id) => categoriesList.artist.find((a) => a.value === id))
            .filter(Boolean) || [],

        genre:
          categoriesList.genereList.find(
            (g) => g.value === editFaq?.genres?._id
          ) || null,

        mood:
          categoriesList.moodList.find(
            (m) => m.value === editFaq?.moods?._id
          ) || null,
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
      <h3>{isEdit ? "Edit PlayList" : "Add PlayList"}</h3>
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
                />
                {errors?.title && (
                  <div className="validation_err">
                    <p className="error">{errors.title.message}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form_field_wrap mt-4">
            <div className="form_field">
              <SelectOptions
                control={control}
                error={errors?.genre}
                name="genre"
                options={categoriesList?.genereList}
              />
            </div>
            <div className="form_field">
              <SelectOptionsMoods
                control={control}
                error={errors?.mood}
                name="mood"
                options={categoriesList?.moodList}
              />
            </div>
          </div>

          <div className="cstm_wrap_style">
            <div className="wrap_img">
              <img src={musicimg} alt="" />
              <span>
                {selectedSongs.length} song
                {selectedSongs.length !== 1 ? "s" : ""} Selected
              </span>
            </div>
            <span
              role="button"
              style={{ cursor: "pointer", color: "#4461F2" }}
              onClick={() => setShowSelectedSongs(!showSelectedSongs)}
            >
              <FaEye />
              {showSelectedSongs ? " Hide" : " View"}
            </span>
          </div>

          {showSelectedSongs && selectedSongs.length > 0 && (
            <div
              className="selected_songs_list"
              style={{
                maxHeight: "150px",
                overflowY: "auto",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "10px",
                marginTop: "8px",
                marginBottom: "8px",
              }}
            >
              {selectedSongs.map((song, index) => (
                <div
                  key={song.value || index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom:
                      index < selectedSongs.length - 1
                        ? "1px solid #f0f0f0"
                        : "none",
                  }}
                >
                  <span>
                    {index + 1}. {song.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="form_field">
            <SelectMultiSongSelect
              control={control}
              error={errors?.artistName}
              name="artistName"
              options={categoriesList?.artist}
            />
          </div>

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

export default AddPlaylistModal;