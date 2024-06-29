import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "bootstrap-icons/font/bootstrap-icons.css";
import { PermissionsProvider } from "./contexts/PermissionsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PermissionsProvider>
      <App />
    </PermissionsProvider>
  </React.StrictMode>
);
