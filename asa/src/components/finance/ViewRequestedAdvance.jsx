import React, { useEffect, useState } from "react";
import "../../assets/css/main.css";
import { useParams } from "react-router-dom";
import AdvanceServices from "../services/AdvanceServices";
import SalaryAdvance from "../employee/SalaryAdvance";
import InCountryTour from "../general/InCountryTour";
import OutCountryTour from "../general/OutCountryTour";
import OtherAdvance from "../employee/OtherAdvance";

const ViewRequestedAdvance = () => {
  const { id } = useParams();
  const [advanceData, setAdvanceData] = useState({});
  const [showDialog, setShowDialog] = useState(true);

  const fetchAdvance = async () => {
    try {
      const response = await AdvanceServices.showDetail(id);
      setAdvanceData(response.data);
      console.log("response", response.data);
    } catch (error) {
      console.error("Error fetching current applications:", error);
    }
  };

  const handleDialog = () => {

  };

  useEffect(() => {
    fetchAdvance();
  }, []);

  return (
    <div className="bg-white">
      {advanceData.advance_type === "salary_advance" && <SalaryAdvance data={advanceData} showButtons={true} />}
      {advanceData.advance_type === "in_country_tour_advance" && <InCountryTour data={advanceData} showButtons={true} />}
      {advanceData.advance_type === "other_advance" && <OtherAdvance data={advanceData} showButtons={true} />}
      {advanceData.advance_type === "out_country_tour_advance" && <OutCountryTour data={advanceData} showButtons={true} />}
      {
        showDialog && (
        <div className="bg-white my-dialog-box">
          <div className="d-flex flex-column">
            <div className="d-flex flex-row">
              
            </div>
          </div>
        </div>
        )
      }
    </div> 
  );
};

export default ViewRequestedAdvance;
