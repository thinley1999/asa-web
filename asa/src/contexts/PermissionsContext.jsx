import React, { createContext, useContext, useState, useEffect } from "react";
import PermissionServices from "../components/services/PermissionServices";

const PermissionsContext = createContext();

export const usePermissions = () => useContext(PermissionsContext);

export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState(null);
  const [permissionsError, setPermissionsError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    try {
      const response = await PermissionServices.get();
      if (response && response.status === 200) {
        setPermissions(response.data);
      } else {
        setPermissionsError("Failed to load permissions");
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
      setPermissionsError("Error fetching the permissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <PermissionsContext.Provider
      value={{ permissions, permissionsError, loading }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};
