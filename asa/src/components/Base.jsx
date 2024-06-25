import React, { useEffect, useRef, useState } from "react";
import profileImage from "../assets/img/Thinley.jpeg";
import { Outlet } from "react-router-dom";
import { Toast } from "bootstrap";
import Notifications from "./general/Notifications";
import SideBar from "./general/SideBar";
import Navbar from "./general/Navbar";

const Base = () => {
  const toastRef = useRef(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

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

    // Cleanup event listener on component unmount
    return () => {
      if (btn) {
        btn.removeEventListener("click", showToast);
      }
    };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="main-container d-flex">
      {/* side bar */}
      { isSidebarVisible && <SideBar/> }

      <div className="content">
        {/* nav bar */}
        <Navbar handleSidebarToggle={handleSidebarToggle} profileImage={profileImage}/>

        <div className="px-1 pt-2 outlet">
          <Outlet />
        </div>
      </div>

      {/* Toast element */}
      <div
        className="toast-container position-fixed top-0 start-50 translate-middle-x p-3"
        style={{ zIndex: 1055 }}
      >
        <Notifications toastRef={toastRef} profileImage={profileImage}/>
      </div>
    </div>
  );
};

export default Base;
