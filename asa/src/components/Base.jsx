import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "./ui/toaster";
import { useToast } from "@/hooks/use-toast";
import Notifications from "./general/Notifications";
import SideBar from "./general/SideBar";
import Navbar from "./general/Navbar";
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
  const { toast } = useToast();

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
      toast({
        title: "Error",
        description: "Failed to load user details",
        variant: "destructive",
      });
    }
  };

  const acceptTermsAndConditions = async () => {
    try {
      const response = await UserServices.acceptTerms(user.id);
      if (response && response.status === 200) {
        setShowUserUndertaking(false);
        toast({
          title: "Success",
          description: "Terms and conditions accepted",
        });
      }
    } catch (error) {
      console.error("Error accepting terms:", error);
      toast({
        title: "Error",
        description: "Failed to accept terms",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <SideBar />
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col transition-all duration-300 ${
          isSidebarVisible ? "lg:ml-64" : "lg:ml-0"
        }`}
      >
        {/* Navbar */}
        <Navbar
          handleSidebarToggle={handleSidebarToggle}
          handleMobileSidebarToggle={handleMobileSidebarToggle}
          isSidebarVisible={isSidebarVisible}
          notificationCount={notificationCount}
          showNotification={toggleShowNotification}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6">
          <div>
            <Outlet />
          </div>
        </main>
      </div>

      {/* User Undertaking Modal */}
      {showUserUndertaking && user?.accepted_terms === false && (
        <UserUndertaking user={user} onClose={acceptTermsAndConditions} />
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarVisible && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseSidebar}
          />
          <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">
            <SideBar />
          </div>
        </div>
      )}

      {/* Notifications */}
      {showNotification && (
        <div className="fixed top-16 right-4 z-50">
          <Notifications
            handleNotificationCount={updateNotificationCount}
            closeNotification={toggleShowNotification}
            showNotification={showNotification}
          />
        </div>
      )}

      {/* Toast Container */}
      <Toaster />
    </div>
  );
};

export default Base;