import React, { useState } from "react";
import "../../assets/css/main.css";
import { FaCar } from "react-icons/fa";
import { MdFlight } from "react-icons/md";
import InCountryTour from "../general/InCountryTour";
import OutCountryTour from "../general/OutCountryTour";

const TourAdvance = () => {
  const [activeTab, setActiveTab] = useState("incountrytour");

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div>
      {/* Tabs navs */}
      <ul className="nav nav-tabs mb-2 col-12 mynav" id="ex1" role="tablist">
        <li className="nav-item col-6 text-center tablist" role="presentation">
          <a
            className={`nav-link ${
              activeTab === "incountrytour" ? "active" : ""
            }`}
            id="ex1-tab-1"
            href="#incountrytour"
            role="tab"
            aria-controls="incountrytour"
            aria-selected={activeTab === "incountrytour" ? "true" : "false"}
            onClick={() => handleTabClick("incountrytour")}
            style={{ color: activeTab === "incountrytour" ? "blue" : "" }}
          >
            <span>
              <FaCar size={24} />
            </span>
            <span> In Country Tour</span>
          </a>
        </li>
        <li className="nav-item col-6 text-center tablist" role="presentation">
          <a
            className={`nav-link ${
              activeTab === "excountrytour" ? "active" : ""
            }`}
            id="ex1-tab-2"
            href="#excountrytour"
            role="tab"
            aria-controls="excountrytour"
            aria-selected={activeTab === "excountrytour" ? "true" : "false"}
            onClick={() => handleTabClick("excountrytour")}
            style={{ color: activeTab === "excountrytour" ? "blue" : "" }}
          >
            <span>
              <MdFlight size={24} />
            </span>
            <span> Ex Country Tour</span>
          </a>
        </li>
      </ul>
      {/* Tabs navs */}

      {/* Tabs content */}
      <div className="tab-content col-12">
        <div
          className={`tab-pane fade mt-2 mb-3 ${
            activeTab === "incountrytour" ? "show active" : ""
          }`}
          id="incountrytour"
          role="tabpanel"
          aria-labelledby="ex1-tab-1"
        >
          <InCountryTour />
        </div>

        <div
          className={`tab-pane fade ${
            activeTab === "excountrytour" ? "show active" : ""
          }`}
          id="excountrytour"
          role="tabpanel"
          aria-labelledby="ex1-tab-2"
        >
          <OutCountryTour setActiveTab={setActiveTab} />
        </div>
      </div>
      {/* Tabs content */}
    </div>
  );
};

export default TourAdvance;
