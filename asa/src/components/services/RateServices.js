import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;
const token = localStorage.getItem("token");

const getRate = async (from, to, username) => {
    try {
      const response = await axios.get(`${API_URL}/api/rates`, {
        params: {
            rate: {
                from: from,
                to: to,
                username: username
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

  const getThirdCountryRate = async (country) => {
    try {
      const response = await axios.get(`${API_URL}/api/rates/third_country`, {
        params: {
            rate: {
                country: country
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

  const getStopOverRate = async (value, country) => {
    country = country === "India" ? "India" : "Other";

    if (value > 2) {
      return { rate: 0 };
    }
  
    try {
      const response = await axios.get(`${API_URL}/api/stop_over`, {
        params: {
          stop_over_rate: {
            value: value,
            country: country,
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
  getThirdCountryRate,
  getStopOverRate
};
