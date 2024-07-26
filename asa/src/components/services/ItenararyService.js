import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;
const token = localStorage.getItem("token");

const getItineraries = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/itineraries`, {
        params: {
            id : id
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

export default {
   getItineraries
};
