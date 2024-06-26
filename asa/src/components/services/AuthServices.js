import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

const login = async (username, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/sign_in`,
      {
        user: {
          login: username,
          password: password,
        },
      },
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const logout = async () => {
    try {
        const response = await axios.delete(`${API_URL}/users/sign_out`);
        localStorage.removeItem("token");
        return response;
      } catch (error) {
        throw error;
      }
  };

export default {
  login,
  logout
};
