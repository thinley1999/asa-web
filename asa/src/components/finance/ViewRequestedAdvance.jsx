import React, { useEffect, useState } from "react";
import "../../assets/css/main.css";
import { useParams } from "react-router-dom";
import AdvanceServices from "../services/AdvanceServices";
import SalaryAdvance from "../employee/SalaryAdvance";
import InCountryTour from "../general/InCountryTour";
import OutCountryTour from "../general/OutCountryTour";
import OtherAdvance from "../employee/OtherAdvance";
import DialogBox from "../general/DialogBox";

const ViewRequestedAdvance = () => {
  const { id } = useParams();
  const [advanceData, setAdvanceData] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const fetchAdvance = async () => {
    try {
      const response = await AdvanceServices.showDetail(id);
      setAdvanceData(response.data);
      console.log("response", response.data);
    } catch (error) {
      console.error("Error fetching current applications:", error);
    }
  };

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
    }

    try {
      const response = await AdvanceServices.updateStatus(params)
      console.log("srtststts", response);

      if (response && response.status === 200) {
        if (dialogMessage === "approved") {
          setSuccessMessage("Advance approved successfully");
        }else{
          setSuccessMessage("Advance rejected successfully");
        }
      } else {
        setErrorMessage("Internal Server Error");
      }
    } catch (error) {
      setErrorMessage("An error occurred");
    }
  };

  useEffect(() => {
    fetchAdvance();
  }, []);

  return (
    <div className="bg-white">
      {advanceData.advance_type === "salary_advance" && <SalaryAdvance data={advanceData} showButtons={true} handleDialogOpen={handleDialogOpen} />}
      {advanceData.advance_type === "in_country_tour_advance" && <InCountryTour data={advanceData} showButtons={true} handleDialogOpen={handleDialogOpen}/>}
      {advanceData.advance_type === "other_advance" && <OtherAdvance data={advanceData} showButtons={true} handleDialogOpen={handleDialogOpen} />}
      {advanceData.advance_type === "out_country_tour_advance" && <OutCountryTour data={advanceData} showButtons={true}  handleDialogOpen={handleDialogOpen}/>}
      {
        showDialog && (
          <DialogBox
            isOpen={showDialog}
            onClose={handleDialogClose}
            onSubmit={handleDialogSubmit}
          />
        )
      }
    </div> 
  );
};

export default ViewRequestedAdvance;
