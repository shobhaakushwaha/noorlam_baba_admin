import { Button, Search } from "components/form";
import React, { useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import SongTable from "./SongTable";
import PlaylistTable from "./PlaylistTable";
import StoriesTable from "./StoriesTable";
import AddSongsModal from "./AddSongsModal";
import AddPlaylistModal from "./AddPlaylistModal";
import { useSearchParams } from "react-router-dom";

const ContentManagement = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [search, setSearch] = useState("");
  const [editSong, setEditSong] = useState(null);
  const [editPlaylist, setEditPlaylist] = useState(null);

  const [addSongModal, setAddSongModal] = useState(false);
  const [playListModal, setPlayListModal] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const dashboardTab = searchParams.get("tab") || "Songs";

  const changeTab = (tab) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    setSearchParams(params);
    setSearch("")
    
  };

  const closeAndClear = () => {
    setAddSongModal(false);
    setPlayListModal(false);
    setEditSong(null);
    setEditPlaylist(null);
  };

  const openEditSong = (song) => {
    setEditSong(song);
    setAddSongModal(true);
  };

  const openEditPlaylist1 = (playlist) => {
    setEditPlaylist(playlist);
    setPlayListModal(true);
  };
  const openEditPlaylist = (playlist) => {
  setEditPlaylist(playlist);
  setPlayListModal(true);
};

  return (
    <>
      <div className="wrapper_content_management">
        <div className="dashboard_title">
          <h3>Content Management</h3>
          <div className="wrapper_cstm_tabers">
            <ul>
              <li
                className={dashboardTab === "Songs" ? "active" : ""}
                onClick={() => changeTab("Songs")}
              >
                Songs
              </li>
              <li
                className={dashboardTab === "Playlists" ? "active" : ""}
                onClick={() => changeTab("Playlists")}
              >
                Playlists
              </li>
              <li
                className={dashboardTab === "Stories" ? "active" : ""}
                onClick={() => changeTab("Stories")}
              >
                Stories
              </li>
            </ul>
          </div>
        </div>
        <div className="wrapper_search">
          <div className="wrap_search">
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
           <Button onClick={() => setSearch("")}>
  <FiRefreshCcw />
</Button>
          </div>
          <div className="wrap_buttons">
            {dashboardTab === "Songs" && (
              <Button
                className="light_button"
                onClick={() => setAddSongModal(true)}
              >
                + Add Songs
              </Button>
            )}
            {dashboardTab === "Playlists" && (
              <Button
                className="light_button"
                onClick={() => setPlayListModal(true)}
              >
                + Add Playlist
              </Button>
            )}
          </div>
        </div>

        {dashboardTab === "Songs" && (
          <SongTable
            search={search}
            refreshKey={refreshKey}
            onEdit={openEditSong}
          />
        )}

        {/* {dashboardTab === "Playlists" && (
          <PlaylistTable
            search={search}
            refreshKey={refreshKey}
            onEdit={openEditPlaylist}
          />
        )} */}

        {dashboardTab === "Playlists" && (
  <PlaylistTable
    search={search}
    refreshKey={refreshKey}
    onEdit={openEditPlaylist}   // ← THIS IS MISSING
  />
)}

        {dashboardTab === "Stories" && <StoriesTable search={search} />}
      </div>

      {/* Add/Edit song modal */}
      <AddSongsModal
        modalAdd={addSongModal}
        closeAndClear={closeAndClear}
        editFaq={editSong}
        dashboardTab={dashboardTab}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />

      {/* Add/Edit playlist modal */}
      <AddPlaylistModal
        modalAdd={playListModal}
        closeAndClear={closeAndClear}
        editFaq={editPlaylist}
        dashboardTab={dashboardTab}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />
    </>
  );
};

export default ContentManagement;