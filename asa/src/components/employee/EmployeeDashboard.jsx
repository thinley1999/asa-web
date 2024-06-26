import React, { useState } from "react";
import "../../assets/css/main.css";
import profileImage from "../../assets/img/Thinley.jpeg";

const EmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState("currentapplication");

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
              <i className="bi bi-bag-check-fill"></i>
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
              <i className="bi bi-bag-check-fill"></i>
            </span>
            <span> Previous Application</span>
          </a>
        </li>
      </ul>
      {/* Tabs navs */}

      {/* Tabs content */}
      <div className="tab-content col-12">
        <div
          className={`tab-pane fade ${
            activeTab === "currentapplication" ? "show active" : ""
          }`}
          id="currentapplication"
          role="tabpanel"
          aria-labelledby="ex1-tab-1"
        >
          <h6 className="custon-h6 py-2">My Applications</h6>
          <div className="d-flex flex-wrap align-items-center py-3 px-2 mb-2 employeediv w-100">
            <div className="d-flex align-items-center py-1 col-lg-3 col-xl-3 col-md-4 col-6 bio">
              <img
                src={profileImage}
                className="rounded-circle me-2"
                style={{ width: "8vh" }}
                alt="Profile"
              />
              <div>
                <p className="textheading">Thinley Yoezer</p>
                <p className="textsubheading">Asst. ICT Officer</p>
              </div>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Advance Claim</p>
              <p className="textsubheading">Nu.20,000</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Advance Type</p>
              <p className="textsubheading">Salary Advance</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Application Date</p>
              <p className="textsubheading">19/06/2024</p>
            </div>
            <div className="details py-1 col-lg-1 col-xl-1 col-md-4 col-6">
              <p className="textheading">Status</p>
              <p className="textsubheading text-success">Pending</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4  col-6">
              <a
                href="/viewCurrentApplication"
                className="btn btn-outline-primary"
              >
                View Details
              </a>
            </div>
          </div>
          <div className="d-flex flex-wrap align-items-center py-3 px-2 mb-2 employeediv w-100">
            <div className="d-flex align-items-center py-1 col-lg-3 col-xl-3 col-md-4 col-6 bio">
              <img
                src={profileImage}
                className="rounded-circle me-2"
                style={{ width: "8vh" }}
                alt="Profile"
              />
              <div>
                <p className="textheading">Thinley Yoezer</p>
                <p className="textsubheading">Asst. ICT Officer</p>
              </div>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Advance Claim</p>
              <p className="textsubheading">Nu.20,000</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Advance Type</p>
              <p className="textsubheading">Salary Advance</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Application Date</p>
              <p className="textsubheading">19/06/2024</p>
            </div>
            <div className="details py-1 col-lg-1 col-xl-1 col-md-4 col-6">
              <p className="textheading">Status</p>
              <p className="textsubheading text-success">Pending</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4  col-6">
              <a
                href="/viewCurrentApplication"
                className="btn btn-outline-primary"
              >
                View Details
              </a>
            </div>
          </div>
          <div className="d-flex flex-wrap align-items-center py-3 px-2 mb-2 employeediv w-100">
            <div className="d-flex align-items-center py-1 col-lg-3 col-xl-3 col-md-4 col-6 bio">
              <img
                src={profileImage}
                className="rounded-circle me-2"
                style={{ width: "8vh" }}
                alt="Profile"
              />
              <div>
                <p className="textheading">Thinley Yoezer</p>
                <p className="textsubheading">Asst. ICT Officer</p>
              </div>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Advance Claim</p>
              <p className="textsubheading">Nu.20,000</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Advance Type</p>
              <p className="textsubheading">Salary Advance</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Application Date</p>
              <p className="textsubheading">19/06/2024</p>
            </div>
            <div className="details py-1 col-lg-1 col-xl-1 col-md-4 col-6">
              <p className="textheading">Status</p>
              <p className="textsubheading text-success">Pending</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4  col-6">
              <a
                href="/viewCurrentApplication"
                className="btn btn-outline-primary"
              >
                View Details
              </a>
            </div>
          </div>
          <div className="d-flex flex-wrap align-items-center py-3 px-2 mb-2 employeediv w-100">
            <div className="d-flex align-items-center py-1 col-lg-3 col-xl-3 col-md-4 col-6 bio">
              <img
                src={profileImage}
                className="rounded-circle me-2"
                style={{ width: "8vh" }}
                alt="Profile"
              />
              <div>
                <p className="textheading">Thinley Yoezer</p>
                <p className="textsubheading">Asst. ICT Officer</p>
              </div>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Advance Claim</p>
              <p className="textsubheading">Nu.20,000</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Advance Type</p>
              <p className="textsubheading">Salary Advance</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Application Date</p>
              <p className="textsubheading">19/06/2024</p>
            </div>
            <div className="details py-1 col-lg-1 col-xl-1 col-md-4 col-6">
              <p className="textheading">Status</p>
              <p className="textsubheading text-success">Pending</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4  col-6">
              <a
                href="/viewCurrentApplication"
                className="btn btn-outline-primary"
              >
                View Details
              </a>
            </div>
          </div>
        </div>

        <div
          className={`tab-pane fade ${
            activeTab === "previousapplication" ? "show active" : ""
          }`}
          id="previousapplication"
          role="tabpanel"
          aria-labelledby="ex1-tab-2"
        >
          <h6 className="custon-h6 py-2">Previous Applications</h6>
          <div className="d-flex flex-wrap align-items-center py-3 px-2 mb-2 employeediv w-100">
            <div className="d-flex align-items-center py-1 col-lg-3 col-xl-3 col-md-4 col-6 bio">
              <img
                src={profileImage}
                className="rounded-circle me-2"
                style={{ width: "8vh" }}
                alt="Profile"
              />
              <div>
                <p className="textheading">Thinley Yoezer</p>
                <p className="textsubheading">Asst. ICT Officer</p>
              </div>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Advance Claim</p>
              <p className="textsubheading">Nu.20,000</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Advance Type</p>
              <p className="textsubheading">Salary Advance</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Application Date</p>
              <p className="textsubheading">19/06/2024</p>
            </div>
            <div className="details py-1 col-lg-1 col-xl-1 col-md-4 col-6">
              <p className="textheading">Status</p>
              <p className="textsubheading text-success">Pending</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4  col-6">
              <a
                href="/viewPreviousApplication"
                className="btn btn-outline-primary"
              >
                View Details
              </a>
            </div>
          </div>
          <div className="d-flex flex-wrap align-items-center py-3 px-2 mb-2 employeediv w-100">
            <div className="d-flex align-items-center py-1 col-lg-3 col-xl-3 col-md-4 col-6 bio">
              <img
                src={profileImage}
                className="rounded-circle me-2"
                style={{ width: "8vh" }}
                alt="Profile"
              />
              <div>
                <p className="textheading">Thinley Yoezer</p>
                <p className="textsubheading">Asst. ICT Officer</p>
              </div>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Advance Claim</p>
              <p className="textsubheading">Nu.20,000</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Advance Type</p>
              <p className="textsubheading">Salary Advance</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Application Date</p>
              <p className="textsubheading">19/06/2024</p>
            </div>
            <div className="details py-1 col-lg-1 col-xl-1 col-md-4 col-6">
              <p className="textheading">Status</p>
              <p className="textsubheading text-success">Pending</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4  col-6">
              <a
                href="/viewPreviousApplication"
                className="btn btn-outline-primary"
              >
                View Details
              </a>
            </div>
          </div>
          <div className="d-flex flex-wrap align-items-center py-3 px-2 mb-2 employeediv w-100">
            <div className="d-flex align-items-center py-1 col-lg-3 col-xl-3 col-md-4 col-6 bio">
              <img
                src={profileImage}
                className="rounded-circle me-2"
                style={{ width: "8vh" }}
                alt="Profile"
              />
              <div>
                <p className="textheading">Thinley Yoezer</p>
                <p className="textsubheading">Asst. ICT Officer</p>
              </div>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Advance Claim</p>
              <p className="textsubheading">Nu.20,000</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Advance Type</p>
              <p className="textsubheading">Salary Advance</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Application Date</p>
              <p className="textsubheading">19/06/2024</p>
            </div>
            <div className="details py-1 col-lg-1 col-xl-1 col-md-4 col-6">
              <p className="textheading">Status</p>
              <p className="textsubheading text-success">Pending</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4  col-6">
              <a
                href="/viewPreviousApplication"
                className="btn btn-outline-primary"
              >
                View Details
              </a>
            </div>
          </div>
          <div className="d-flex flex-wrap align-items-center py-3 px-2 mb-2 employeediv w-100">
            <div className="d-flex align-items-center py-1 col-lg-3 col-xl-3 col-md-4 col-6 bio">
              <img
                src={profileImage}
                className="rounded-circle me-2"
                style={{ width: "8vh" }}
                alt="Profile"
              />
              <div>
                <p className="textheading">Thinley Yoezer</p>
                <p className="textsubheading">Asst. ICT Officer</p>
              </div>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Advance Claim</p>
              <p className="textsubheading">Nu.20,000</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Advance Type</p>
              <p className="textsubheading">Salary Advance</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Application Date</p>
              <p className="textsubheading">19/06/2024</p>
            </div>
            <div className="details py-1 col-lg-1 col-xl-1 col-md-4 col-6">
              <p className="textheading">Status</p>
              <p className="textsubheading text-success">Pending</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4  col-6">
              <a
                href="/viewPreviousApplication"
                className="btn btn-outline-primary"
              >
                View Details
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs content */}
    </div>
  );
};

export default EmployeeDashboard;
