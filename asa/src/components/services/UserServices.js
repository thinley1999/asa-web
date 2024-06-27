import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

const get = async () => {};

const showDetail = async () => {
  try {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

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
  get,
  showDetail,
  create,
  update,
};
