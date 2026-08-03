// src/services/FundingAgencyServices.js
import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;

const getFundingAgencies = async (search = "") => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/api/funding_agencies`, {
      params: {
        search: search
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

const getActiveFundingAgencies = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/api/funding_agencies`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createFundingAgency = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${API_URL}/api/funding_agencies`,
      { funding_agency: data },
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
  getFundingAgencies,
  getActiveFundingAgencies,
  createFundingAgency,
};