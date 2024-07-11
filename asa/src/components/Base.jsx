import React, { useEffect, useRef, useState } from "react";
import profileImage from "../assets/img/Thinley.jpeg";
import { Outlet } from "react-router-dom";
import { Toast } from "bootstrap";
import Notifications from "./general/Notifications";
import SideBar from "./general/SideBar";
import Navbar from "./general/Navbar";
import SideBar2 from "./general/SideBar2";

const Base = () => {
  const toastRef = useRef(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); 

  const updateNotificationCount = (newCount) => {
    setNotificationCount(newCount);
  };

  useEffect(() => {
    const toastEl = toastRef.current;
    const toast = new Toast(toastEl);
    const showToast = () => {
      toast.show();
    };

    const btn = document.getElementById("showToastBtn");
    if (btn) {
      btn.addEventListener("click", showToast);
    }

    return () => {
      if (btn) {
        btn.removeEventListener("click", showToast);
      }
    };
  }, []);

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
      <div
        className="toast-container position-fixed top-0 start-50 translate-middle-x p-3"
        style={{ zIndex: 1055 }}
      >
        <Notifications toastRef={toastRef} profileImage={profileImage} handleNotificationCount={updateNotificationCount}/>
      </div>
    </div>
  );
};

export default Base;
