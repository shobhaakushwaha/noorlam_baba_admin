import { Header } from "components/header/Header";
import Sidenav from "components/sideMenu/Sidenav";
import React from "react";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <div className="Dashboard">
       <Header />
        <div className="dashboard_section full-width">
          <div className="sidebar_section">
            <Sidenav />
          </div>
          <div className="dashboard_wrap">
            <div className="dashboard_pages">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
