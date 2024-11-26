import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

const create = async (id, files = [], file_type) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/api/files`,
      {
        id: id,
        files: files,
        file_type: file_type,
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

const update = async (id, files, file_type) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${API_URL}/api/files/${id}`,
      {
        id: id,
        files: files,
        file_type: file_type,
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

const deleteFile = async (id, file_id, file_type) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `${API_URL}/api/files/${id}`, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          id: id,
          file_id: file_id,
          file_type: file_type,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error Deleting files:", error);
    throw error;
  }
};

export default {
  create,
  update,
  deleteFile,
};
