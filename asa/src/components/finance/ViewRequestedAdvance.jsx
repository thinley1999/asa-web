import React, { useEffect, useState } from "react";
import "../../assets/css/main.css";
import CustomInput from "../general/CustomInput";
import { useParams } from "react-router-dom";
import AdvanceServices from "../services/AdvanceServices";
import SalaryAdvance from "../employee/SalaryAdvance";
import InCountryTour from "../general/InCountryTour";
import OutCountryTour from "../general/OutCountryTour";
import OtherAdvance from "../employee/OtherAdvance";

const ViewRequestedAdvance = () => {
  const { id } = useParams();
  const [advanceData, setAdvanceData] = useState({});

  const fetchAdvance = async () => {
    try {
      const response = await AdvanceServices.showDetail(id);
      setAdvanceData(response.data);
      console.log("response", response.data);
    } catch (error) {
      console.error("Error fetching current applications:", error);
    }
  };

  useEffect(() => {
    fetchAdvance();
  }, []);

  return (
    <div className="bg-white">
      {advanceData.advance_type === "salary_advance" && <SalaryAdvance data={advanceData} />}
      {advanceData.advance_type === "in_country_tour_advance" && <InCountryTour data={advanceData} />}
      {advanceData.advance_type === "other_advance" && <OtherAdvance data={advanceData} />}
      {advanceData.advance_type === "out_country_tour_advance" && <OutCountryTour data={advanceData} />}
      <div className="d-flex justify-content-center bg-white">
          <div className="px-4 pb-3 text-center">
            <button
              name="approve"
              type="button"
              className="btn btn-success px-5"
            >
              Approve
            </button>
          </div>
          <div className="pb-3 text-center">
            <button
              name="approve"
              type="button"
              className="btn btn-danger px-5"
            >
              Reject
            </button>
          </div>
        </div>
    </div>
  );
};

export default ViewRequestedAdvance;
