import React, { useState } from "react";
import profileImage from "../assets/img/Thinley.jpeg";
import { Outlet } from "react-router-dom";
import Notifications from "./general/Notifications";
import SideBar from "./general/SideBar";
import Navbar from "./general/Navbar";
import SideBar2 from "./general/SideBar2";

const Base = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  const updateNotificationCount = (newCount) => {
    setNotificationCount(newCount);
  };

  const toggleShowNotification = () => {
    console.log("hehehe...");
    setShowNotification(!showNotification);
  };

  console.log("showNotification", showNotification);

  const handleSidebarToggle = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarVisible(!isMobileSidebarVisible);
  };

  const handleCloseSidebar = () => {
    setIsMobileSidebarVisible(false);
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      {isSidebarVisible && (
        <div className="d-none d-md-block">
          <SideBar />
        </div>
      )}

      <div className={`flex-grow-1 ${isSidebarVisible ? "content-shift" : ""}`}>
        {/* Navbar */}
        <div className="ms-1" style={{ marginLeft: "10px" }}>
          <Navbar
            handleSidebarToggle={handleSidebarToggle}
            handleMobileSidebarToggle={handleMobileSidebarToggle}
            profileImage={profileImage}
            isSidebarVisible={isSidebarVisible}
            notificationCount={notificationCount}
            showNotification={toggleShowNotification}
          />
        </div>

        <div className="px-2 pt-2 outlet">
          <Outlet />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`mobile-sidebar-overlay d-block d-md-none ${
          isMobileSidebarVisible ? "" : "hidden"
        }`}
        onClick={handleMobileSidebarToggle}
      >
        <SideBar2 handleCloseSidebar={handleCloseSidebar} />
      </div>

      {/* Toast element */}
      {showNotification && (
        <div
        className="toast-container position-fixed top-0 start-50 translate-middle-x p-3"
        style={{ zIndex: 1055 }}
        >
          <Notifications
            profileImage={profileImage}
            handleNotificationCount={updateNotificationCount}
            closeNotification={toggleShowNotification}
          />
        </div>
      )}
    </div>
  );
};

export default Base;
