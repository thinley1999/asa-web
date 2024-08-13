import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

const create = async (id, files) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/api/files`,
      {
        id: id,
        files: files,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

const update = async (id, files) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${API_URL}/api/files/${id}`,
      {
        id: id,
        files: files,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data; // Optionally handle response
  } catch (error) {
    console.error("Error updating files:", error);
    throw error;
  }
};

export default {
  create,
  update,
};
