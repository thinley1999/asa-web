import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

const getUserPermission = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/api/permissions`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

const showDetail = async () => {
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  try {
    const response = await axios.get(`${API_URL}/api/users/${id}`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

const create = async () => {};

const update = async () => {};

export default {
  getUserPermission,
  showDetail,
  create,
  update,
};
