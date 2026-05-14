import { profile_img, song_banner } from "assets/images";
import React, { useEffect, useState } from "react";
import { PiLineVerticalLight } from "react-icons/pi";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import "../UserManagement.scss";
import GenresTable from "./GenresTable";
import SavedTable from "./SavedTable";
import CreatedTable from "./CreatedTable";
import FollowedTable from "./FollowedTable";
import { logger } from "utils/logger";
import { getUserdetailsApi } from "services/userManagement";
import useFullPageLoader from "common/UseFullPageLoader";
import { helperFunForNa } from "utils/helperFunForNa";
import { formatDate } from "utils/dateFormat";
import { userPlaceholder } from "assets/icons";
import CustomModal from "components/modals/CustomModal";

const UserDetails = () => {
  // const [dashboardTab, setDashboardTab] = useState("Genres");
  const [loader, onShow, onHide] = useFullPageLoader();
  const { userId } = useParams();
 const [userDetailsInfo, setUserDetailsInfo] = useState({});
 const [searchParams, setSearchParams] = useSearchParams();
const dashboardTab = searchParams.get("tab") || "Genres";

const getUserDetailsFun = async () => {
    onShow();
    let payload = {
      userId: userId,
      role: "",
    };
    try {
      const {
        data: { status, data },
      } = await getUserdetailsApi(payload);

      if (status === 200) {
        setUserDetailsInfo(data || {});
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      onHide();
    }
  };


  const handleTabChange = (tab) => {
  const params = new URLSearchParams(searchParams);
  params.set("tab", tab);
  params.set("page", 1); // reset pagination (optional good UX)
  setSearchParams(params);
};


  useEffect(() => {
    if (userId) {
      getUserDetailsFun();
    }
  }, [userId]);

  const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const showImagePreviewHandler = (profile) => {
    setShowImagePreviewModel(true);
    setImagePreview(profile);
  };
  return (
    <div className="wrapper_user_details">
      {loader}
      <div className="breadcrumb">
        <ul>
          <li>
            {/* <Link to={-1}>User Management</Link> */}
            <Link to="/user-management">User Management</Link>

          </li>
          <li>
            <PiLineVerticalLight />
          </li>
          <li>User Details</li>
        </ul>
      </div>
      <div className="card cstm_card">
        <h5>Personal Details</h5>
        <div className="wrap_img">
          <figure>
            <img
              src={userDetailsInfo?.data?.profile || userPlaceholder}
              alt=""
              onClick={() =>
                showImagePreviewHandler(
                  userDetailsInfo?.data?.profile || userPlaceholder,
                )
              }
            />
          </figure>
          <ul>
            <li>
              <strong>User ID :</strong>{" "}
              {userDetailsInfo?.data?.userNumber ?? "NA"}
            </li>
            <li>
              <strong>Name : </strong>
              {helperFunForNa(userDetailsInfo?.data?.name)}
            </li>
            <li>
              <strong>Registration Date : </strong>{" "}
              {formatDate(userDetailsInfo?.registeredAt)}
            </li>
            <li>
              <strong>Phone Number : </strong>
              {userDetailsInfo?.data?.mobile != null
                ? userDetailsInfo?.data?.countryCode
                : ""}
              {userDetailsInfo?.data?.mobile != null
                ? userDetailsInfo?.data?.mobile
                : "N/A"}
            </li>
          </ul>
        </div>
        <div className="wrapper_cstm_tabers">
  <ul>
    <li
      className={dashboardTab === "Genres" ? "active" : ""}
      onClick={() => handleTabChange("Genres")}
    >
      Genres
    </li>

    <li
      className={dashboardTab === "Saved" ? "active" : ""}
      onClick={() => handleTabChange("Saved")}
    >
      Saved Playlist
    </li>

    <li
      className={dashboardTab === "Created" ? "active" : ""}
      onClick={() => handleTabChange("Created")}
    >
      Created Playlist
    </li>

    <li
      className={dashboardTab === "Followed" ? "active" : ""}
      onClick={() => handleTabChange("Followed")}
    >
      Followed Artists
    </li>
  </ul>
</div>

        <>
          {dashboardTab === "Genres" && <GenresTable />}
          {dashboardTab === "Saved" && <SavedTable />}
          {dashboardTab === "Created" && <CreatedTable />}
          {dashboardTab === "Followed" && <FollowedTable />}
        </>
      </div>

      {/* Image Preview model */}
      <CustomModal
        className={"md image_preview_modal image_modal_sec"}
        show={showImagePreviewModel}
        handleClose={() => {
          setImagePreview("");
          setShowImagePreviewModel(false);
        }}
      >
        <div className="image_preview">
          <img
            src={imagePreview || userPlaceholder}
            alt="user-profile-preview"
          />
        </div>
      </CustomModal>
    </div>
  );
};

export default UserDetails;
