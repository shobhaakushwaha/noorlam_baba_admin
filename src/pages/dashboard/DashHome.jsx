import { CiPlay1 } from "react-icons/ci";
import "./DashBoard.scss";
import { FaRegEye, FaUsers, FaMusic, FaMicrophone } from "react-icons/fa";
import { HiOutlineBookOpen } from "react-icons/hi";
import { PiLineVerticalLight } from "react-icons/pi";
import { Link, useSearchParams } from "react-router-dom";
import { song_banner } from "assets/images";
import { logger } from "utils/logger";
import React, { useEffect, useState } from "react";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  dashboardListApi,
  getDashboardTrending,
  dashboardGrowth,
} from "services/dashboard";
import useFullPageLoader from "common/UseFullPageLoader";
import NotFound from "common/NotFound";
import { userPlaceholder } from "assets/icons";
import { formatDate } from "utils/dateFormat";
import AudioModal from "components/modals/audioModal";
import CustomModal from "components/modals/CustomModal";

const DashHome = () => {
  const [dashboardTab, setDashboardTab] = useState("Pre-Order");
   const [showImagePreviewModel, setShowImagePreviewModel] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const showImagePreviewHandler = (profile) => {
    setShowImagePreviewModel(true);
    setImagePreview(profile);
  };
  logger.log("inside dashboard");
  const [loader, onShow, onHide] = useFullPageLoader();
  const [stats, setStats] = useState(null);
  const [toptenList, setTopTenList] = useState([]);
  const [showAudio, setShowAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const [audioTitle, setAudioTitle] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [contentDistribution, setContentDistribution] = useState([]);

  // Dynamic stats cards
  const statsCards = stats
    ? [
        {
          title: "Total Users",
          value: stats.totalUsers?.toLocaleString() || "0",
          icon: <FaUsers />,
          color: "#1B4CFF",
          bgColor: "rgba(27, 76, 255, 0.1)",
        },
        {
          title: "Total Artists",
          value: stats.totalArtists?.toLocaleString() || "0",
          icon: <FaMicrophone />,
          color: "#22C55E",
          bgColor: "rgba(34, 197, 94, 0.1)",
        },
        {
          title: "Songs Uploaded",
          value: stats.totalSongs?.toLocaleString() || "0",
          icon: <FaMusic />,
          color: "#F59E0B",
          bgColor: "rgba(245, 158, 11, 0.1)",
        },
        {
          title: "Stories Posted",
          value: stats.totalStories?.toLocaleString() || "0",
          icon: <HiOutlineBookOpen />,
          color: "#EF4444",
          bgColor: "rgba(239, 68, 68, 0.1)",
        },
      ]
    : [];

  const getDashBoardGrowth = async () => {
    onShow();
    try {
      const res = await dashboardGrowth();

      if (res?.data?.status === 200) {
        const data = res.data.data;

        const listeners = data.listener || [];
        const artists = data.artist || [];

        const monthNames = [
          "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
          "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
        ];

        const growthMap = {};

        listeners.forEach((item) => {
          const [year, monthNum] = item.month.split("-");
          const monthName = monthNames[parseInt(monthNum) - 1];
          growthMap[item.month] = {
            month: monthName,
            users: item.monthlyCount,
            artists: 0,
          };
        });

        artists.forEach((item) => {
          const [year, monthNum] = item.month.split("-");
          const monthName = monthNames[parseInt(monthNum) - 1];
          if (growthMap[item.month]) {
            growthMap[item.month].artists = item.monthlyCount;
          } else {
            growthMap[item.month] = {
              month: monthName,
              users: 0,
              artists: item.monthlyCount,
            };
          }
        });

        const formattedGrowth = Object.values(growthMap);

        // Pad missing months so line chart draws properly
        const currentMonth = new Date().getMonth();
        const padded = monthNames.slice(0, currentMonth + 1).map((m) => {
          const existing = formattedGrowth.find((d) => d.month === m);
          return existing || { month: m, users: 0, artists: 0 };
        });

        setUserGrowthData(padded);

        // Pie chart
        const totals = data.totals || [];
        const totalsMap = {};
        totals.forEach((item) => {
          totalsMap[item.key] = item.count;
        });

        setContentDistribution([
          { name: "Songs", value: totalsMap.songs || 0, fill: "#1B4CFF" },
          { name: "Playlists", value: totalsMap.playlists || 0, fill: "#22C55E" },
          { name: "Albums", value: totalsMap.albums || 0, fill: "#F59E0B" },
          { name: "Stories", value: totalsMap.stories || 0, fill: "#EF4444" },
        ]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      onHide();
    }
  };

  const getDashBoardTrendingList = async (type) => {
    onShow();
    try {
      const res = await getDashboardTrending({ type });

      if (res?.data?.status === 200) {
        const list = res?.data?.data?.[type] || [];
        setTopTenList(list);
      }
    } catch (error) {
      console.log("error:-->", error);
    } finally {
      onHide();
    }
  };

  const getDashBoardList = async () => {
    onShow();
    try {
      const { data } = await dashboardListApi();

      if (data?.status === 200) {
        setStats(data?.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      onHide();
    }
  };

  useEffect(() => {
    getDashBoardList();
    getDashBoardGrowth();
  }, []);

  useEffect(() => {
    const type = dashboardTab === "Pre-Order" ? "songs" : "playlists";
    getDashBoardTrendingList(type);
  }, [dashboardTab]);

  return (
    <div className="dashboard_home">
      <div className="dashboard_title">
        <h3>Dashboard</h3>
        <p className="dashboard_subtitle">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats_grid">
        {statsCards.map((stat, index) => (
          <div className="stat_card" key={index}>
            
            <div className="stat_content">
              <h2>{stat.value}</h2>
              <p>{stat.title}</p>
            </div>
            <div className="stat_header">
              <div
                className="stat_icon"
                style={{ background: stat.bgColor, color: stat.color }}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="charts_row">
        <div className="chart_card large">
          <div className="chart_header">
            <h4>User & Artist Growth</h4>
            <div className="chart_legend">
              <span className="legend_item">
                <span className="dot" style={{ background: "#1B4CFF" }}></span>
                Users
              </span>
              <span className="legend_item">
                <span className="dot" style={{ background: "#22C55E" }}></span>
                Artists
              </span>
            </div>
          </div>
          <div className="chart_body">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1B4CFF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1B4CFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorArtists" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#1B4CFF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
                <Area
                  type="monotone"
                  dataKey="artists"
                  stroke="#22C55E"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorArtists)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart_card">
          <div className="chart_header">
            <h4>Content Distribution</h4>
          </div>
          <div className="chart_body">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {contentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span style={{ color: "#4B5563", fontSize: "12px" }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trending Tables */}
      <div className="wrapper_cstm_tabers">
        <ul>
          <li
            className={dashboardTab === "Pre-Order" ? "active" : ""}
            onClick={() => setDashboardTab("Pre-Order")}
          >
            Top 10 Trending Songs
          </li>
          <li
            className={dashboardTab === "Orders" ? "active" : ""}
            onClick={() => setDashboardTab("Orders")}
          >
            Top 10 Trending Playlists
          </li>
        </ul>
        {dashboardTab === "Pre-Order" && (
          <div className="table_wrap table_responsive">
            <table className="table custom_table">
              <thead>
                <tr>
                  <th className="nowrap text-center">Song ID</th>
                  <th className="nowrap text-center">Cover Images</th>
                  <th className="nowrap text-center">Name</th>
                  <th className="nowrap text-center">Added By</th>
                  <th className="nowrap text-center">Genre</th>
                  <th className="nowrap text-center">Mood</th>
                  <th className="nowrap text-center">Added On</th>
                  <th className="nowrap text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {toptenList && toptenList?.length > 0 ? (
                  toptenList.map((data, index) => (
                    <tr key={index}>
                      <td className="text-center">{data?.songNumber}</td>
                      <td className="text-center">
                        <img
                          className="cstm_img_table"
                          src={data?.coverImage || userPlaceholder}
                          alt=""  onClick={() =>
                          showImagePreviewHandler(
                            data?.coverImage || userPlaceholder,
                          )
                        }
                        />
                      </td>
                      <td className="text-center">
                        {data?.songTitle ? data?.songTitle : "N/A"}
                      </td>
                      <td className="text-center">
                        {data?.addedBy ? data.addedBy : "N/A"}
                      </td>
                      <td className="text-center">{data?.genres}</td>
                      <td className="text-center">
                        {data?.moodList?.length > 0
                          ? data?.moodList.join(", ")
                          : "NA"}
                      </td>
                      <td className="text-center">
                        {formatDate(data?.createdAt)}
                      </td>
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
                          <Link
                            to={`/song-management/request-detail/${data?._id}?tab=artist`}
                          >
                            <FaRegEye />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <NotFound msg="User list not available" onHide={true} />
                )}
              </tbody>
            </table>
          </div>
        )}
        {dashboardTab === "Orders" && (
          <div className="table_wrap table_responsive">
            <table className="table custom_table">
              <thead>
                <tr>
                  <th className="nowrap text-center">Playlists ID</th>
                  <th className="nowrap text-center">Cover Image</th>
                  <th className="nowrap text-center">Name</th>
                  <th className="nowrap text-center">Genre</th>
                  <th className="nowrap text-center">Mood</th>
                  <th className="nowrap text-center">Total Songs</th>
                </tr>
              </thead>

              <tbody>
                {toptenList && toptenList?.length > 0 ? (
                  toptenList.map((data, index) => (
                    <tr key={index}>
                      <td className="text-center">{data?.playistNumber}</td>
                      <td className="text-center">
                        <img
                          className="cstm_img_table"
                          src={data.coverImage || userPlaceholder}
                          alt=""   onClick={() =>
                          showImagePreviewHandler(
                            data?.coverImage || userPlaceholder,
                          )
                        }
                        />
                      </td>
                      <td className="text-center">{data?.name}</td>
                      <td className="text-center">
                        {data?.genres ? data?.genres : "N/A"}
                      </td>
                      <td className="text-center">
                        {data?.moods?.length > 0
                          ? data?.moods.join(", ")
                          : "NA"}
                      </td>
                      <td className="text-center">{data?.songCount}</td>
                    </tr>
                  ))
                ) : (
                  <NotFound msg="User list not available" onHide={true} />
                )}

              
              </tbody>
            </table>
          </div>
        )}
      </div>
      <AudioModal
        open={showAudio}
        audioUrl={audioUrl}
        title={audioTitle}
        onClose={() => setShowAudio(false)}
      />

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

export default DashHome;