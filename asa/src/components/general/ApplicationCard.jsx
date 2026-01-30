import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Building, Eye, Edit, FilePlus } from "lucide-react";

export const ApplicationCard = ({ 
  application, 
  index, 
  getStatusConfig, 
  getAdvanceTypeLabel, 
  formatDate, 
  formatCurrency,
  activeTab,
  advance_type // Add this prop for advance type mapping
}) => {
  const navigate = useNavigate();
  const statusConfig = getStatusConfig(application.status);
  const Icon = statusConfig.icon;

  // Navigation handlers
  const handleDetails = (id) => {
    navigate(`/advanceDetail/${id}`);
  };

  const handleDSAClaim = (id) => {
    navigate(`/dsaClaim/${id}`);
  };

  const editApplication = (id) => {
    navigate(`/editAdvance/${id}`);
  };

  // Function to get currency amounts based on advance_type
  const getCurrencyAmounts = () => {
    const { advance_type, advance_amount, amount, dsa_amount } = application;

    let nuAmount = 0;
    let inrAmount = "0.00";
    let usdAmount = "0.00";

    switch (advance_type) {
      case "ex_country_tour_advance":
      case "in_country_tour_advance":
        if (advance_amount && typeof advance_amount === "object") {
          nuAmount = advance_amount.Nu || 0;
          inrAmount = advance_amount.INR || "0.00";
          usdAmount = advance_amount.USD || "0.00";
        } else {
          nuAmount = amount || 0;
        }
        break;

      case "other_advance":
      case "salary_advance":
        nuAmount = amount || 0;
        break;

      case "in_country_dsa_claim":
      case "ex_country_dsa_claim":
        if (dsa_amount && typeof dsa_amount === "object") {
          nuAmount = dsa_amount.Nu || 0;
          inrAmount = dsa_amount.INR || "0.00";
          usdAmount = dsa_amount.USD || "0.00";
        } else {
          nuAmount = amount || 0;
        }
        break;

      default:
        nuAmount = amount || 0;
    }

    return { nuAmount, inrAmount, usdAmount };
  };

  const currencyAmounts = getCurrencyAmounts();
  const formattedNuAmount = formatCurrency(currencyAmounts.nuAmount);

  // Helper function to determine which currencies to show
  const shouldShowCurrencyBreakdown = () => {
    const { advance_type } = application;
    return (
      advance_type === "ex_country_tour_advance" ||
      advance_type === "in_country_tour_advance" ||
      advance_type === "in_country_dsa_claim" ||
      advance_type === "ex_country_dsa_claim"
    );
  };

  // Helper to determine if DSA Claim button should be shown
  const shouldShowDSAClaimButton = () => {
    const { status, claim_dsa, advance_type } = application;
    return (
      status === "dispatched" &&
      !claim_dsa &&
      (advance_type === "ex_country_tour_advance" || 
       advance_type === "in_country_tour_advance")
    );
  };

  // Helper to determine if Edit button should be shown
  const shouldShowEditButton = () => {
    const { status, advance_type } = application;
    const isDSAClaim = advance_type === "in_country_dsa_claim" || 
                       advance_type === "ex_country_dsa_claim";
    
    return (
      (status === "pending" || status === "rejected") &&
      !isDSAClaim
    );
  };

  const showBreakdown = shouldShowCurrencyBreakdown();
  const showDSAClaimButton = shouldShowDSAClaimButton();
  const showEditButton = shouldShowEditButton();

  return (
    <Card className="mb-2 duration-200 !shadow">
      <CardContent className="p-3">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">
                  {getAdvanceTypeLabel(application.advance_type)}
                </h3>
                <Badge
                  variant="outline"
                  className={`${statusConfig.color} gap-1 px-2 py-0.5 text-xs`}
                >
                  <Icon className="h-2.5 w-2.5" />
                  {statusConfig.label}
                </Badge>
              </div>
              {application.office_order && (
                <p className="text-xs text-muted-foreground">
                  Ref: {application.office_order}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">
                {formattedNuAmount}
              </p>
              {showBreakdown && (
                <div className="text-xs text-muted-foreground mt-1">
                  {parseFloat(currencyAmounts.inrAmount) > 0 && (
                    <span>INR: {currencyAmounts.inrAmount}</span>
                  )}
                  {parseFloat(currencyAmounts.usdAmount) > 0 && (
                    <span
                      className={
                        parseFloat(currencyAmounts.inrAmount) > 0
                          ? "ml-2"
                          : ""
                      }
                    >
                      USD: {currencyAmounts.usdAmount}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          <Separator className="my-2" />

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs">
                  {formatDate(application.created_at)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 w-full sm:w-auto">
              {/* View Details Button - Always shown */}
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs gap-1 flex-1 sm:flex-none"
                onClick={() => handleDetails(application.id)}
              >
                <Eye className="h-3 w-3" />
                View Details
              </Button>

              {/* DSA Claim Button - Conditionally shown */}
              {showDSAClaimButton && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs gap-1 flex-1 sm:flex-none"
                  onClick={() => handleDSAClaim(application.id)}
                >
                  <FilePlus className="h-3 w-3" />
                  Claim DSA
                </Button>
              )}

              {/* Edit Button - Conditionally shown */}
              {showEditButton && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs gap-1 flex-1 sm:flex-none"
                  onClick={() => editApplication(application.id)}
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
