import React from "react";
import { useLocation, Link } from "react-router-dom";
import logoImage from "../../assets/img/rma-logo-white.png";
import AuthServices from "../services/AuthServices";
import { useNavigate } from "react-router-dom";

const SideBar2 = ({ handleCloseSidebar }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const isActive = (path) => (currentPath === path ? "active" : "");

  const menuItems = [
    { path: "/dashboard", icon: "bi-house-door-fill", label: "Dashboard" },
    { path: "/salaryAdvance", icon: "bi-cash-stack", label: "Salary Advance" },
    {
      path: "/otherAdvance",
      icon: "bi-briefcase-fill",
      label: "Other Advance",
    },
    { path: "/tourAdvance", icon: "bi-car-front-fill", label: "Tour Advance" },
    {
      path: "/requestedAdvance",
      icon: "bi-cassette-fill",
      label: "Requested Advance",
    },
  ];

  const handleLogout = async () => {
    try {
      await AuthServices.logout();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleButtonClick = () => {
    console.log("btn3 clicked");
    handleCloseSidebar();
  };

  return (
    <div
      className="sidebar fixed-sidebar d-block d-md-none"
      style={{ boxShadow: "2px 2px 5px 2px rgba(0, 0, 0, 0.5)" }}
    >
      <div
        className="header-box px-2 pt-3 pb-4 d-flex justify-content-between"
        style={{ position: "relative" }}
      >
        <span>
          <button
            className="btn px-1 py-0 btn3"
            onClick={handleButtonClick}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
            }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </span>
        <div className="spancontainer">
          <span>
            <img
              src={logoImage}
              alt="Logo"
              className="img-fluid d-block mx-auto"
              style={{ width: "13vh" }}
            />
          </span>
          <span>
            <p className="customheading2">RMA ASA</p>
          </span>
        </div>
      </div>

      <ul className="list-unstyled px-2">
        {menuItems.map(({ path, icon, label }) => (
          <li key={path} className={isActive(path)}>
            <Link to={path} className="text-decoration-none px-3 py-2 d-block">
              <i className={`bi ${icon} customicon`}></i>
              <span className="icontext">{label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="signoutbtn" onClick={handleLogout}>
        <button type="button" className="btn btn-danger">
          <i className="bi bi-box-arrow-right"></i> <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar2;
