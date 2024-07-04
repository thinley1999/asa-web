import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

const create = async (id, files) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/api/files`, {
      id: id,
      files: files,
    }, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {const create = async (id, files) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${API_URL}/api/files`, {
        id: id,
        files: files,
      }, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  };
    throw error;
  }
};

const update = async () => {};

export default {
  create,
  update,
};
