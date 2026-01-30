import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import UserServices from "../services/UserServices";
import {
  Menu,
  Bell,
  ChevronDown,
  Search,
  User,
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

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
    const headings = {
      "/dashboard": "Dashboard",
      "/salaryAdvance": "Salary Advance",
      "/otherAdvance": "Other Advance",
      "/tourAdvance": "Tour Advance",
      "/dsaClaim": "DSA Claim",
      "/requestedAdvance": "Requested Advance",
      "/requestedDsa": "Requested DSA",
      "/reports": "Reports",
      "/myApplications": "My Applications",
    };
    return headings[currentPath] || "Dashboard";
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

  const getInitials = () => {
    if (!user.first_name && !user.last_name) return "U";
    return `${user.first_name?.charAt(0) || ""}${user.last_name?.charAt(0) || ""}`;
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={handleMobileSidebarToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            // onClick={handleSidebarToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Page Title */}
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold text-gray-900">
              {getHeading()}
            </h1>
            <p className="text-sm text-gray-500">
              Manage your advance requests and applications
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex items-center space-x-2">
            
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge
                    className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full p-0"
                    variant="destructive"
                  >
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-60 overflow-y-auto p-2">
                <div className="text-center py-4 text-gray-500">
                  No new notifications
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={showNotification}>
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6" />

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profile_pic?.url} alt={getInitials()} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {user.first_name} {user.last_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user.position_title}
                  </span>
                </div>
                <ChevronDown className="hidden md:block h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs leading-none text-gray-500">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;