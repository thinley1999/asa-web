import React, { useState, useEffect, useRef } from "react";
import UserServices from "../services/UserServices";
import { processUserName } from "../utils/UserUtils";
import AdvanceServices from "../services/AdvanceServices";
import FileServices from "../services/FileServices";

// ShadCN UI Components
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
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const OtherAdvance = ({ data, showButtons, handleDialogOpen, editData }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const inputRefs = useRef({});

  const initialFormData = {
    firstName: "",
    middleName: "",
    lastName: "",
    date: new Date().toISOString().slice(0, 10),
    department: "",
    designation: "",
    employeeID: "",
    totalAmount: 0,
    purpose: "",
    other_advance_type: "",
    advance_type: "other_advance",
    files: [],
    update_files: [],
    delete_files: [],
    tour_type: "other_advance",
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

  const fetchUserDetails = async () => {
    try {
      const response = await UserServices.showDetail(
        data ? data.user.id : null,
      );
      if (response && response.status) {
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
      purpose: apiData.purpose || "",
      other_advance_type: apiData.remark || "",
      totalAmount: apiData.amount || 0,
      files: apiData?.files || [],
      tour_type: "other_advance",
    }));
  };

  const handleFileChange = async (event) => {
    const newFiles = Array.from(event.target.files);

    if (newFiles.length === 0) return;

    // Check file size (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = newFiles.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB",
        variant: "destructive",
      });
      return;
    }

    if (!editData) {
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
    if (newFiles){
      delete formErrors.file_error;
    }
  };

  const removeFile = (indexToRemove) => {
    if (!editData) {
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

  const handleDownload = async (fileId, fileName) => {
    try {
      // Implement file download logic here
      toast({
        title: "Downloading",
        description: `Downloading ${fileName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const focusedElement = document.activeElement;
    const focusedInputName = focusedElement?.name;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => {
      const newErrors = { ...prev };
      if (name === "totalAmount" && value > 0) {
        delete newErrors.totalAmount;
      }
      if (name === "purpose" && value.trim()) {
        delete newErrors.purpose;
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

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      other_advance_type: value,
    }));
    if (value){
      delete formErrors.other_advance_type;
    }
  };

  const validateForm = () => {
    let errors = {};

    if (formData.totalAmount <= 0) {
      errors.totalAmount = "Advance amount should be more than 0!";
    }

    if (!formData.other_advance_type.trim()) {
      errors.other_advance_type = "Please select an advance type!";
    }

    if (!formData.purpose.trim()) {
      errors.purpose = "Purpose is required.";
    }

    if (!formData.files.length && !editData && !formData.update_files.length) {
      errors.file_error = "Please upload relevant documents.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setUploading(true);

    try {
      const response = await AdvanceServices.create(formData);

      if (response && response.id) {
        // Upload files
        if (formData.files.length > 0) {
          const fileResponse = await FileServices.create(
            response.id,
            formData.files,
          );
          if (!fileResponse || fileResponse.status !== 201) {
            throw new Error("File upload failed");
          }
        }

        toast({
          title: "Success",
          description: "Advance created successfully",
          variant: "default",
        });
        resetForm();
      } else {
        throw new Error("Internal Server Error");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const updateAdvance = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setUploading(true);

    try {
      const response = await AdvanceServices.update(data.id, formData);

      if (response) {
        // Upload new files
        if (formData.update_files.length > 0) {
          await FileServices.create(response.id, formData.update_files);
        }

        // Delete removed files
        if (formData.delete_files.length > 0) {
          await FileServices.deleteFile(response.id, formData.delete_files);
        }

        toast({
          title: "Success",
          description: "Advance updated successfully",
          variant: "default",
        });

        // Clear update and delete lists
        setFormData((prev) => ({
          ...prev,
          update_files: [],
          delete_files: [],
        }));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setUploading(false);
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
              onClick={() => handleDownload(file.id, fileName)}
              className="h-7 w-7 p-0"
            >
              <Download className="h-3 w-3" />
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

  console.log("fomr errors", formErrors);
  const isReadOnly = data && !editData;
  const showSubmit = !data && !editData;
  const hasFiles =
    formData.files.length > 0 || formData.update_files.length > 0;
  const allFiles = [...formData.files, ...formData.update_files];

  return (
    <Card className="w-full">
      <Separator />

      <form onSubmit={handleSubmit}>
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

              {/* Advance Type */}
              <FormField
                label="Advance Type*"
                error={formErrors.other_advance_type}
                required
              >
                <Select
                  value={formData.other_advance_type}
                  onValueChange={handleSelectChange}
                  disabled={isReadOnly}
                >
                  <SelectTrigger
                    className={
                      formErrors.other_advance_type ? "border-red-500" : ""
                    }
                  >
                    <SelectValue placeholder="Select advance type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical_advance">
                      Medical Advance
                    </SelectItem>
                    <SelectItem value="study_advance">Study Advance</SelectItem>
                    <SelectItem value="official_advance">
                      Official Advance
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            {/* File Upload */}
            <div className="mt-4">
              <FormField
                label="Relevant Documents*"
                error={formErrors.file_error}
                required={!editData}
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
                          PDF, DOC, JPG, PNG (Max 5MB each)
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
              type="submit"
              size="lg"
              disabled={submitting || uploading}
              className="w-full sm:w-auto"
            >
              {submitting || uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
          {editData && (
            <Button
              type="button"
              size="lg"
              onClick={updateAdvance}
              disabled={submitting || uploading}
              className="w-full sm:w-auto"
            >
              {submitting || uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

export default OtherAdvance;
