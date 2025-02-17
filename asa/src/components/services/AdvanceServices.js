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
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/api/advances`, {
      params: {
        "advance[status][]": params.status,
        "advance[advance_type][]": params.advance_type,
        "advance[type]": params.type,
        "advance[query]": params.search_query,
        page: params.page,
        per_page: params.per_page,
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

const showDetail = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/api/advances/${id}`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

const create = async (params, travel_itinerary = []) => {
  try {
    const token = localStorage.getItem("token");

    const filteredTravelItinerary = travel_itinerary.map(
      ({ id, ...rest }) => rest
    );

    const response = await axios.post(
      `${API_URL}/api/advances`,
      {
        advance: {
          advance_type: params.advance_type,
          status: "pending",
          advance_amount: params.advanceAmount,
          amount: parseFloat(params.totalAmount),
          purpose: params.purpose,
          remark: params.remark || params.other_advance_type,
          advance_percentage: parseFloat(params.advance_percentage),
          office_order: params.office_order,
          tour_type: params.tour_type,
          additional_expense: params.additional_expense,
        },
        salary_advance: {
          duration: params.duration,
          deduction: params.deduction,
          status: "pending",
          completion_month: params.completion_month,
        },
        travel_itinerary: filteredTravelItinerary,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const update = async (id, params, travel_itinerary = []) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${API_URL}/api/advances/${id}`,
      {
        advance: {
          id: id,
          status: "pending",
          advance_amount: params.advanceAmount,
          amount: parseFloat(params.totalAmount),
          purpose: params.purpose,
          remark: params.remark || params.other_advance_type,
          advance_percentage: parseFloat(params.advance_percentage),
          office_order: params.office_order,
          tour_type: params.tour_type,
          additional_expense: params.additional_expense,
        },
        salary_advance: {
          duration: params.duration,
          deduction: params.deduction,
          status: "pending",
          completion_month: params.completion_month,
        },
        travel_itinerary: travel_itinerary,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const statusCount = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/api/advances/status_counts`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

const typeCount = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/api/advances/type_counts`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

const monthlyCount = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/api/advances/monthly_counts`, {
      headers: {
        Authorization: `${token}`,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

const updateStatus = async (params) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/api/advances/update_status`,
      {
        id: params.id,
        status: params.status,
        message: params.message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const claimDsa = async (id, dsa_amount) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}/api/advances/claim_dsa`,
      {
        id: id,
        dsa_amount: dsa_amount,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

export default {
  get,
  showDetail,
  create,
  update,
  statusCount,
  typeCount,
  monthlyCount,
  updateStatus,
  claimDsa,
};
