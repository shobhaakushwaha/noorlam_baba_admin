import { Button, Search } from "components/form";
import React, { useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import Faq from "./Faq";
import Support from "./Support";
import "./Support.scss";
import AddFaqModal from "./AddFaqModal";

const SupportManagement = () => {
  const [search, setSearch] = useState("");

  const [dashboardTab, setDashboardTab] = useState("Approved");
  const [refreshFaq, setRefreshFaq] = useState(0);

  const [faqModalOpen, setFaqModalOpen] = useState(false);

  const handleReset = () => {
  setSearch("");              // clear search
  setRefreshFaq(Date.now());  // force reload
};

const closeAndClear = () => {
  setFaqModalOpen(false);
};

  return (
    <div className="wrap_support_management">
      <div className="dashboard_title">
        <h3>Support Management</h3>
        <div className="wrapper_cstm_tabers">
          <ul>
            <li
              className={dashboardTab === "Approved" ? "active" : ""}
              onClick={() => setDashboardTab("Approved")}
            >
              FAQs
            </li>
            <li
              className={dashboardTab === "Request" ? "active" : ""}
              onClick={() => setDashboardTab("Request")}
            >
              Support
            </li>
          </ul>
        </div>
      </div>

      {dashboardTab === "Approved" && (
        <div className="wrapper_search">
          <div className="wrap_search">
            <Search
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

            <Button onClick={handleReset}>
  <FiRefreshCcw />
</Button>

          </div>

          <Button
            className="light_button"
            onClick={() => setFaqModalOpen(true)}
          >
            + Add FAQ
          </Button>
        </div>
      )}

      {/* TAB CONTENT */}
      {/* {dashboardTab === "Approved" && <Faq />} */}
      {dashboardTab === "Approved" && (
  <Faq refresh={refreshFaq}  search={search} />
)}
      {dashboardTab === "Request" && <Support />}

      {/* Add Faq modal */}
      {/* <AddFaqModal modalAdd={faqModalOpen} closeAndClear={closeAndClear} /> */}
     <AddFaqModal
  modalAdd={faqModalOpen}
  closeAndClear={closeAndClear}
  onSuccess={() => setRefreshFaq(Date.now())}
/>

    </div>
  );
};

export default SupportManagement;
