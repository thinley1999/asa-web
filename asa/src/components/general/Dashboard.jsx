import React, { useState, useEffect } from "react";
import "chartjs-plugin-datalabels";
import "../../assets/css/main.css";
import { usePermissions } from "../../contexts/PermissionsContext";
import EmployeeApplications from "../employee/EmployeeDashboard";
import FinanceDashboard from "../finance/FinanceDashboard";
import LoadingPage from "./LoadingPage";
import UserServices from "../services/UserServices";
import { CgDanger } from "react-icons/cg";

const Dashboard = () => {
  const { permissions } = usePermissions();
  const [dashboardPermission, setDashboardPermission] = useState(null);
  const [user, setUser] = useState([]);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (permissions) {
      const dashboardPerm = permissions.find(
        (permission) => permission.resource === "dashboard"
      );
      setDashboardPermission(dashboardPerm);
    }
  }, [permissions]);

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

  return (
    <div>
      {user?.reset_password && (
        <div className="container-fluid p-1 mt-2">
          <div
            className="card text-white w-100 p-0 m-0"
            style={{ backgroundColor: "#dc3545", border: "none" }}
          >
            <div className="card-body">
              <p className="card-text" style={{ fontSize: "14px" }}>
              <CgDanger size ={24}/> { ' '}
                Please reset your password for security purposes and choose a
                strong password. To reset your password, click on your profile
                in the top-right corner of the navigation bar.
              </p>
            </div>
          </div>
        </div>
      )}

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
