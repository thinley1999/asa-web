import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;
const token = localStorage.getItem("token");

const getRate = async (from, to) => {
    try {
      const response = await axios.get(`${API_URL}/api/rates`, {
        params: {
            rate: {
                from: from,
                to: to
            }
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

const getCountryFrom = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/rates/get_country_from`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

const getCountryTo = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/rates/get_country_to`, {
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
  getRate,
  getCountryFrom,
  getCountryTo,
};
