import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Base from "./components/Base";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import Profile from "./components/employee/Profile";
import TourAdvance from "./components/employee/TourAdvance";
import SalaryAdvance from "./components/employee/SalaryAdvance";
import OtherAdvance from "./components/employee/OtherAdvance";

const routes = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/",
    element: <Base />,
    children: [
      { path: "dashboard", element: <EmployeeDashboard /> },
      { path: "profile", element: <Profile /> },
      { path: "salaryAdvance", element: <SalaryAdvance /> },
      { path: "otherAdvance", element: <OtherAdvance /> },
      { path: "tourAdvance", element: <TourAdvance /> },
    ],
  },
]);

export default routes;
