import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Base from "./components/Base";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import Profile from "./components/employee/Profile";
import TourAdvance from "./components/employee/TourAdvance";
import SalaryAdvance from "./components/employee/SalaryAdvance";
import OtherAdvance from "./components/employee/OtherAdvance";
import ViewPreviousApplication from "./components/employee/ViewPreviousApplication";
import ViewCurrentApplication from "./components/employee/ViewCurrentApplication";
import Dashboard from "./components/general/Dashboard";
import FinanceDashboard from "./components/finance/FinanceDashboard";
import RequestedAdvance from "./components/finance/RequestedAdvance";
import ViewRequestedAdvance from "./components/finance/ViewRequestedAdvance";
import AdvanceDetail from "./components/general/AdvanceDetail";
import DsaClaim from "./components/employee/DsaClaim";
import PageNotFound from "./components/general/PageNotFound";
import PrivateRoute from "./components/general/PrivateRoute";
import Reports from "./components/finance/Reports";
import RequestedDsa from "./components/finance/RequestedDsa";
import SalaryAdvanceForm from "./components/forms/SalaryAdvanceForm";
import EditRequestedAdvance from "./components/finance/EditRequestedAdvance";
import IndividualReport from "./components/forms/IndividualReport";

const routes = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/",
    element: <Base />,
    children: [
      {
        path: "dashboard",
        element: <PrivateRoute />,
        children: [{ path: "", element: <Dashboard /> }],
      },
      {
        path: "profile",
        element: <PrivateRoute />,
        children: [{ path: "", element: <Profile /> }],
      },
      {
        path: "salaryAdvance",
        element: <PrivateRoute />,
        children: [{ path: "", element: <SalaryAdvance /> }],
      },
      {
        path: "otherAdvance",
        element: <PrivateRoute />,
        children: [{ path: "", element: <OtherAdvance /> }],
      },
      {
        path: "tourAdvance",
        element: <PrivateRoute />,
        children: [{ path: "", element: <TourAdvance /> }],
      },
      {
        path: "/advanceDetail/:id",
        element: <PrivateRoute />,
        children: [{ path: "", element: <AdvanceDetail /> }],
      },
      {
        path: "/myApplications",
        element: <PrivateRoute />,
        children: [{ path: "", element: <EmployeeDashboard /> }],
      },
      {
        path: "viewPerviousApplication",
        element: <PrivateRoute />,
        children: [{ path: "", element: <ViewPreviousApplication /> }],
      },
      {
        path: "viewApplication/:id",
        element: <PrivateRoute />,
        children: [{ path: "", element: <ViewCurrentApplication /> }],
      },
      {
        path: "financeDashboard",
        element: <PrivateRoute />,
        children: [{ path: "", element: <FinanceDashboard /> }],
      },
      {
        path: "requestedAdvance",
        element: <PrivateRoute />,
        children: [{ path: "", element: <RequestedAdvance /> }],
      },
      {
        path: "viewRequestedAdvance/:id",
        element: <PrivateRoute />,
        children: [{ path: "", element: <ViewRequestedAdvance /> }],
      },
      {
        path: "editRequestedAdvance/:id",
        element: <PrivateRoute />,
        children: [{ path: "", element: <EditRequestedAdvance /> }],
      },
      {
        path: "requestedDsa",
        element: <PrivateRoute />,
        children: [{ path: "", element: <RequestedDsa /> }],
      },
      {
        path: "dsaClaim/:id",
        element: <PrivateRoute />,
        children: [{ path: "", element: <DsaClaim /> }],
      },
      {
        path: "reports",
        element: <PrivateRoute />,
        children: [{ path: "", element: <Reports /> }],
      },
    ],
  },
  { path: "salaryAdvanceForm", element: <SalaryAdvanceForm /> },
  { path: "individualReport/:id", element: <IndividualReport /> },

  { path: "*", element: <PageNotFound /> },
]);

export default routes;
