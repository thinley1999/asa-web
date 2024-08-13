import React, { useEffect, useState } from "react";
import ReportServices from "../services/ReportServices";
import { useParams } from "react-router-dom";
import SalaryAdvanceForm from "./SalaryAdvanceForm";

const IndividualReport = () => {
  const [report, setReport] = useState({});
  const { id } = useParams();

  const fetchReport = async () => {
    try {
      const response = await ReportServices.show(id);
      setReport(response.data);
      console.log("response", response);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id]); 

  return (
    <div>
      {report.advance_type === "salary_advance" && (
        <SalaryAdvanceForm data={report} />
      )}
    </div>
  );
};

export default IndividualReport;
