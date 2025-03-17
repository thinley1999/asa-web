import React, { useState, useEffect } from "react";
import profileImage from "../assets/img/Thinley.jpeg";
import { Outlet } from "react-router-dom";
import Notifications from "./general/Notifications";
import SideBar from "./general/SideBar";
import Navbar from "./general/Navbar";
import SideBar2 from "./general/SideBar2";
import useZoomLevels from "./general/useZoomLevel";
import UserUndertaking from "./general/UserUndertaking";
import UserServices from "./services/UserServices";

const Base = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showUserUndertaking, setShowUserUndertaking] = useState(true);
  const [user, setUser] = useState([]);

  const zoomLevel = useZoomLevels();

  useEffect(() => {
      fetchUserDetails();
    }, []);

  const updateNotificationCount = (newCount) => {
    setNotificationCount(newCount);
  };

  const toggleShowNotification = () => {
    setShowNotification(!showNotification);
  };

  const handleSidebarToggle = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarVisible(!isMobileSidebarVisible);
  };

  const handleCloseSidebar = () => {
    setIsMobileSidebarVisible(false);
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

  const acceptTermsAndConditions = async () => {
    try {
      const response = await UserServices.acceptTerms(user.id);
      if (response && response.status === 200) {
        setShowUserUndertaking(false);
      }
    } catch (error) {
      console.error("Error accepting terms:", error);
    }
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
            isSidebarVisible={isSidebarVisible}
            notificationCount={notificationCount}
            showNotification={toggleShowNotification}
          />
        </div>

        <div className={`px-2 pt-2 outlet ${zoomLevel}`}>
          <Outlet />
        </div>
       {
        (showUserUndertaking && user?.accepted_terms === false) && (
          <UserUndertaking user={user} onClose={acceptTermsAndConditions}/>
        )
       }
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
      <div
        className="toast-container position-fixed top-0 start-50 translate-middle-x p-3"
        style={{ zIndex: 1055 }}
      >
        <Notifications
          profileImage={profileImage}
          handleNotificationCount={updateNotificationCount}
          closeNotification={toggleShowNotification}
          showNotification={showNotification}
        />
      </div>
    </div>
  );
};

export default Base;
