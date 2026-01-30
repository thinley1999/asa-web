import React, { useState, useEffect } from "react";
import { usePermissions } from "../../contexts/PermissionsContext";
import EmployeeApplications from "../employee/EmployeeDashboard";
import FinanceDashboard from "../finance/FinanceDashboard";
import LoadingPage from "./LoadingPage";
import UserServices from "../services/UserServices";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const Dashboard = () => {
  const { permissions, permissionsLoading } = usePermissions();
  const [dashboardPermission, setDashboardPermission] = useState(null);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserDetails();
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (permissions && permissions.length > 0) {
      const dashboardPerm = permissions.find(
        (permission) => permission.resource === "dashboard"
      );
      setDashboardPermission(dashboardPerm || {});
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
      throw error;
    }
  };

  if (loading || permissionsLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="space-y-6">
      {/* Password Reset Alert */}
      {user?.reset_password && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Security Alert</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p className="font-medium">
              Please reset your password for security purposes.
            </p>
            <p className="text-sm">
              Choose a strong password to protect your account. To reset your
              password, click on your profile in the top-right corner of the
              navigation bar and select "Change Password".
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Dashboard Content */}
      {dashboardPermission?.actions?.view ? (
        <FinanceDashboard />
      ) : (
        <EmployeeApplications />
      )}
    </div>
  );
};

export default Dashboard;
