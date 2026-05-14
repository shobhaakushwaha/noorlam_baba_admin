import { song_banner } from "assets/images";
import React, { useEffect, useState } from "react";
import { CiPlay1 } from "react-icons/ci";
import { FaRegEye } from "react-icons/fa";
import { PiLineVerticalLight } from "react-icons/pi";
import "./SavedPlaylist.scss";
import { SwitchButton } from "components/form";
import { TbEdit } from "react-icons/tb";
import { getUsersSaveListApi, viewPlayListApi } from "services/userManagement";
import NotFound from "common/NotFound";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import { formatDate } from "utils/dateFormat";
import AudioModal from "components/modals/audioModal";
import { Link, useParams, useSearchParams,useNavigate } from "react-router-dom";



const SavedPlaylist = () => {
  //  const { id } = useParams();
     const { id, userId } = useParams();
  const navigate = useNavigate();
   
  const [searchParams, setSearchParams] = useSearchParams();
  
   const [saveList,setSaveList] = useState([])
  const [total, setTotal] = useState();
  const [playList, setPlayList] = useState([]);
    const [playListother, setPlayListOther] = useState([]);

  const activePage = +searchParams.get("page") || 1;
  const limits = +searchParams.get("limit") || 10;
    const [showAudio, setShowAudio] = useState(false);
    const [audioUrl, setAudioUrl] = useState("");
    const [audioTitle, setAudioTitle] = useState("");
    const getUserSavedList = async () => {
       // onShow();
       let payload = {
         playlistId: id,
         page: activePage,
         limit: limits,
        //  type: "saved",
       };
       try {
         const {
           data: { status, data },
         } = await viewPlayListApi(payload);
   
        //  if (status === 200) {
        //    console.log(data?.result?.songs,"KKKKKKKKKKKKKKKKKKK")
        //    setSaveList(data || {});
        //    setTotal(data.total);
        //  }

        if (status === 200) {
  setSaveList(data?.result?.songs || []);
  setTotal(data?.result?.total);
  setPlayListOther(data.result)
}
       } catch (error) {  
         console.log("error", error);
       } finally {
         // onHide();
       }
     };
   
   const handleToggleClick = () => {
  setShowToggleModal(true);
};

const handleConfirmToggle = async () => {
  try {
    // Replace with your actual API call
    // await updatePlaylistStatusApi({ playlistId: id, isActive: !isActive });
    setIsActive(!isActive);
    setShowToggleModal(false);
  } catch (error) {
    console.log("error", error);
  }
};
     
   
     const showImagePreviewHandler = (profile) => {
       setShowImagePreviewModel(true);
       setImagePreview(profile);
     };
   
     useEffect(() => {
      //  if (userId) {
         getUserSavedList();
      //  }
     }, []);
  return (
    <div className="wrapper_saved_playlist">
      <div className="breadcrumb">
        <ul>
         <li>
          <Link to={`/user-management`}>
    User Managment
  </Link>
  <Link to={`/user-management/user-detail/${userId}?tab=Saved`}>
    {/* User Details */}
  </Link>
</li>
          <li>
            <PiLineVerticalLight />
          </li>
          {/* <li>
            <Link to={"/user-detail/:id"}>User Details</Link>
          </li> */}


           <li>
    <span
      style={{ cursor: "pointer", color: "#4a7cfb" }}
      onClick={() => navigate(-1)}
    >
      User Details
    </span>
  </li>
          <li>
            <PiLineVerticalLight />
          </li>
          <li>Saved Playlist</li>
        </ul>
      </div>
      <div className="card cstm_card">
        <div className="wrapper_saved_cards">
          <div className="wrap_saved">
            <figure>
              <img src={playListother?.coverImage ? playListother?.coverImage : song_banner} alt="" />
            </figure>
            <div className="data_created">
              <h3>{playListother?.playlistName}</h3>
              <p>
                {/* Created by :<span>Zyrah</span> */}
              </p>
            </div>
          </div>
         <div className="edit_playlist_tabs">
  <SwitchButton
    checked={isActive}
    onChange={handleToggleClick}
  />
</div>
        </div>
        <h5>All Songs</h5>
        <div className="table_wrap table_responsive">
          <table className="table custom_table">
            <thead>
              <tr>
                <th className="nowrap text-center">Song ID</th>
                <th className="nowrap text-center">Cover Image</th>
                <th className="nowrap text-center">Name</th>
                <th className="nowrap text-center">Added By</th>
                <th className="nowrap text-center">Genre</th>
                <th className="nowrap text-center">Mood</th>
                <th className="nowrap text-center">Added On</th>
                <th className="nowrap text-center">Actions</th>
              </tr>
            </thead>
         


            <tbody>
  {saveList && saveList?.length > 0 ? (
    saveList.map((data, index) => (
      <tr key={index}>
        <td className="text-center">{data?.songNumber}</td>
        <td className="text-center">
          <img
            className="cstm_img_table profile_img"
            src={data?.coverImage}
            alt=""
          />
        </td>
        <td className="text-center">{data?.songTitle}</td>
        <td className="text-center">{data?.artistName}</td>
        <td className="text-center">{data?.genre}</td>
        <td className="text-center">
          {data?.mood?.length > 0 ? data?.mood.join(", ") : "NA"}
        </td>
        <td className="text-center">{formatDate(data?.createdAt)}</td>
        <td className="text-center">
          <div className="common_view">
            <CiPlay1
              style={{ cursor: "pointer" }}
              onClick={() => {
                setAudioUrl(data?.songAudioFile);
                setAudioTitle(data?.songTitle);
                setShowAudio(true);
              }}
            />
            <PiLineVerticalLight />
            <Link to={`/song-management/request-detail/${data?._id}?tab=artist`}
>
              <FaRegEye />
            </Link>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <NotFound msg="No Saved data found" onHide={true} />
  )}
</tbody>
          </table>
          <AudioModal
        open={showAudio}
        audioUrl={audioUrl}
        title={audioTitle}
        onClose={() => setShowAudio(false)}
      />

      
        </div>
      </div>
    </div>
    
    
  );
};
  

export default SavedPlaylist;
