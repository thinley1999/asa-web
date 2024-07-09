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
import SuccessMessage from "../general/SuccessMessage";
import ErrorMessage from "../general/ErrorMessage";

const ViewRequestedAdvance = () => {
  const { id } = useParams();
  const [advanceData, setAdvanceData] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [showButtons, setShowButtons] = useState({ message: " ", show: false });
  const { permissions } = usePermissions();
  const [advancePermission, setAdvancePermission] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchAdvance = async () => {
    try {
      const response = await AdvanceServices.showDetail(id);
      setAdvanceData(response.data);
      console.log("response", response.data);
    } catch (error) {
      console.error("Error fetching current applications:", error);
    }
  };

  const handleShowButtons=()=>{
    if(advanceData.status ==="pending" && advancePermission?.actions?.verify){
      setShowButtons({ message: "Approve", show: true });
    }
    if (advanceData.status === "verified" && advancePermission?.actions?.confirm) {
      setShowButtons({ message: "Confirm", show: true });
    }

    if (advanceData.status === "confirmed" && advancePermission?.actions?.dispatch) {  
      setShowButtons({ message: "Dispatch Fund", show: true });
    }
  }

  const handleDialogOpen = (message) => {
    setDialogMessage(message);
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  const handleDialogSubmit = async (message) => {
    setShowDialog(false);
    const params = {
      id: advanceData.id,
      status: dialogMessage,
      message: message,
    };

    try {
      const response = await AdvanceServices.updateStatus(params);

      if (response && Response.data == 200) {
        if (dialogMessage === "approved") {
          setSuccessMessage("Advance approved successfully");
        } else {
          setSuccessMessage("Advance rejected successfully");
        }
      } else {
        setErrorMessage("Internal Server Error");
      }
    } catch (error) {
      setErrorMessage("An error occurred");
    }
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage("");
  };

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
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

  useEffect(() => {
    handleShowButtons();
  }, [advanceData]);

  console.log("advance permission...", advancePermission);

  return (
    <div className="bg-white">
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={handleCloseSuccessMessage}
        />
      )}

      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onClose={handleCloseErrorMessage}
        />
      )}

      {advanceData.advance_type === "salary_advance" && (
        <SalaryAdvance
          data={advanceData}
          showButtons={showButtons}
          handleDialogOpen={handleDialogOpen}
        />
      )}
      {advanceData.advance_type === "in_country_tour_advance" && (
        <InCountryTour
          data={advanceData}
          showButtons={showButtons}
          handleDialogOpen={handleDialogOpen}
        />
      )}
      {advanceData.advance_type === "other_advance" && (
        <OtherAdvance
          data={advanceData}
          showButtons={showButtons}
          handleDialogOpen={handleDialogOpen}
        />
      )}
      {advanceData.advance_type === "out_country_tour_advance" && (
        <OutCountryTour
          data={advanceData}
          showButtons={showButtons}
          handleDialogOpen={handleDialogOpen}
        />
      )}
      {showDialog && (
        <DialogBox
          isOpen={showDialog}
          onClose={handleDialogClose}
          onSubmit={handleDialogSubmit}
        />
      )}
    </div>
  );
};

export default ViewRequestedAdvance;
