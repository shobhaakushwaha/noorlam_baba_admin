import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "pages/auth/login/LoginPage";
import ForgotPassword from "pages/auth/forgotPassword/ForgotPassword";
import ResetPassword from "pages/auth/resetPassword/ResetPassword";
import Otp from "pages/auth/otp/Otp";
import Dashboard from "./Dashboard";
import DashHome from "pages/dashboard/DashHome";
import CmsManagement from "pages/cmsmanagement/CmsManagement";
import CategoryManagement from "pages/categorymanagement/CategoryManagement";
import UserManagement from "pages/usermanagement/UserManagement";
import UserDetails from "pages/usermanagement/userdetail/UserDetails";
import SavedPlaylist from "pages/commonpage/SavedPlaylist";
import SellerManagement from "pages/sellermanagement/SellerManagement";
import SellerDetails from "pages/sellermanagement/sellerdetail/SellerDetails";
import RequestDetail from "pages/sellermanagement/requestdetails/RequestDetail";
import ChangePassword from "pages/changePassword/ChangePassword";
import SongManagement from "pages/songmanagement/SongManagement";
import RequestDetails from "pages/songmanagement/requestdetail/RequestDetails";
import NotificationManagement from "pages/notificationmanagement/NotificationManagement";
import SupportManagement from "pages/supportmanagement/SupportManagement";
import ReportsManagement from "pages/reportsmanagement/ReportsManagement";
import BannerManagement from "pages/bannermanagement/BannerManagement";
import ContentManagement from "pages/contentmanagement/ContentManagement";
import ProfileUpdate from "pages/profile-update/profile-update";

const Routing = () => {
  const allRoutes = [
    {
      id: 1,
      name: "/dashboard",
      elements: <DashHome />,
      isActive: true,
    },
    {
      id: 2,
      name: "/cms-management",
      elements: <CmsManagement />,
      isActive: true,
    },
    {
      id: 3,
      name: "/category-management",
      elements: <CategoryManagement />,
      isActive: true,
    },

    {
      id: 4,
      name: "/user-management",
      elements: <UserManagement />,
      isActive: true,
    },
    {
      id: 5,
      name: "/user-management/user-detail/:userId",
      elements: <UserDetails />,
      isActive: true,
    },
    {
      id: 6,
      name: "/user-management/user-detail/:userId/saved-playlist/:id",
      
      elements: <SavedPlaylist />,
      isActive: true,
    },

    {
      id: 7,
      name: "/seller-management",
      elements: <SellerManagement />,
      isActive: true,
    },
    {
      id: 8,
      name: "/seller-management/seller-detail/:userId",
      elements: <SellerDetails />,
      isActive: true,
    },

    {
      id: 9,
      name: "/seller-management/request-detail/:userId",
      elements: <RequestDetail />,
      isActive: true,
    },

    {
      id: 10,
      name: "/song-management",
      elements: <SongManagement />,
      isActive: true,
    },
    {
      id: 11,
      name: "/song-management",
      elements: <SongManagement />,
      isActive: true,
    },
    {
      id: 12,
      name: "/song-management/request-detail/:songId",
      elements: <RequestDetails />,
      isActive: true,
    },
    {
      id: 13,
      name: "/notification-management",
      elements: <NotificationManagement />,
      isActive: true,
    },
    {
      id: 14,
      name: "/support-management",
      elements: <SupportManagement />,
      isActive: true,
    },
    {
      id: 15,
      name: "/reports-management",
      elements: <ReportsManagement />,
      isActive: true,
    },
    {
      id: 16,
      name: "/banner-management",
      elements: <BannerManagement />,
      isActive: true,
    },
    {
      id: 17,
      name: "/content-management",
      elements: <ContentManagement />,
      isActive: true,
    },
    {
      id: 18,
      name: "/change-password",
      elements: <ChangePassword />,
      isActive: true,
    },

    {
      id: 19,
      name: "/profile-update",
      elements: <ProfileUpdate />,
      isActive: true,
    },
  ].filter((check) => check?.isActive);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="" element={<Dashboard />}>
        {allRoutes.map((mapData, ind) => (
          <Route
            key={ind}
            path={mapData?.name}
            element={<ProtectedRoute>{mapData?.elements} </ProtectedRoute>}
          />
        ))}
      </Route>
    </Routes>
  );
};

export default Routing;

const ProtectedRoute = ({ children }) => {
  // const token = getToken();
  const tokenGot = localStorage.getItem("naksha_admin");

  // logger.log("lokenGot:-->", tokenGot);

  if (!tokenGot) {
    // not logged in → go to login
    return <Navigate to="/" replace />;
  }

  return children;
};

// -----------------------------------old code

// import React from "react";
// import { Route, Routes } from "react-router-dom";
// import LoginPage from "pages/auth/login/LoginPage";
// import ForgotPassword from "pages/auth/forgotPassword/ForgotPassword";
// import ResetPassword from "pages/auth/resetPassword/ResetPassword";
// import Otp from "pages/auth/otp/Otp";
// import Dashboard from "./Dashboard";
// import DashHome from "pages/dashboard/DashHome";
// import CmsManagement from "pages/cmsmanagement/CmsManagement";
// import CategoryManagement from "pages/categorymanagement/CategoryManagement";

// const Routing = () => {

//   return (
//     <Routes>
//       <Route path="/" element={<LoginPage />} />
//       <Route path="/forgot-password" element={<ForgotPassword />} />
//       <Route path="/reset-password" element={<ResetPassword />} />
//       <Route path="/otp" element={<Otp />} />
//       <Route path="" element={<Dashboard />}>
//         <Route path="/dashboard" element={<DashHome />} />
//         <Route path="/cms-management" element={<CmsManagement />} />
//         <Route path="/category-management" element={<CategoryManagement />} />
//       </Route>
//     </Routes>
//   );
// };

// export default Routing;
