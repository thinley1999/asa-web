import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import logoImage from "../../assets/img/rma-logo-white.png";
import AuthServices from "../services/AuthServices";
import { usePermissions } from "../../contexts/PermissionsContext";
import { FaHome } from "react-icons/fa";
import { BsCash } from "react-icons/bs";
import { IoBag } from "react-icons/io5";
import { FaCar } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa";

const SideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const isActive = (path) => (currentPath === path ? "active" : "");
  const { permissions } = usePermissions();
  const [dashboardPermission, setDashboardPermission] = useState(null);
  const [requestedAdvancePermission, setRequestedAdvancePermission] =
    useState(null);
  const [menuItems, setMenuItems] = useState([
    { path: "/dashboard", icon: <FaHome size={24} />, label: "Dashboard" },
    {
      path: "/salaryAdvance",
      icon: <BsCash size={24} />,
      label: "Salary Advance",
    },
    {
      path: "/otherAdvance",
      icon: <IoBag size={24} />,
      label: "Other Advance",
    },
    { path: "/tourAdvance", icon: <FaCar size={24} />, label: "Tour Advance" },
  ]);

  useEffect(() => {
    if (permissions) {
      const dashboardPerm = permissions.find(
        (permission) => permission.resource === "dashboard"
      );
      const requestedPerm = permissions.find(
        (permission) => permission.resource === "requested_advance"
      );

      setDashboardPermission(dashboardPerm);
      setRequestedAdvancePermission(requestedPerm);

      setMenuItems((prevItems) => {
        // Check if the path already exists in the menuItems array
        const pathExists = prevItems.some(
          (item) => item.path === "/requestedAdvance"
        );
        if (!pathExists && requestedPerm?.actions?.view) {
          return [
            ...prevItems,
            {
              path: "/requestedAdvance",
              icon: <FaRegCreditCard size={24} />,
              label: "Requested Advance",
            },
          ];
        }
        return prevItems;
      });
    }
  }, [permissions]);

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
              {icon}
              <span className="icontext">{label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="signoutbtn" onClick={handleLogout}>
        <button type="button" className="btn btn-danger">
          <FaSignOutAlt size={18} /> <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
