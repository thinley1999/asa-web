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

const showDetail = async (id) => {
  const token = localStorage.getItem("token");
  const user_id = id ? id : localStorage.getItem("id");
  try {
    const response = await axios.get(`${API_URL}/api/users/${user_id}`, {
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

const resetpassword = async (params) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${API_URL}/api/users/reset_password`,
      {
        current_password: params.current_password,
        new_password: params.new_password,
        new_password_confirmation: params.new_password_confirmation,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

const acceptTerms = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${API_URL}/api/users/accept_terms`,
      {
        id: id
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  getUserPermission,
  showDetail,
  create,
  update,
  resetpassword,
  acceptTerms
};
