import React from "react";
import { useLocation } from "react-router-dom";

const Navbar = ({ handleSidebarToggle, profileImage, isSidebarVisible }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const getHeading = () => {
    switch (currentPath) {
      case "/dashboard":
        return "Dashboard";
      case "/salaryAdvance":
        return "Salary Advance";
      case "/otherAdvance":
        return "Other Advance";
      case "/tourAdvance":
        return "Tour Advance";
      case "/requestedAdvance":
        return "Requested Advance";
      default:
        return "Dashboard";
    }
  };

  return (
    <nav
      className={`navbar navbar-expand-md fixed-top bg-white ${
        isSidebarVisible ? "navbar-shift" : ""
      }`}
    >
      <div className="container-fluid">
        <div className="d-flex justify-content-between d-md-none d-block">
          <button className="btn px-1 py-0 btn1" onClick={handleSidebarToggle}>
            <i className="bi bi-card-list"></i>
          </button>
          <a className="customtag" href="#">
            {getHeading()}
          </a>
        </div>

        <button
          className="p-0 border-0 d-none d-sm-block btn2"
          type="button"
          onClick={handleSidebarToggle}
        >
          <i className="bi bi-card-list"></i>
        </button>
        <button className="p-0 border-0 btn-responsive" type="button">
          <i className="bi bi-caret-down-fill"></i>
        </button>

        <div className="collapse navbar-collapse justify-content-start">
          <div className="navbar-nav mb-2 mb-lg-0">
            <a className="customtag" href="#">
              {getHeading()}
            </a>
          </div>
        </div>

        <div className="collapse navbar-collapse justify-content-end me-5">
          <span>
            <button type="button" className="btn btn-info" id="showToastBtn">
              <i className="bi bi-bell"></i>
            </button>
            <span className="badge">5</span>
          </span>

          <img
            src={profileImage}
            className="rounded-circle me-2"
            style={{ width: "8vh" }}
            alt="Profile"
          />
          <div>
            <a className="profilelink text-decoration-none" href="/profile">
              <p className="username">Thinley Yoezer</p>
              <p className="userrole">User</p>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
