import React, { useState } from "react";
import "./Notification.scss";
import SentNotification from "./SentNotification";
import ScheduleNotification from "./ScheduleNotification";
import CustomModal from "components/modals/CustomModal";
import SentNotificationModal from "./SentNotificationModal";
import { useSearchParams } from "react-router-dom";

const NotificationManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [refreshKey, setRefreshKey] = useState(0);


  const propertyTab = searchParams.get("tab") || "sentNotification";

  const [modalAdd, setModalAdd] = useState(false);

  // const closeAndClear = () => {
  //   setModalAdd(false);
  // };
  const closeAndClear = () => {
  setModalAdd(false);
  setRefreshKey(prev => prev + 1); // trigger refresh
};


  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  return (
    <div className="notifiaction_management">
      <div className="dashboard_title">
        <h3>Notification Management</h3>
        <button className="button" onClick={() => setModalAdd(true)}>
          Send Notification
        </button>
      </div>

      <div className="wrapper_cstm_tabers">
        <ul>
          <li
            className={propertyTab === "sentNotification" ? "active" : ""}
            onClick={() => handleTabChange("sentNotification")}
          >
            Sent Notifications
          </li>

          <li
            className={propertyTab === "scheduledDate" ? "active" : ""}
            onClick={() => handleTabChange("scheduledDate")}
          >
            Scheduled
          </li>
        </ul>
      </div>

      {propertyTab === "sentNotification" && (
  <SentNotification refreshKey={refreshKey} />
)}


      {propertyTab === "scheduledDate" && (
  <ScheduleNotification refreshKey={refreshKey} />
)}


      <SentNotificationModal
        modalAdd={modalAdd}
        closeAndClear={closeAndClear}
      />
    </div>
  );
};


export default NotificationManagement;
