import React, { useState, useEffect, useMemo } from "react"; // Import useMemo
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  dashboardIcon1,
  dashboardIcon2,
  dashboardIcon3,
  dashboardIcon4,
} from "assets/icons";
import { DatePicker, Select } from "components/form";
import { LuCalendarDays } from "react-icons/lu";
import "./reportmanagement.scss";
import useFullPageLoader from "common/UseFullPageLoader";
import { dashboardListApi, getGraphData } from "services/dashboard";
import { Button } from "react-bootstrap";
import { FiRefreshCcw } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";
import { formatDates } from "utils/dateFormat";

const ReportsManagement = () => {

    const currentYear = new Date().getFullYear();
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Generate year range
  const yearOptions = useMemo(() => {
    const years = [];
    const startYear = currentYear - 5; // 2 years back
    const endYear = currentYear;       // current year
    
    for (let year = endYear; year >= startYear; year--) {
      years.push(year);
    }
    
    return years;
  }, [currentYear]); 
  const [analytics, setAnalytics] = useState({});
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [artistsGrowthData, setArtistsGrowthData] = useState([]);
  const [playlistsEngagementData, setPlaylistsEngagementData] = useState([]);
  const [userCreatedPlaylistsData, setUserCreatedPlaylistsData] = useState([]);
  const [loader, onShow, onHide] = useFullPageLoader();

  // const [selectedYear, setSelectedYear] = useState("2024");
  const [searchParams, setSearchParams] = useSearchParams();

  const [startDate, setStartDate] = useState("");
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [endDate, setEndDate] = useState("");
  const [filterType, setFilterType] = useState("year"); // "year" or "custom"

  // Function to transform API response to chart format
  // const transformApiDataToChartData = (apiData, dataKey) => {
  //    console.log(apiData,"PPPPPPPPPPPPPPPPPPPPPPP")
  //   console.log("Transforming data:", apiData, "for key:", dataKey);

  //   if (!apiData || apiData.length === 0) {
  //     console.log("No data to transform");
  //     return [];
  //   }


    const transformApiDataToChartData = (apiData, dataKey) => {
  if (!apiData || apiData.length === 0) return [];

  return apiData.map((item) => ({
    month: item.month,     // Already "Jan", "Feb", etc.
    [dataKey]: item.count, // Use count directly
  }));


    return apiData?.map((item) => {
       console.log(item[0],"ELLOOW")
      const monthYear = item.month || item._id;
    const count = item?.count || item.count || 0; // Get count from correct location
    
      const [year, monthNum] = monthYear.split("-");

      const monthNames = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];
      const monthName = monthNames[parseInt(monthNum) - 1];

      return {
        month: monthName,
        [dataKey]: item._id?.count,
        fullDate: monthYear,
      };
    });
  };

  // Build filter parameters
  const getFilterParams = (graphType) => {
    const params = { filter: graphType };

    if (filterType === "custom" && startDate && endDate) {
      params.type = "custom";
      params.startDate = startDate;
      params.endDate = endDate;
    } else {
      params.type = "year";
      params.year = selectedYear;
    }

    console.log("Filter params for", graphType, ":", params);
    return params;
  };

  const getDashBoardList = async () => {
    try {
      let filters = {};

      if (dateFilter.startDate && dateFilter.endDate) {
        filters = {
          type: "custom",
          startDate: formatDates(dateFilter.startDate),
          endDate: formatDates(dateFilter.endDate),
        };
      } else {
        filters = {
          type: "year",
          year: selectedYear,
        };
      }

      const { data } = await dashboardListApi(filters);

      if (data?.status === 200) {
        setAnalytics(data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch all graph data with filters
  const fetchAllGraphData = async () => {
    onShow();
    try {
      const [userRes, artistRes, savedRes, createdRes] = await Promise.all([
        getGraphData({ filter: "user" }),
        getGraphData({ filter: "artist" }),
        getGraphData({ filter: "saved" }),
        getGraphData({ filter: "created" }),
      ]);

// Transform and set user growth data
      if (userRes?.data?.status === 200 && userRes?.data?.data.data) {
        console.log("Processing user datammmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm:", userRes.data.data);
        const transformedUserData = transformApiDataToChartData(
          userRes.data.data?.data,
          "users",
        );
        console.log("Transformed user data:", transformedUserData);
        setUserGrowthData(transformedUserData);
      } else {
        console.log("User data not valid:", userRes);
        setUserGrowthData([]);
      }

      // Transform and set artists growth data
      if (artistRes?.data?.status === 200 && artistRes?.data?.data.data) {
        console.log("Processing artist data:", artistRes.data.data);
        const transformedArtistData = transformApiDataToChartData(
          artistRes.data.data?.data,
          "artists",
        );
        console.log("Transformed artist data:", transformedArtistData);
        setArtistsGrowthData(transformedArtistData);
      } else {
        console.log("Artist data not valid:", artistRes);
        setArtistsGrowthData([]);
      }

      // Transform and set playlists engagement data (saved)
      if (savedRes?.data?.status === 200 && savedRes?.data?.data?.data) {
        console.log("Processing saved data:", savedRes.data.data);
        const transformedSavedData = transformApiDataToChartData(
          savedRes.data.data.data,
          "hours",
        );
        console.log("Transformed saved data:", transformedSavedData);
        setPlaylistsEngagementData(transformedSavedData);
      } else {
        console.log("Saved data not valid:", savedRes);
        setPlaylistsEngagementData([]);
      }

      // Transform and set user created playlists data
      if (createdRes?.data?.status === 200 && createdRes?.data?.data.data) {
        console.log("Processing created data:", createdRes.data.data);
        const transformedCreatedData = transformApiDataToChartData(
          createdRes.data.data?.data,
          "playlists",
        );
        console.log("Transformed created data:", transformedCreatedData);
        setUserCreatedPlaylistsData(transformedCreatedData);
      } else {
        console.log("Created data not valid:", createdRes);
        setUserCreatedPlaylistsData([]);
      }
    } catch (error) {
      console.error("Error fetching graph data:", error);
      console.error("Error details:", error.response || error.message);
    } finally {
      onHide();
    }
  };

  // Handle year change
  const handleYearChange = (e) => {
    const year = e.target.value;
    setSelectedYear(year);
    setFilterType("year");
    setStartDate("");
    setEndDate("");
  };

 
  const doResestFilter = () => {
    setDateFilter({
      startDate: "",
      endDate: "",
    });
  };

  // Initial load
  useEffect(() => {
    getDashBoardList();
    // fetchAllGraphData();
  }, [selectedYear, dateFilter]);

  // Refetch when filters change
  useEffect(() => {
    if (
      filterType === "year" ||
      (filterType === "custom" && startDate && endDate)
    ) {
      getDashBoardList();
      fetchAllGraphData();
    }
  }, [selectedYear, startDate, endDate, filterType]);

  // Debug: Log state changes
  useEffect(() => {
    console.log("User Growth Data State:", userGrowthData);
  }, [userGrowthData]);

  useEffect(() => {
    console.log("Artists Growth Data State:", artistsGrowthData);
  }, [artistsGrowthData]);
  const deleteSearchAndPage = () => {
    const urlInstance = new URLSearchParams(searchParams);
    urlInstance.delete("page");
    urlInstance.delete("search");
    setSearchParams(urlInstance);
  };

  return (
    <div className="dashboard_home">
      <div className="dashboard_title">
        <h3>Reports & Analytics</h3>
        <div className="wrap_flex">
        <Select value={selectedYear} onChange={handleYearChange}>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                Year - {year}
              </option>
            ))}
          </Select>

          <div className="wrap_common_search">
            <DatePicker
              icon={<LuCalendarDays />}
              placeholder="from"
              value={dateFilter?.startDate}
              maxDate={dateFilter?.endDate}
              onChange={(date) => {
                setDateFilter((prev) => ({ ...prev, startDate: date }));
                deleteSearchAndPage();
              }}
            />
          </div>
          <div className="wrap_common_search">
            <DatePicker
              icon={<LuCalendarDays />}
              placeholder="to"
              value={dateFilter?.endDate}
              minDate={dateFilter?.startDate}
              onChange={(date) => {
                setDateFilter((prev) => ({ ...prev, endDate: date }));
                deleteSearchAndPage();
              }}
            />
          </div>
          <Button onClick={doResestFilter}>
            <FiRefreshCcw />
          </Button>
        </div>
      </div>

      <div className="summery_card_wrap">
        <div className="summery_card">
          <div className="content">
            <p>Active Users</p>
            <img src={dashboardIcon1} alt="" />
          </div>
          <h4>{analytics?.activeListeners || 0}</h4>
        </div>
        <div className="summery_card">
          <div className="content">
            <p>Active Artists</p>
            <img src={dashboardIcon2} alt="" />
          </div>
          <h4>{analytics?.activeArtists || 0}</h4>
        </div>
        <div className="summery_card">
          <div className="content">
            <p>Total Songs</p>
            <img src={dashboardIcon3} alt="" />
          </div>
          <h4>{analytics?.totalSongs || 0}</h4>
        </div>
        <div className="summery_card">
          <div className="content">
            <p>Total Playlists</p>
            <img src={dashboardIcon4} alt="" />
          </div>
          <h4>{analytics?.totalPlaylists || 0}</h4>
        </div>
      </div>

      <div className="wrap_data_Graph">
        {/* User Growth Chart */}
        <div className="card_graph">
          <h5>User Growth</h5>
          {userGrowthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#666", fontSize: 12 }}
                  axisLine={{ stroke: "#e0e0e0" }}
                />
                <YAxis
                  tick={{ fill: "#666", fontSize: 12 }}
                  axisLine={{ stroke: "#e0e0e0" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`${value} users`, "Count"]}
                />
                <Bar
                  dataKey="users"
                  fill="#4461F2"
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
              }}
            >
              No data available
            </div>
          )}
        </div>

        {/* Artists Growth Chart */}
        <div className="card_graph">
          <h5>Artists Growth</h5>
          {artistsGrowthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={artistsGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#666", fontSize: 12 }}
                  axisLine={{ stroke: "#e0e0e0" }}
                />
                <YAxis
                  tick={{ fill: "#666", fontSize: 12 }}
                  axisLine={{ stroke: "#e0e0e0" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`${value} artists`, "Count"]}
                />
                <Bar
                  dataKey="artists"
                  fill="#4461F2"
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
              }}
            >
              No data available
            </div>
          )}
        </div>

        {/* Playlists Engagement Chart */}
        <div className="card_graph">
          <h5>Playlists Engagement (Naksha's)</h5>
          {playlistsEngagementData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={playlistsEngagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#666", fontSize: 12 }}
                  axisLine={{ stroke: "#e0e0e0" }}
                />
                <YAxis
                  tick={{ fill: "#666", fontSize: 12 }}
                  axisLine={{ stroke: "#e0e0e0" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`${value}`, "Count"]}
                />
                <Bar
                  dataKey="hours"
                  fill="#4461F2"
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
              }}
            >
              No data available
            </div>
          )}
        </div>

        {/* User Created Playlists Chart */}
        <div className="card_graph">
          <h5>Playlists (User Created)</h5>
          {userCreatedPlaylistsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userCreatedPlaylistsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#666", fontSize: 12 }}
                  axisLine={{ stroke: "#e0e0e0" }}
                />
                <YAxis
                  tick={{ fill: "#666", fontSize: 12 }}
                  axisLine={{ stroke: "#e0e0e0" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [`${value} playlists`, "Count"]}
                />
                <Bar
                  dataKey="playlists"
                  fill="#4461F2"
                  radius={[8, 8, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div
              style={{
                height: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#999",
              }}
            >
              No data available
            </div>
          )}
        </div>
      </div>
      {loader}
    </div>
  );
};

export default ReportsManagement;
