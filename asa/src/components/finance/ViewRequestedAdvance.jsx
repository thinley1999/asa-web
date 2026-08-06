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
import { useToast } from "@/hooks/use-toast";

const ViewRequestedAdvance = () => {
  const { id } = useParams();
  const [advanceData, setAdvanceData] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [showButtons, setShowButtons] = useState({ message: " ", show: false });
  const { permissions } = usePermissions();
  const [advancePermission, setAdvancePermission] = useState(null);
  const { toast } = useToast();

  const fetchAdvance = async () => {
    try {
      const response = await AdvanceServices.showDetail(id);
      setAdvanceData(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch advance data",
        variant: "destructive",
      });
    }
  };

  const handleShowButtons = () => {
    if (
      advanceData.status === "pending" &&
      advancePermission?.actions?.verify
    ) {
      setShowButtons({ message: "Approve", show: true });
    }
    if (
      advanceData.status === "verified" &&
      advancePermission?.actions?.confirm
    ) {
      setShowButtons({ message: "Confirm", show: true });
    }

    if (
      advanceData.status === "confirmed" &&
      advancePermission?.actions?.dispatch
    ) {
      setShowButtons({ message: "Dispatch Fund", show: true });
    }
  };

  const handleDialogOpen = (message, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
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

      if (response) {
        if (dialogMessage === "approved") {
          toast({
            title: "Success",
            description: "Advance approved successfully",
            variant: "default",
          });
        } else {
          toast({
            title: "Success",
            description: "Advance rejected successfully",
            variant: "default",
          });
        }
        setShowButtons({ message: "", show: false });
      } else {
        toast({
          title: "Error",
          description: "Internal Server Issue",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Internal Server Issue, Voucher Clash",
        variant: "destructive",
      });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (permissions) {
      const advancePerm = permissions.find(
        (permission) => permission.resource === "requested_advance",
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

  return (
    <div>
      <div className="bg-white">
        {advanceData.advance_type === "salary_advance" && (
          <SalaryAdvance
            data={advanceData}
            showButtons={showButtons}
            handleDialogOpen={handleDialogOpen}
          />
        )}
        {(advanceData.advance_type === "in_country_tour_advance" ||
          advanceData.advance_type === "in_country_dsa_claim") && (
          <InCountryTour
            data={advanceData}
            isDSA={advanceData.claim_dsa}
            showButtons={showButtons}
            handleDialogOpen={(message, e) => handleDialogOpen(message, e)}
          />
        )}
        {advanceData.advance_type === "other_advance" && (
          <OtherAdvance
            data={advanceData}
            showButtons={showButtons}
            handleDialogOpen={handleDialogOpen}
          />
        )}
        {(advanceData.advance_type === "ex_country_tour_advance" ||
          advanceData.advance_type === "ex_country_dsa_claim") && (
          <OutCountryTour
            data={advanceData}
            isDSA={advanceData.claim_dsa}
            showButtons={showButtons}
            handleDialogOpen={(message, e) => handleDialogOpen(message, e)}
          />
        )}
        {showDialog && (
          <DialogBox
            isOpen={showDialog}
            onClose={handleDialogClose}
            onSubmit={handleDialogSubmit}
            preFilledMessage={dialogMessage}
            actionMessage={showButtons.message}
          />
        )}
      </div>
    </div>
  );
};

export default ViewRequestedAdvance;
