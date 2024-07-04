import React, { useState, useEffect } from "react";
import "../../assets/css/main.css";
import profileImage from "../../assets/img/Thinley.jpeg";
import AdvanceServices from "../services/AdvanceServices";
import MyApplications from "../general/MyApplications";
import { IoBagCheck } from "react-icons/io5";
import LoginSuccess from "../general/LoginSuccess";

const EmployeeApplications = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("currentapplication");
  const [currentapplication, setCurrentApplications] = useState([]);
  const [previousapplication, setPreviousApplications] = useState([]);
  const all_advance = [
    "ex_country_tour_advance",
    "in_country_tour_advance",
    "other_advance",
    "salary_advance",
  ];
  const preParams = {
    status: ["confirmed", "dispatched", "closed"],
    advance_type: all_advance,
    type: "my_advance",
  };

  const currentParams = {
    status: ["pending", "rejected", "verified"],
    advance_type: all_advance,
    type: "my_advance",
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const fetchCurrentApplications = async () => {
    try {
      const response = await AdvanceServices.get(currentParams);
      setCurrentApplications(response.data);
    } catch (error) {
      console.error("Error fetching current applications:", error);
    }
  };

  const fetchPreviousApplications = async () => {
    try {
      const response = await AdvanceServices.get(preParams);
      setPreviousApplications(response.data);
    } catch (error) {
      console.error("Error fetching previous applications:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const isLoggedIn = localStorage.getItem("isLoggedIn");

      if (!isLoggedIn) {
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
      }
    }
  }, []);

  useEffect(() => {
    if (activeTab === "currentapplication") {
      fetchCurrentApplications();
    } else if (activeTab === "previousapplication") {
      fetchPreviousApplications();
    }
  }, [activeTab]);

  console.log("current", currentapplication);
  console.log("previous", previousapplication);

  return (
    <div>
      {isLoggedIn && <LoginSuccess message="Login Successful!!!" />}
      {/* Tabs navs */}
      <ul className="nav nav-tabs mb-2 col-12 mynav" id="ex1" role="tablist">
        <li className="nav-item col-6 text-center tablist" role="presentation">
          <a
            className={`nav-link ${
              activeTab === "currentapplication" ? "active" : ""
            }`}
            id="ex1-tab-1"
            href="#currentapplication"
            role="tab"
            aria-controls="currentapplication"
            aria-selected={
              activeTab === "currentapplication" ? "true" : "false"
            }
            onClick={() => handleTabClick("currentapplication")}
            style={{ color: activeTab === "currentapplication" ? "blue" : "" }}
          >
            <span>
              <IoBagCheck size={24} />
            </span>
            <span> Current Application</span>
          </a>
        </li>
        <li className="nav-item col-6 text-center tablist" role="presentation">
          <a
            className={`nav-link ${
              activeTab === "previousapplication" ? "active" : ""
            }`}
            id="ex1-tab-2"
            href="#previousapplication"
            role="tab"
            aria-controls="previousapplication"
            aria-selected={
              activeTab === "previousapplication" ? "true" : "false"
            }
            onClick={() => handleTabClick("previousapplication")}
            style={{ color: activeTab === "previousapplication" ? "blue" : "" }}
          >
            <span>
              <IoBagCheck size={24} />
            </span>
            <span> Previous Application</span>
          </a>
        </li>
      </ul>
      {/* Tabs navs */}

      {/* Tabs content */}
      <div className="tab-content col-12">
        <MyApplications
          heading={"Current Applications"}
          applications={currentapplication}
          activeTab={activeTab}
          profileImage={profileImage}
          title={"currentapplication"}
        />
        <MyApplications
          heading={"Previous Applications"}
          applications={previousapplication}
          activeTab={activeTab}
          profileImage={profileImage}
          title={"previousapplication"}
        />
      </div>
      {/* Tabs content */}
    </div>
  );
};

export default EmployeeApplications;
