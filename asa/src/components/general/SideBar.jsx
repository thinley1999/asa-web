import React from "react";
import { useLocation, Link } from "react-router-dom";
import logoImage from "../../assets/img/rma-logo-white.png";
import AuthServices from "../services/AuthServices";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { usePermissions } from "../../contexts/PermissionsContext";

const SideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const isActive = (path) => (currentPath === path ? "active" : "");
  const {permissions, permissionsError} = usePermissions();
  const [dashboardPermission, setDashboardPermission] = useState([]);
  const [requestedAdvancePermission, setRequestedAdvancePermission] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const getMenuItems = () => {
    const items = [
      { path: dashboardPermission?.actions?.view ? "/financeDashboard" : "/dashboard", icon: "bi-house-door-fill", label: "Dashboard" },
      { path: "/salaryAdvance", icon: "bi-cash-stack", label: "Salary Advance" },
      { path: "/otherAdvance", icon: "bi-briefcase-fill", label: "Other Advance" },
      { path: "/tourAdvance", icon: "bi-car-front-fill", label: "Tour Advance" },
    ];

    if (requestedAdvancePermission?.actions?.view) {
      items.push({ path: "/requestedAdvance", icon: "bi-cassette-fill", label: "Requested Advance" });
    }

    return items;
  };

  useEffect(() => {
    if (permissions) {
      const dashboardPerm= permissions.find(
        (permission) => permission.resource === "dashboard"
      );

      const requestedPerm= permissions.find(
        (permission) => permission.resource === "requested_advance"
      );
      setDashboardPermission(dashboardPerm);
      setRequestedAdvancePermission(requestedPerm);
    }
    setMenuItems(getMenuItems());
  }, [permissions]);

  console.log('dashboardPermission', dashboardPermission);
  console.log('requestedAdvancePermission', requestedAdvancePermission);

  const handleLogout = async () => {
    try {
      await AuthServices.logout();
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="sidebar fixed-sidebar d-none d-md-block">
      <div className="header-box px-2 pt-3 pb-4 d-flex justify-content-between">
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

export default SideBar;
