import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import logoImage from "../../assets/img/rma-logo-white.png";
import AuthServices from "../services/AuthServices";
import { usePermissions } from "../../contexts/PermissionsContext";
import {
  Home,
  DollarSign,
  Car,
  FileText,
  FolderOpen,
  BarChart3,
  Wallet,
  LogOut,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

const SideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { permissions } = usePermissions();
  const [dashboardPermission, setDashboardPermission] = useState(null);
  const [requestedAdvancePermission, setRequestedAdvancePermission] = useState(null);
  const [menuItems, setMenuItems] = useState([
    {
      path: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      label: "Dashboard",
      value: 1,
    },
    {
      path: "/salaryAdvance",
      icon: <DollarSign className="h-5 w-5" />,
      label: "Salary Advance",
      value: 3,
    },
    {
      path: "/otherAdvance",
      icon: <Wallet className="h-5 w-5" />,
      label: "Other Advance",
      value: 4,
    },
    {
      path: "/tourAdvance",
      icon: <Car className="h-5 w-5" />,
      label: "Tour Advance",
      value: 5,
    },
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
        const pathExists = prevItems.some(
          (item) => item.path === "/requestedAdvance"
        );
        if (!pathExists && requestedPerm?.actions?.view) {
          const updatedItems = [
            {
              path: "/myApplications",
              icon: <FolderOpen className="h-5 w-5" />,
              label: "My Applications",
              value: 2,
            },
            ...prevItems,
            {
              path: "/requestedAdvance",
              icon: <FileText className="h-5 w-5" />,
              label: "Requested Advance",
              value: 6,
            },
            {
              path: "/requestedDsa",
              icon: <DollarSign className="h-5 w-5" />,
              label: "Requested DSA",
              value: 7,
            },
            {
              path: "/reports",
              icon: <BarChart3 className="h-5 w-5" />,
              label: "Reports",
              value: 8,
            },
          ];

          return updatedItems.sort((a, b) => a.value - b.value);
        }

        return prevItems.sort((a, b) => a.value - b.value);
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
    <div className="flex h-screen flex-col bg-gradient-to-b from-blue-900 to-blue-800 text-white">
      {/* Logo Section */}
      <div className="p-4">
        <div className="flex flex-col items-center space-y-3">
          <img
            src={logoImage}
            alt="Logo"
            className="h-12 w-auto"
          />
          <div className="text-center">
            <h2 className="text-xl font-bold tracking-tight">RMA ASA</h2>
            <p className="text-xs text-blue-200">Advance System</p>
          </div>
        </div>
      </div>

      <Separator className="bg-blue-700/50" />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-1">
          {menuItems.map(({ path, icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`
                flex items-center space-x-3 rounded-lg px-2 py-2 text-sm font-medium
                transition-all duration-200
                ${
                  currentPath === path
                    ? "bg-blue-700 text-white shadow-sm"
                    : "text-blue-100 hover:bg-blue-700/50 hover:text-white"
                }
              `}
            >
              <div className="flex h-6 w-6 items-center justify-center">
                {icon}
              </div>
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <Separator className="bg-blue-700/50" />

      {/* Logout Button */}
      <div className="p-4">
        <Button
          variant="destructive"
          className="w-full space-x-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
        
        {/* Version Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-blue-300">
            Version 2.0.0
          </p>
          <p className="text-xs text-blue-200/70 mt-1">
            © {new Date().getFullYear()} RMA
          </p>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
