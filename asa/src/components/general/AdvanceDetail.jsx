import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import AdvanceServices from "../services/AdvanceServices";
import SalaryAdvance from "../employee/SalaryAdvance";
import OtherAdvance from "../employee/OtherAdvance";
import TourAdvance from "../employee/TourAdvance";

const AdvanceDetail = () => {
  let { id } = useParams();
  const [advanceData, setAdvanceData] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  const fetchApplication = async () => {
    try {
      const response = await AdvanceServices.showDetail(id);
      setAdvanceData(response.data);
    } catch (error) {
      setFetchError(error.message);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id])

  console.log("advanceData", advanceData);

  return <div>
    {
      advanceData?.advance_type === "salary_advance" ? <SalaryAdvance data={advanceData} /> : null
    }
    </div>;
};

export default AdvanceDetail;
