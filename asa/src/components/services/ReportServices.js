import axios from "axios";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL;
const all_advance = [
  "ex_country_tour_advance",
  "in_country_tour_advance",
  "other_advance",
  "salary_advance",
];

const get = async (params) => {
  const token = localStorage.getItem("token");
  const report_type = params.report_type === "All" ? "all" : "individual";
  const advance_type =
    params.advance_type === "All"
      ? "all"
      : params.advance_type.toLowerCase().replace(/ /g, "_");
  const department = params.department === "All" ? "all" : params.department;
  try {
    const response = await axios.get(`${API_URL}/api/reports`, {
      params: {
        report_filters: {
          report_type: report_type,
          start_date: params.start_date,
          end_date: params.end_date,
          advance_type: advance_type,
          department: department,
          employee_id: params.employee_id,
        },
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

const show = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/api/reports/${id}`, {
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
  get,
  show,
};
