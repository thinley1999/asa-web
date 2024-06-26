import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;
const all_advance = [
  "ex_country_tour_advance",
  "in_country_tour_advance",
  "other_advance",
  "salary_advance",
];
const all_status = [
  "pending",
  "rejected",
  "verified",
  "confirmed",
  "dispatched",
  "closed",
];

const get = async (params) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/api/advances`, {
      params: {
        "advance[status][]": params.status,
        "advance[advance_type][]": params.advance_type,
        type: params.type,
      },
      headers: {
        Authorization: `${token}`,
      },
    });

    return response; 
  } catch (error) {
    throw error;
  }
};

const showDetail = async () => {};

const create = async () => {};

const update = async () => {};

export default {
  get,
  showDetail,
  create,
  update,
};
