import React, { useState, useEffect, useRef } from "react";
import UserServices from "../services/UserServices";
import AdvanceServices from "../services/AdvanceServices";
import FileServices from "../services/FileServices";
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Calendar,
  FileText,
  Upload,
  X,
  Eye,
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TravelDetails from "./TravelDetails";
import TravelDetailsTable from "./TravelDetailsTable";

const InCountryTour = ({
  data,
  showButtons,
  isDSA,
  handleDialogOpen,
  edit,
}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const { toast } = useToast();
  const focusedElementRef = useRef(null);

  const initialFormData = {
    firstName: "",
    middleName: "",
    lastName: "",
    date: new Date().toISOString().slice(0, 10),
    department: "",
    designation: "",
    employeeID: "",
    advanceAmount: {},
    totalAmount: 0,
    remark: "",
    advance_type: "in_country_tour_advance",
    files: [],
    update_files: [],
    delete_files: [],
    advance_percentage: "",
    office_order: "",
    tour_type: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchUserDetails();
        if (data) {
          updateFormDataFromAPI(data);
        }
      } catch (error) {
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

  const total = isDSA
    ? data.dsa_amount?.Nu
    : data
      ? edit
        ? formData.advanceAmount?.Nu
        : data.advance_amount?.Nu
      : formData.advanceAmount?.Nu;

  const totalAmount = () => {
    let total = 0;
    rows.forEach((row) => {
      if (row.rate) {
        total += parseFloat(row.rate);
      }
    });

    setFormData((prev) => ({
      ...prev,
      totalAmount: total,
    }));
  };

  const handleFileChange = async (event) => {
    const newFiles = Array.from(event.target.files);

    if (newFiles.length === 0) return;

    const maxSize = 10 * 1024 * 1024;
    const oversizedFiles = newFiles.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return;
    }

    if (!edit) {
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        update_files: [...prev.update_files, ...newFiles],
      }));
    }

    delete formErrors.file_error;
  };

  const removeFile = (indexToRemove) => {
    if (!edit) {
      setFormData((prev) => ({
        ...prev,
        files: prev.files.filter((_, index) => index !== indexToRemove),
      }));
    } else {
      const fileToDelete = formData.files[indexToRemove];
      setFormData((prev) => ({
        ...prev,
        files: prev.files.filter((_, index) => index !== indexToRemove),
        delete_files: [...prev.delete_files, fileToDelete.id],
      }));
    }
  };

  const removeUpdateFile = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      update_files: prev.update_files.filter(
        (_, index) => index !== indexToRemove,
      ),
    }));
  };

  const handleView = async (fileId) => {
    try {
      const file = formData.files.find((f) => f.id === fileId);

      if (file && file.url) {
        window.open(file.url, "_blank");
      } else {
        throw new Error("File URL not found");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to open file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    const focusedElement = document.activeElement;
    const focusedInputName = focusedElement?.name;

    setFormData((prev) => {
      if (keys.length === 1) {
        return {
          ...prev,
          [name]: value,
        };
      } else {
        return {
          ...prev,
          [keys[0]]: {
            ...prev[keys[0]],
            [keys[1]]: value,
          },
        };
      }
    });

    setFormErrors((prev) => {
      const newErrors = { ...prev };
      if (name === "office_order") delete newErrors.office_order_error;
      if (name === "remark") delete newErrors.remark_error;
      if (name === "advanceAmount.Nu") delete newErrors.advance_amount_error;
      if (name === "tour_type") delete newErrors.tour_type_error;
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

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => {
      const newErrors = { ...prev };
      const errorKey = `${name}_error`;
      if (newErrors[errorKey]) {
        delete newErrors[errorKey];
      }
      return newErrors;
    });
  };

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
      employeeID: userData.username || "",
      department: userData.department_name || "",
      designation: userData.position_title || "",
    }));
  };

  const updateFormDataFromAPI = (apiData) => {
    setFormData((prev) => ({
      ...prev,
      office_order: apiData.office_order || "",
      remark: apiData.remark || "",
      advanceAmount: apiData.advance_amount || {},
      files: apiData?.files || [],
      tour_type: apiData.tour_type || "",
      advance_percentage: apiData.advance_percentage || "",
    }));
    setRows(apiData?.travel_itinerary || []);
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.files.length && !edit) {
      errors.file_error = "Please upload relevant documents.";
    }

    if (!formData.office_order) {
      errors.office_order_error = "Please enter office order number.";
    }

    if (!formData.tour_type) {
      errors.tour_type_error = "Please select tour type.";
    }

    if (!formData.remark && !isDSA) {
      errors.remark_error = "Please enter remarks.";
    }

    if (!formData.advanceAmount?.Nu && !isDSA) {
      errors.advance_amount_error = "Please enter advance amount.";
    }

    if (formData.advanceAmount?.Nu > formData.totalAmount && !isDSA) {
      errors.advance_amount_error =
        "Advance amount cannot be greater than total amount.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateTravelItinerary = () => {
    let errors = {};
    delete formErrors.itinerary_error;

    if (rows.length === 0) {
      errors.itinerary_error = "Please add travel itinerary for the advance.";
    }

    for (let i = 0; i < rows.length - 1; i++) {
      const currentEndDate = new Date(rows[i].end_date);
      const nextStartDate = new Date(rows[i + 1].start_date);

      if (currentEndDate >= nextStartDate) {
        errors.itinerary_error =
          "Travel itinerary dates are not valid. Start date of the next itinerary should be greater than the end date of the previous itinerary.";
        break;
      }
    }

    setFormErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    const isTravelItineraryValid = validateTravelItinerary();

    if (isFormValid && isTravelItineraryValid) {
      setSubmitting(true);
      setUploading(true);

      try {
        const advanceResponse = await AdvanceServices.create(formData, rows);

        if (advanceResponse && advanceResponse.id) {
          // Upload files
          if (formData.files.length > 0) {
            const fileResponse = await FileServices.create(
              advanceResponse.id,
              formData.files,
            );

            if (!fileResponse || fileResponse.status !== 201) {
              throw new Error("File upload failed");
            }
          }

          toast({
            title: "Success",
            description: "Your application has been successfully submitted.",
            variant: "default",
          });
          resetForm();
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message ||
            "An error occurred during submission",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
        setUploading(false);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    const isTravelItineraryValid = validateTravelItinerary();

    if (isFormValid && isTravelItineraryValid) {
      setSubmitting(true);
      setUploading(true);

      try {
        const advanceResponse = await AdvanceServices.update(
          data.id,
          formData,
          rows,
        );

        if (advanceResponse) {
          // Upload new files
          if (formData.update_files.length > 0) {
            await FileServices.create(
              advanceResponse.id,
              formData.update_files,
            );
          }

          // Delete removed files
          if (formData.delete_files.length > 0) {
            await FileServices.deleteFile(
              advanceResponse.id,
              formData.delete_files,
            );
          }

          setFormData((prev) => ({
            ...prev,
            delete_files: initialFormData.delete_files,
            update_files: [],
          }));

          toast({
            title: "Success",
            description: "Advance has been successfully updated.",
            variant: "default",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "An error occurred during update",
          variant: "destructive",
        });
      } finally {
        setSubmitting(false);
        setUploading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setRows([]);
  };

  const haltCount = () => {
    let count = 0;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].stop_at) {
        count++;
      }
    }
    return count;
  };

  const handleTravelItinerary = (newData) => {
    // delete errors.itinerary_error;

    const dataToCheck = editData || newData;
    const currentHaltCount = haltCount();

    if (dataToCheck.stop_at && currentHaltCount >= 2) {
      setFormErrors((prev) => ({
        ...prev,
        itinerary_error:
          "Travel itinerary dates are not valid. User can only add 2 stop overs.",
      }));
    } else {
      if (editData) {
        setRows(rows.map((row) => (row.id === newData.id ? newData : row)));
      } else {
        setRows([...rows, { id: rows.length + 1, ...newData }]);
      }
    }

    handleDialogClose();
  };

  const removeRow = (id) => {
    const newRows = rows.filter((row) => row.id !== id);
    setRows(newRows);
  };

  const editRow = (rowData) => {
    setEditData(rowData);
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditData(null);
  };

  useEffect(() => {
    totalAmount();
  }, [rows, formData.advance_percentage]);

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

  // File Display Component
  const FileDisplay = ({ file, index, isExisting = false }) => {
    const fileName = file.name || file.filename || `File ${index + 1}`;
    const fileSize = file.size ? `(${(file.size / 1024).toFixed(1)} KB)` : "";

    return (
      <div className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium truncate max-w-[200px]">
              {fileName}
            </p>
            <p className="text-xs text-muted-foreground">{fileSize}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isExisting && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleView(file.id)}
              className="h-7 w-7 p-0"
            >
              <Eye className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              isExisting ? removeFile(index) : removeUpdateFile(index)
            }
            className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <FormSkeleton />;
  }

  const isReadOnly = data && !edit;
  const showSubmit = !data && !edit;
  const hasFiles =
    formData.files.length > 0 || formData.update_files.length > 0;
  const allFiles = [...formData.files, ...formData.update_files];

  return (
    <Card className="w-full">
      <form>
        <CardContent className="space-y-6 pt-6">
          {/* Employee Information Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Employee Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DisplayField label="First Name" value={formData.firstName} />
              <DisplayField label="Middle Name" value={formData.middleName} />
              <DisplayField label="Last Name" value={formData.lastName} />
              <DisplayField label="Employee ID" value={formData.employeeID} />
              <DisplayField label="Application Date" value={formData.date} />
              <DisplayField label="Department" value={formData.department} />
              <DisplayField label="Designation" value={formData.designation} />
            </div>
          </div>

          <Separator />

          {/* Advance Details Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tour Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Office Order Number */}
              <FormField
                label="Office Order No*"
                error={formErrors.office_order_error}
                required
              >
                <Input
                  type="text"
                  name="office_order"
                  value={formData.office_order}
                  onChange={handleChange}
                  disabled={isReadOnly}
                  className={
                    formErrors.office_order_error ? "border-red-500" : ""
                  }
                  placeholder="Enter office order number"
                />
              </FormField>

              {/* Tour Type */}
              <FormField
                label="Tour Type*"
                error={formErrors.tour_type_error}
                required
              >
                <Select
                  value={formData.tour_type}
                  onValueChange={(value) =>
                    handleSelectChange("tour_type", value)
                  }
                  disabled={isReadOnly}
                >
                  <SelectTrigger
                    className={
                      formErrors.tour_type_error ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Select tour type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="office tour">Office Tour</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            {/* File Upload */}
            <div className="mt-4">
              <FormField
                label="Relevant Documents*"
                error={formErrors.file_error}
                required={!edit}
              >
                <div className="space-y-3">
                  {/* Existing Files */}
                  {formData.files.map((file, index) => (
                    <FileDisplay
                      key={file.id || index}
                      file={file}
                      index={index}
                      isExisting={true}
                    />
                  ))}

                  {/* New/Update Files */}
                  {formData.update_files.map((file, index) => (
                    <FileDisplay
                      key={`update-${index}`}
                      file={file}
                      index={index}
                      isExisting={false}
                    />
                  ))}

                  {/* Upload Button */}
                  {!isReadOnly && (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                      <Label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 rounded-lg p-4 transition-colors"
                      >
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm font-medium">
                          Click to upload or drag and drop
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          PDF, DOC, JPG, PNG (Max 10MB each)
                        </span>
                      </Label>
                      <Input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </div>
                  )}
                </div>
              </FormField>
            </div>

            {/* Travel Itinerary */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold">Travel Itinerary</h4>
                  <div className="mt-1 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Tip:</span> Add each travel
                      segment in chronological order without overlapping dates.
                      <span className="block mt-1">
                        •{" "}
                        <Badge variant="outline" className="text-xs mr-1">
                          Travel
                        </Badge>
                        : Movement between locations •{" "}
                        <Badge variant="warning" className="text-xs mr-1 ml-2">
                          Halt
                        </Badge>
                        : Staying at a place for training/meetings •{" "}
                        <Badge variant="default" className="text-xs ml-2">
                          Return Trip
                        </Badge>
                        : Return journey dates
                      </span>
                    </p>
                  </div>
                </div>
                {!isReadOnly && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDialog(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Itinerary
                  </Button>
                )}
              </div>

              <TravelDetailsTable
                existingData={data?.travel_itinerary}
                data={rows}
                removeRow={removeRow}
                editRow={editRow}
                edit={edit}
              />

              {formErrors.itinerary_error && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {formErrors.itinerary_error}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Amount Section */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Advance Amount */}
              {!isDSA && (
                <FormField
                  label="Advance Amount (Nu)*"
                  error={formErrors.advance_amount_error}
                  required
                >
                  <Input
                    type="number"
                    name="advanceAmount.Nu"
                    value={formData.advanceAmount?.Nu ?? ""}
                    onChange={handleChange}
                    disabled={isReadOnly}
                    className={
                      formErrors.advance_amount_error ? "border-red-500" : ""
                    }
                    placeholder="Enter advance amount"
                  />
                </FormField>
              )}

              {/* DSA Amount */}
              {isDSA && (
                <DisplayField
                  label="DSA Amount (Nu)"
                  value={data.dsa_amount?.Nu || "N/A"}
                />
              )}

              {/* Total Amount */}
              <DisplayField
                label="Total Amount (Nu)"
                value={formData.totalAmount}
              />
            </div>

            {/* Remarks */}
            {!isDSA && (
              <div className="mt-4">
                <FormField
                  label="Remarks*"
                  error={formErrors.remark_error}
                  required
                >
                  <Textarea
                    name="remark"
                    value={formData.remark}
                    onChange={handleChange}
                    disabled={isReadOnly}
                    rows={3}
                    className={formErrors.remark_error ? "border-red-500" : ""}
                    placeholder="Enter remarks for this advance"
                  />
                </FormField>
              </div>
            )}

            {/* Voucher Number (if dispatched/closed) */}
            {data?.vch_no &&
              (data.status === "dispatched" || data.status === "closed") && (
                <div className="mt-4">
                  <DisplayField label="Voucher No (ICBS)" value={data.vch_no} />
                </div>
              )}

            {/* Validation Summary */}
            {Object.keys(formErrors).length > 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please fix the following errors:
                  <ul className="list-disc pl-4 space-y-1">
                    {Object.entries(formErrors).map(([field, error]) => (
                      <li key={field} className="text-sm">
                        {error}
                      </li>
                    ))}
                  </ul>
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
              type="button"
              size="lg"
              disabled={submitting || uploading}
              onClick={handleSubmit}
              className="w-full sm:w-auto"
            >
              {submitting || uploading ? (
                <>
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                  {uploading ? "Uploading..." : "Submitting..."}
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
          {edit && (
            <Button
              type="button"
              size="lg"
              onClick={handleUpdate}
              disabled={submitting || uploading}
              className="w-full sm:w-auto"
            >
              {submitting || uploading ? (
                <>
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                  {uploading ? "Uploading..." : "Updating..."}
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDialogOpen("approved");
                }}
                className="flex-1 sm:flex-none"
              >
                {showButtons.message || "Approve"}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDialogOpen("rejected");
                }}
                className="flex-1 sm:flex-none"
              >
                Reject
              </Button>
            </div>
          )}
        </CardFooter>
      </form>

      {/* Travel Details Dialog */}
      {showDialog && (
        <TravelDetails
          existingData={data?.travel_itinerary}
          isOpen={showDialog}
          onClose={handleDialogClose}
          onSave={handleTravelItinerary}
          initialData={editData}
          type="inCountry"
          haltCount={haltCount}
          edit={edit}
          username={user?.username}
          department={formData.department}
        />
      )}
    </Card>
  );
};

export default InCountryTour;
