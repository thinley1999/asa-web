import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Notifications from "./general/Notifications";
import SideBar from "./general/SideBar";
import Navbar from "./general/Navbar";
import useZoomLevels from "./general/useZoomLevel";
import UserUndertaking from "./general/UserUndertaking";
import UserServices from "./services/UserServices";
import { PermissionsProvider } from "../contexts/PermissionsContext";
import { Skeleton } from "./ui/skeleton";

const Base = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobileSidebarVisible, setIsMobileSidebarVisible] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showUserUndertaking, setShowUserUndertaking] = useState(true);
  const [user, setUser] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(true);

  const zoomLevel = useZoomLevels();

  useEffect(() => {
    fetchUserDetails();
    fetchPermissions();
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

  const fetchPermissions = async () => {
    try {
      setPermissionsLoading(true);
      const response = await UserServices.getPermissions();
      if (response && response.status === 200) {
        setPermissions(response.data);
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
    } finally {
      setPermissionsLoading(false);
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

  // Show loader while permissions are loading
  if (permissionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navbar skeleton */}
        <div className="bg-white border-b">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-40" />
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page header skeleton */}
            <div className="mb-8">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>

            {/* Content grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-white rounded-lg border p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PermissionsProvider value={{ permissions, permissionsLoading }}>
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
          <main className="flex-1 p-2 md:p-4">
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

      </div>
    </PermissionsProvider>
  );
};

export default Base;
