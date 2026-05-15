import { Button, Search } from "components/form";
import React, { useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import Faq from "./Faq";
import Support from "./Support";
import "./Support.scss";
import AddFaqModal from "./AddFaqModal";

const SupportManagement = () => {
  const [search, setSearch] = useState("");
  const [faqType, setFaqType] = useState("");

  const [dashboardTab, setDashboardTab] = useState("Approved");
  const [refreshFaq, setRefreshFaq] = useState(0);

  const [faqModalOpen, setFaqModalOpen] = useState(false);

  const handleReset = () => {
    setSearch("");
    setRefreshFaq(Date.now());
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

      <div className="wrapper_search">
        <div className="wrap_search">
          {dashboardTab === "Approved" && (
            <>
              <Search
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Button onClick={handleReset}>
                <FiRefreshCcw />
              </Button>
            </>
          )}
        </div>

        <div className="support_toolbar_actions">
          {dashboardTab === "Approved" && (
            <Button
              className="light_button"
              onClick={() => setFaqModalOpen(true)}
            >
              + Add FAQ
            </Button>
          )}

          <select
            className="form-control"
            value={faqType}
            onChange={(e) => setFaqType(e.target.value)}
          >
            <option value="">All</option>
            <option value="seller">Seller</option>
            <option value="logistic">Logistic</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {dashboardTab === "Approved" && (
        <Faq refresh={refreshFaq} search={search} faqType={faqType} />
      )}
      {dashboardTab === "Request" && <Support supportType={faqType} />}

      <AddFaqModal
        modalAdd={faqModalOpen}
        closeAndClear={closeAndClear}
        faqType={faqType || "seller"}
        onSuccess={() => setRefreshFaq(Date.now())}
      />
    </div>
  );
};

export default SupportManagement;
