import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdvanceServices from "../services/AdvanceServices";
import SalaryAdvance from "../employee/SalaryAdvance";
import InCountryTour from "./InCountryTour";
import OutCountryTour from "./OutCountryTour";
import OtherAdvance from "../employee/OtherAdvance";
import { useToast } from "@/hooks/use-toast";

const AdvanceDetail = () => {
  let { id } = useParams();
  const [advanceData, setAdvanceData] = useState(null);
  const { toast } = useToast();

  const fetchApplication = async () => {
    try {
      const response = await AdvanceServices.showDetail(id);
      setAdvanceData(response.data);
    } catch (error) {
      toast({
          title: "Error",
          description: "Failed to fetch current applications.",
          variant: "destructive",
        });
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  if (!advanceData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {advanceData.advance_type === "salary_advance" && <SalaryAdvance data={advanceData} />}
      {(advanceData.advance_type === "in_country_tour_advance" || advanceData.advance_type === "in_country_dsa_claim") && <InCountryTour data={advanceData} isDSA={advanceData.claim_dsa} />}
      {advanceData.advance_type === "other_advance" && <OtherAdvance data={advanceData} />}
      {(advanceData.advance_type === "ex_country_tour_advance" || advanceData.advance_type === "ex_country_dsa_claim") && <OutCountryTour data={advanceData} isDSA={advanceData.claim_dsa} />}
    </div>
  );
};

export default AdvanceDetail;

