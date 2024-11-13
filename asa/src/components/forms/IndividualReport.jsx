import React, { useEffect, useState } from "react";
import ReportServices from "../services/ReportServices";
import { useParams } from "react-router-dom";
import SalaryAdvanceForm from "./SalaryAdvanceForm";
import TourAdvanceForm from "./TourAdvanceForm";
import DsaClaimForm from "./DsaClaimForm";

const IndividualReport = () => {
  const [report, setReport] = useState(null);
  const { id } = useParams();

  const fetchReport = async () => {
    try {
      const response = await ReportServices.show(id);
      setReport(response?.data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]);

  return (
    <div>
      {report?.report?.advance_type === "salary_advance" ||
      report?.report?.advance_type === "other_advance" ? (
        <SalaryAdvanceForm data={report} type={report?.report?.advance_type} />
      ) : (
        ""
      )}
      {(report?.report?.advance_type === "in_country_tour_advance" ||
        report?.report?.advance_type === "ex_country_tour_advance") && (
        <TourAdvanceForm data={report} />
      )}
      
      {(report?.report?.advance_type === "in_country_dsa_claim" || 
        report?.report?.advance_type === "ex_country_dsa_claim"
      ) && <DsaClaimForm data={report} />}
    </div>
  );
};

export default IndividualReport;
