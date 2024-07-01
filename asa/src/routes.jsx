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

const routes = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/",
    element: <Base />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "profile", element: <Profile /> },
      { path: "salaryAdvance", element: <SalaryAdvance /> },
      { path: "otherAdvance", element: <OtherAdvance /> },
      { path: "tourAdvance", element: <TourAdvance /> },
      { path: "/advanceDetail/:id", element: <AdvanceDetail /> },

      { path: "viewPerviousApplication", element: <ViewPreviousApplication /> },
      { path: "viewApplication/:id", element: <ViewCurrentApplication /> },
      { path: "financeDashboard", element: <FinanceDashboard /> },
      { path: "requestedAdvance", element: <RequestedAdvance /> },
      { path: "viewRequestedAdvance/:id", element: <ViewRequestedAdvance /> },
    ],
  },
]);

export default routes;
