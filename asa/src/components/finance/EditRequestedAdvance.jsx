import React, { useEffect, useState } from "react";
import "../../assets/css/main.css";
import { useParams } from "react-router-dom";
import AdvanceServices from "../services/AdvanceServices";
import SalaryAdvance from "../employee/SalaryAdvance";
import InCountryTour from "../general/InCountryTour";
import OutCountryTour from "../general/OutCountryTour";
import OtherAdvance from "../employee/OtherAdvance";
import DialogBox from "../general/DialogBox";
import { usePermissions } from "../../contexts/PermissionsContext";

const EditRequestedAdvance = () => {
  const { id } = useParams();
  const [advanceData, setAdvanceData] = useState({});
  const { permissions } = usePermissions();
  const [advancePermission, setAdvancePermission] = useState(null);

  const fetchAdvance = async () => {
    try {
      const response = await AdvanceServices.showDetail(id);
      setAdvanceData(response.data);
    } catch (error) {
      console.error("Error fetching current applications:", error);
    }
  };

  useEffect(() => {
    if (permissions) {
      const advancePerm = permissions.find(
        (permission) => permission.resource === "requested_advance"
      );
      setAdvancePermission(advancePerm);
    }
  }, [permissions]);

  useEffect(() => {
    fetchAdvance();
  }, []);

  return (
    <div>
      <div className="bg-white">
        {advanceData.advance_type === "salary_advance" && (
          <SalaryAdvance
            data={advanceData}
            editData = {true}
          />
        )}
        {advanceData.advance_type === "in_country_tour_advance" && (
          <InCountryTour
            data={advanceData}
            isDSA= {advanceData.claim_dsa}
            edit = {true}
          />
        )}
        {advanceData.advance_type === "other_advance" && (
          <OtherAdvance
            data={advanceData}
            editData = {true}
          />
        )}
        {advanceData.advance_type === "ex_country_tour_advance" && (
          <OutCountryTour
            data={advanceData}
            isDSA= {advanceData.claim_dsa}
            edit = {true}
          />
        )}
      </div>
    </div>
  );
};

export default EditRequestedAdvance;
