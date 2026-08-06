import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

const getUsers = async (params) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/api/users`, {
      params: {
        query: params.search_query,
        role_id: params.role_id,
        department: params.department,
        page: params.page,
        per_page: params.per_page,
      },
      headers: {
        Authorization: `${token}`,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

const getUser = async (id) => {
  const token = localStorage.getItem("token");
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

const createUser = async (userData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${API_URL}/api/users`,
      {
        user: userData,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (id, userData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      `${API_URL}/api/users/${id}`,
      {
        user: userData,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

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

const changePassword = async ({token, password, passwordConfirmation}) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/users/change_password`,
      {
        token: token,
        password: password,
        password_confirmation: passwordConfirmation
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

const getRoles = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/api/roles`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export default {
  getUsers,
  getUser,
  getUserPermission,
  showDetail,
  createUser,
  updateUser,
  resetpassword,
  changePassword,
  acceptTerms,
  getRoles
};
