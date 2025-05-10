import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/sign_in`, {
      user: {
        login: username,
        password: password,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

const logout = async () => {
  try {
    const response = await axios.delete(`${API_URL}/users/sign_out`);
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("isLoggedIn");
    localStorage.setItem("isLoggedOut", "true");

    setTimeout(() => {
      localStorage.removeItem("isLoggedOut");
    }, 3000);

    return response;
  } catch (error) {
    throw error;
  }
};

const forgotPassword = async (employeeId) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/reset_password`, {
      username: employeeId,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  login,
  logout,
  forgotPassword,
};
