import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;
const token = localStorage.getItem("token");

const getItineraries = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/itineraries`, {
      params: {
        id: id,
      },
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateRow = async (params) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/itineraries/${params.id}`,
      {
        travel_itinerary: params,
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

const deleteRow = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/api/itineraries/${id}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const addRow = async (params) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/itineraries`,
      {
        travel_itinerary: params,
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

export default {
  getItineraries,
  updateRow,
  deleteRow,
  addRow,
};
