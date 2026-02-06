import React, { useState, useEffect, useRef } from "react";
import UserServices from "../services/UserServices";
import AdvanceServices from "../services/AdvanceServices";
import { formatDate } from "../utils/DateUtils";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle, Loader2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SalaryAdvance = ({ data, showButtons, handleDialogOpen, editData }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const inputRefs = useRef({});

  const initialFormData = {
    firstName: "",
    middleName: "",
    lastName: "",
    date: new Date().toISOString().slice(0, 10),
    department: "",
    designation: "",
    totalAmount: 0,
    thresholdAmount: "",
    duration: 0,
    deduction: 0.0,
    purpose: "",
    username: "",
    advance_type: "salary_advance",
    completion_month: "june 2023",
    tour_type: "salary_advance",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchUserDetails();
        if (data) {
          updateFormDataFromAPI(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load application data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [data]);

  function monthsUntilFinYearEnd(currentDate) {
    let currentDay = currentDate.getDate();
    let currentMonth = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();
    let financialEndYear = null;

    if (currentMonth < 7) {
      financialEndYear = currentYear;
    } else {
      financialEndYear = currentYear + 1;
    }

    let monthsLeft;

    if (currentMonth >= 7) {
      monthsLeft = 12 - currentMonth + 6;
    } else {
      monthsLeft = 6 - currentMonth;
    }

    if (currentDay < 25) {
      monthsLeft += 1;
    }

    return Math.min(monthsLeft, 10);
  }

  const fetchUserDetails = async () => {
    try {
      const response = await UserServices.showDetail(
        data ? data.user.id : null,
      );

      if (response && response.status === 200) {
        setUser(response.data);
        updateFormDataWithUser(response.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  };

  const updateFormDataWithUser = (userData) => {
    setFormData((prev) => ({
      ...prev,
      firstName: userData.first_name || "",
      middleName: userData.middle_name || "",
      lastName: userData.last_name || "",
      designation: userData.position_title || "",
      thresholdAmount: userData.net_pay * 2 || "",
      department: userData.department_name || "",
      username: userData.username || "",
    }));
  };

  const updateFormDataFromAPI = (apiData) => {
    setFormData((prev) => ({
      ...prev,
      date: formatDate(apiData.created_at) || "",
      totalAmount: apiData.amount || 0,
      thresholdAmount: apiData.basic_pay * 2 || "",
      duration: apiData.advance_detail?.duration || 0,
      deduction: apiData.advance_detail?.deduction || 0.0,
      purpose: apiData.purpose || "",
      advance_type: apiData.advance_type || "salary_advance",
      completion_month: apiData.advance_detail?.completion_month || "june 2023",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const focusedElement = document.activeElement;
    const focusedInputName = focusedElement?.name;

    setFormData((prev) => {
      let newDeduction = prev.deduction;
      if (name === "totalAmount" || name === "duration") {
        const total =
          name === "totalAmount"
            ? parseFloat(value)
            : parseFloat(prev.totalAmount);
        const duration =
          name === "duration" ? parseFloat(value) : parseFloat(prev.duration);
        newDeduction = duration > 0 ? Math.ceil(total / duration) : 0;
      }

      return {
        ...prev,
        [name]: value,
        deduction: newDeduction,
      };
    });

    setFormErrors((prev) => {
      const newErrors = { ...prev };
      if (name === "totalAmount") {
        if (value > 0 && value <= formData.thresholdAmount) {
          delete newErrors.totalAmount;
        }
      }
      if (name === "duration") {
        const maxDate = monthsUntilFinYearEnd(new Date());
        if (value > 0 && value <= maxDate) {
          delete newErrors.duration;
        }
      }
      if (name === "purpose") {
        if (value.trim()) {
          delete newErrors.purpose;
        }
      }
      return newErrors;
    });

    setTimeout(() => {
      if (focusedInputName) {
        const input = document.querySelector(`[name="${focusedInputName}"]`);
        if (input) {
          input.focus();
          const length = input.value.length;
          input.setSelectionRange(length, length);
        }
      }
    }, 0);
  };

  const validateForm = (isUpdate = false) => {
    let errors = {};
    let maxDate = monthsUntilFinYearEnd(new Date());

    if (
      formData.totalAmount <= 0 ||
      (!isUpdate && formData.totalAmount > formData.thresholdAmount)
    ) {
      errors.totalAmount =
        "Advance amount should be more than 0" +
        (isUpdate ? "" : " and less than the threshold amount.");
    }
    if (formData.duration <= 0 || formData.duration > maxDate) {
      errors.duration = `Duration should be between 1 and ${maxDate} months.`;
    }
    if (!formData.purpose.trim()) {
      errors.purpose = "Purpose is required.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm(false)) {
      setSubmitting(true);
      try {
        const response = await AdvanceServices.create(formData);

        if (response) {
          toast({
            title: "Success",
            description: "Advance created successfully",
            variant: "default",
          });
          resetForm();
        } else {
          toast({
            title: "Error",
            description: "Internal Server Error",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "An error occurred",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  const updateAdvance = async (e) => {
    e.preventDefault();
    if (validateForm(true)) {
      setSubmitting(true);
      try {
        const response = await AdvanceServices.update(data.id, formData);

        if (response) {
          toast({
            title: "Success",
            description: "Advance Updated successfully",
            variant: "default",
          });
        } else {
          toast({
            title: "Error",
            description: "Internal Server Error",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "An error occurred",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  // Loading Skeleton
  const FormSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-32" />
      </CardFooter>
    </Card>
  );

  // Form Field Component
  const FormField = ({ label, children, error, required = false }) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );

  // Display read-only field
  const DisplayField = ({ label, value, icon: Icon }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <span className="text-sm">{value || "-"}</span>
      </div>
    </div>
  );

  if (loading) {
    return <FormSkeleton />;
  }

  const isReadOnly = data && !editData;
  const showSubmit = !data && !editData;
  const maxDuration = monthsUntilFinYearEnd(new Date());

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-4">
          {/* Employee Information Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Employee Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DisplayField
                label="First Name"
                value={formData.firstName}
                icon={Calendar}
              />
              <DisplayField label="Middle Name" value={formData.middleName} />
              <DisplayField label="Last Name" value={formData.lastName} />
              <DisplayField label="Employee ID" value={formData.username} />
              <DisplayField label="Application Date" value={formData.date} />
              <DisplayField label="Department" value={formData.department} />
              <DisplayField label="Designation" value={formData.designation} />
            </div>
          </div>

          <Separator />

          {/* Advance Details Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Advance Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Advance Amount */}
              <FormField
                label="Advance Amount (Nu)*"
                error={formErrors.totalAmount}
                required
              >
                <Input
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={formErrors.totalAmount ? "border-red-500" : ""}
                  placeholder="Enter advance amount"
                />
              </FormField>

              {/* Threshold Amount */}
              <DisplayField
                label="Threshold Amount (Net pay × 2)"
                value={
                  formData.thresholdAmount
                    ? `Nu ${formData.thresholdAmount}`
                    : "N/A"
                }
              />

              {/* Duration */}
              <FormField
                label={`Duration in months* (Max: ${maxDuration})`}
                error={formErrors.duration}
                required
              >
                <Input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  min="1"
                  max={maxDuration}
                  className={formErrors.duration ? "border-red-500" : ""}
                  placeholder="Enter duration"
                />
              </FormField>

              {/* Monthly Deduction */}
              <DisplayField
                label="Monthly Deduction (Nu)"
                value={formData.deduction ? `Nu ${formData.deduction}` : "N/A"}
              />
            </div>

            {/* Purpose */}
            <div className="mt-4">
              <FormField
                label="Purpose of Advance*"
                error={formErrors.purpose}
                required
              >
                <Textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  rows={3}
                  className={formErrors.purpose ? "border-red-500" : ""}
                  placeholder="Describe the purpose of this advance"
                />
              </FormField>
            </div>

            {/* Voucher Number (if dispatched) */}
            {data?.vch_no && data.status === "dispatched" && (
              <div className="mt-4">
                <DisplayField label="Voucher No (ICBS)" value={data.vch_no} />
              </div>
            )}

            {/* Validation Summary */}
            {Object.keys(formErrors).length > 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please fix the following errors before submitting
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>

        {/* Form Actions */}
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between pt-6 border-t">
          {/* Submit Button (Create new) */}
          {showSubmit && (
            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              {submitting ? (
                <>
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Submit Application
                </>
              )}
            </Button>
          )}

          {/* Update Button (Edit mode) */}
          {editData && (
            <Button
              type="button"
              size="lg"
              onClick={updateAdvance}
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Update Application
                </>
              )}
            </Button>
          )}

          {/* Action Buttons (Approve/Reject) */}
          {showButtons?.show && (
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                type="button"
                size="lg"
                variant="default"
                onClick={() => handleDialogOpen("approved")}
                className="flex-1 sm:flex-none"
              >
                {showButtons.message || "Approve"}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="destructive"
                onClick={() => handleDialogOpen("rejected")}
                className="flex-1 sm:flex-none"
              >
                Reject
              </Button>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default SalaryAdvance;
