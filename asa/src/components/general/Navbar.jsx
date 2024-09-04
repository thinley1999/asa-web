import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserServices from "../services/UserServices";
import { RxHamburgerMenu } from "react-icons/rx";
import { CiBellOn } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa";

const Navbar = ({
  handleSidebarToggle,
  handleMobileSidebarToggle,
  isSidebarVisible,
  notificationCount,
  showNotification,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [user, setUser] = useState([]);

  useEffect(() => {
    fetchUserDetails();
  }, []);

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
      case "/dsaClaim":
        return "DSA Claim";
      case "/requestedAdvance":
        return "Requested Advance";
      case "/requestedDsa":
        return "Requested DSA";
      case "/reports":
        return "Reports";
      default:
        return "Dashboard";
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await UserServices.showDetail();
      if (response && response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
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
          <button
            className="btn px-1 py-0 btn1"
            onClick={handleMobileSidebarToggle}
          >
            <RxHamburgerMenu className="icon-size" />
          </button>
          <a className="customtag" href="#">
            {getHeading()}
          </a>
        </div>

        <button
          className="p-0 border-0 d-none d-sm-block btn btn2"
          type="button"
          onClick={handleSidebarToggle}
        >
          <RxHamburgerMenu className="icon-size" />
        </button>
        {/* <button className="p-0 border-0 btn-responsive btn" type="button">
          <FaChevronDown className="icon-size" />
        </button> */}

        <div className="d-block d-sm-none">
          <span>
            <button
              type="button"
              className="btn"
              style={{ background: "#90c8ed" }}
              id="showToastBtn"
              onClick={showNotification}
            >
              <CiBellOn color="blue" size={24} />
            </button>
            <span className="badge">{notificationCount}</span>
          </span>
          <a className="profilelink text-decoration-none" href="/profile">
            <img
              src={user?.profile_pic?.url}
              className="rounded-circle profile-img me-2"
              alt="Profile"
            />
          </a>
        </div>

        <div className="collapse navbar-collapse justify-content-start">
          <div className="navbar-nav mb-2 mb-lg-0">
            <a className="customtag" href="#">
              {getHeading()}
            </a>
          </div>
        </div>

        <div className="collapse navbar-collapse justify-content-end me-5">
          <span>
            <button
              type="button"
              className="btn"
              style={{ background: "#90c8ed" }}
              id="showToastBtn"
              onClick={showNotification}
            >
              <CiBellOn color="blue" size={24} />
            </button>
            <span className="badge">{notificationCount}</span>
          </span>
          <a className="profilelink text-decoration-none" href="/profile">
            <img
              src={user?.profile_pic?.url}
              className="rounded-circle profile-img me-2"
              alt="Profile"
            />
          </a>
          <div>
            <a className="profilelink text-decoration-none" href="/profile">
              <p className="username">
                {user.first_name} {user.middle_name} {user.last_name}
              </p>
              <p className="userrole">{user.position_title}</p>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
