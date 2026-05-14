import React, { useEffect, useState } from "react";
import { PiLineVerticalLight } from "react-icons/pi";
import { Link, useParams } from "react-router-dom";
import UpdatedTable from "./UpdatedTable";
import PopularTable from "./PopularTable";
import StoriesData from "./StoriesData";
import { getUserdetailsApi, getUserPopularApi } from "services/userManagement";
import useFullPageLoader from "common/UseFullPageLoader";
import { logger } from "utils/logger";
import { formatNumber, helperFunForNa } from "utils/helperFunForNa";
import { userPlaceholder } from "assets/icons";
import { useSearchParams } from "react-router-dom";

import CustomModal from "components/modals/CustomModal";

const SellerDetails = () => {
  // const [dashboardTab, setDashboardTab] = useState("Genres");

  const [searchParams, setSearchParams] = useSearchParams();
  const dashboardTab = searchParams.get("tab") || "Genres";

  const [loader, onShow, onHide] = useFullPageLoader();
  const { userId } = useParams();
  const [popularSongs, setPopularSongs] = useState([]);
  const [total, setTotal] = useState();
  const [userDetailsInfo, setUserDetailsInfo] = useState({});

  const getUserPopularFun = async () => {
    onShow();
    try {
      const {
        data: { status, data },
      } = await getUserPopularApi({ userId });
      if (status === 200) {
        setPopularSongs(data.songData || []);
        setTotal(data.totalUploadedSongs);

        // setTotal
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      onHide();
    }
  };

  const getUserDetailsFun = async () => {
    onShow();
    let payload = {
      userId: userId,
      role: "artist",
    };
    try {
      const {
        data: { status, data },
      } = await getUserdetailsApi(payload);

      if (status === 200) {
        // setUserDetailsInfo(data?.user || {});
        setUserDetailsInfo(data || {});
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      onHide();
    }
  };

  useEffect(() => {
    if (userId) {
      getUserDetailsFun();
      // getUserDetailsFun1()
      // getUserPopularFun()
    }
  }, [userId]);

  useEffect(() => {
    if (dashboardTab === "Saved" && userId) {
      getUserPopularFun();
    }
  }, [dashboardTab, userId]);

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
            {/* <Link to={-1}>Artist Management</Link> */}
                        <Link to="/seller-management">seller-management</Link>
            
          </li>
          <li>
            <PiLineVerticalLight />
          </li>
          <li>Seller Details</li>
        </ul>
      </div>
      <div className="card cstm_card">
        <h5>Personal Details</h5>
        <div className="wrap_img">
          <figure>
            <img
              src={userDetailsInfo?.data?.artistProfile || userPlaceholder}
              alt=""
              onClick={() =>
                showImagePreviewHandler(
                  userDetailsInfo?.data?.artistProfile || userPlaceholder,
                )
              }
            />
          </figure>
          <ul>
            <li>
              <strong>User ID</strong>
              <span>{userDetailsInfo?.data?.userNumber || "N/A"}</span>
            </li>
            <li>
              <strong>Name</strong>
              <span>{helperFunForNa(userDetailsInfo?.data?.artistName)}</span>
            </li>
            <li>
              <strong>Total Songs Uploaded</strong>
              <span>{formatNumber(userDetailsInfo?.artist?.totalSongs)}</span>
            </li>
            <li>
              <strong>Phone Number</strong>
              <span>
                {helperFunForNa(userDetailsInfo?.data?.countryCode)}{" "}
                {userDetailsInfo?.data?.mobile
                  ? helperFunForNa(userDetailsInfo?.data?.mobile)
                  : "N/A"}
              </span>
            </li>
            <li>
              <strong>Total Followers</strong>
              <span>{formatNumber(userDetailsInfo?.artist?.totalFollowers)}</span>
            </li>
            <li>
              <strong>Total Likes</strong>
              <span>{formatNumber(userDetailsInfo?.artist?.totalLikes)}</span>
            </li>
            <li>
              <strong>Total Stories</strong>
              <span>{formatNumber(userDetailsInfo?.artist?.totalStories)}</span>
            </li>
            <li>
              <strong>Total Streams</strong>
              <span>{formatNumber(userDetailsInfo?.artist?.totalStreams)}</span>
            </li>
          </ul>
        </div>
        <div className="wrapper_cstm_tabers">
          <ul>
            <li
              className={dashboardTab === "Genres" ? "active" : ""}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set("tab", "Genres");
                params.delete("page"); // optional reset page
                setSearchParams(params);
              }}
            >
              Uploaded Songs
            </li>
            <li
              className={dashboardTab === "Saved" ? "active" : ""}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set("tab", "Saved");
                params.delete("page"); // optional reset page
                setSearchParams(params);
              }}
            >
              Popular
            </li>
            <li
              className={dashboardTab === "Created" ? "active" : ""}
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set("tab", "Created");
                params.delete("page"); 
                setSearchParams(params);
              }}
            >
              Stories
            </li>
          </ul>
        </div>
        <>
          {dashboardTab === "Genres" && <UpdatedTable />}
          {dashboardTab === "Saved" && <PopularTable />}

          {/* {dashboardTab === "Saved" && (
            <PopularTable popularSongs={popularSongs}
              user={userId} />
          )} */}

          {dashboardTab === "Created" && <StoriesData />}
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

export default SellerDetails;
