import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

const get = async () => {
  const token = localStorage.getItem("token");
  const id = localStorage.getItem("id");
  try {
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

const show = async () => {};

const create = async () => {};

const update = async () => {};

export default {
  get,
  show,
  create,
  update,
};
