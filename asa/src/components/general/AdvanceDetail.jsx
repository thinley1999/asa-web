import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdvanceServices from "../services/AdvanceServices";
import SalaryAdvance from "../employee/SalaryAdvance";
import InCountryTour from "./InCountryTour";
import OutCountryTour from "./OutCountryTour";
import OtherAdvance from "../employee/OtherAdvance";

const AdvanceDetail = () => {
  let { id } = useParams();
  const [advanceData, setAdvanceData] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const fetchApplication = async () => {
    try {
      const response = await AdvanceServices.showDetail(id);
      setAdvanceData(response.data);
      console.log("Fetched data:", response.data);
    } catch (error) {
      setFetchError(error.message);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  if (fetchError) {
    return <div>Error: {fetchError}</div>;
  }

  if (!advanceData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {advanceData.advance_type === "salary_advance" && <SalaryAdvance data={advanceData} />}
      {advanceData.advance_type === "in_country_tour_advance" && <InCountryTour data={advanceData} />}
      {advanceData.advance_type === "other_advance" && <OtherAdvance data={advanceData} />}
      {advanceData.advance_type === "ex_country_tour_advance" && <OutCountryTour data={advanceData} />}
    </div>
  );
};

export default AdvanceDetail;

