import React, { useState, useEffect } from "react";
import "chartjs-plugin-datalabels";
import "../../assets/css/main.css";
import { usePermissions } from "../../contexts/PermissionsContext";
import EmployeeApplications from "../employee/EmployeeDashboard";
import FinanceDashboard from "../finance/FinanceDashboard";
import LoadingPage from "./LoadingPage";

const Dashboard = () => {
  const { permissions } = usePermissions();
  const [dashboardPermission, setDashboardPermission] = useState(null);

  useEffect(() => {
    if (permissions) {
      const dashboardPerm = permissions.find(
        (permission) => permission.resource === "dashboard"
      );
      setDashboardPermission(dashboardPerm);
    }
  }, [permissions]);

  console.log("dashboard permission...", dashboardPermission);
  console.log("dashboard permission...", dashboardPermission === null);

  return (
    <div>
      {dashboardPermission === null ? (
        <LoadingPage />
      ) : dashboardPermission?.actions?.view ? (
        <FinanceDashboard />
      ) : (
        <EmployeeApplications />
      )}
    </div>
  );
};

export default Dashboard;
