import React, { createContext, useContext, useState, useEffect } from 'react';
import PermissionServices from '../components/services/PermissionServices';

const PermissionsContext = createContext();

export const usePermissions = () => useContext(PermissionsContext);

export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState(null);
  const [permissionsError, setPermissionsError] = useState(null);

  const fetchPermissions = async () => {
    try {
      const response = await PermissionServices.get();
      setPermissions(response.data);
      console.log('permissions response', response);
    } catch (error) {
      setError("Error fetching the permissions");
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return (
    <PermissionsContext.Provider value={{ permissions, permissionsError }}>
      {children}
    </PermissionsContext.Provider>
  );
};
