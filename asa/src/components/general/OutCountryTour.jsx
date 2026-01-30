import React, { useState, useEffect } from "react";
import UserServices from "../services/UserServices";
import AdvanceServices from "../services/AdvanceServices";
import FileServices from "../services/FileServices";

// ShadCN UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Calendar,
  FileText,
  Upload,
  X,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Globe,
  Plane,
  Briefcase,
  Users,
  Banknote,
  Info,
  ChevronRight,
  FileCheck,
  Ticket,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TravelDetails from "./TravelDetails";
import TravelDetailsTable from "./TravelDetailsTable";

const OutCountryTour = ({
  data,
  setActiveTab,
  isDSA,
  showButtons,
  handleDialogOpen,
  edit,
}) => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [editData, setEditData] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const { toast } = useToast();

  const initialFormData = {
    firstName: "",
    middleName: "",
    lastName: "",
    date: new Date().toISOString().slice(0, 10),
    department: "",
    designation: "",
    advanceAmount: { Nu: 0, USD: 0, INR: 0, Total: { Nu: 0, INR: 0, USD: 0 } },
    totalAmount: 0,
    purpose: "",
    remark: "",
    advance_type: "ex_country_tour_advance",
    files: [],
    advance_percentage: "",
    office_order: "",
    tour_type: "",
    update_files: [],
    update_tickets: [],
    delete_files: [],
    delete_tickets: [],
    additional_expense: "",
    tickets: [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setInitialLoading(true);
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
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [data]);

  const totalAmount = () => {
    let Nu = 0;
    let INR = 0;
    let USD = formData?.additional_expense == 200 ? 200 : 0;

    rows.forEach((row) => {
      if (row.currency == "Nu") {
        Nu += parseFloat(row.rate);
      }
      if (row.currency == "INR") {
        INR += parseFloat(row.rate);
      }
      if (row.currency == "USD") {
        USD += parseFloat(row.rate);
      }
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      advanceAmount: {
        Nu: Nu * 0,
        INR: INR * (parseFloat(formData.advance_percentage) || 0),
        USD: USD * (parseFloat(formData.advance_percentage) || 0),
        Total: { Nu, INR, USD },
      },
    }));
  };

  const handleFileChange = async (event, key) => {
    const newFiles = Array.from(event.target.files);

    if (newFiles.length === 0) return;

    // Check file size (max 10MB per file)
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

    setFormData((prevFormData) => ({
      ...prevFormData,
      [edit ? `update_${key}` : key]: [
        ...(prevFormData[edit ? `update_${key}` : key] || []),
        ...newFiles,
      ],
    }));

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      file_error: "",
    }));
  };

  const removeFile = (indexToRemove, key) => {
    setFormData((prevFormData) => {
      if (edit) {
        const deleteKey = key === "files" ? "delete_files" : "delete_tickets";

        return {
          ...prevFormData,
          [key]: prevFormData[key].filter((file) => file.id !== indexToRemove),
          [deleteKey]: [...(prevFormData[deleteKey] || []), indexToRemove],
        };
      } else {
        return {
          ...prevFormData,
          [key]: prevFormData[key].filter(
            (_, index) => index !== indexToRemove,
          ),
        };
      }
    });
  };

  const removeUpdateFile = (indexToRemove, key) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [`update_${key}`]: prevFormData[`update_${key}`].filter(
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
    const { name, value, type, checked } = e.target;
    const keys = name.split(".");

    setFormData((prevFormData) => {
      const newValue = type === "checkbox" ? (checked ? value : 0) : value;

      if (keys.length === 1) {
        return {
          ...prevFormData,
          [name]: newValue,
        };
      } else {
        return {
          ...prevFormData,
          [keys[0]]: {
            ...prevFormData[keys[0]],
            [keys[1]]: newValue,
          },
        };
      }
    });

    // Clear errors for the field being edited
    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (name === "office_order") delete newErrors.office_order_error;
      if (name === "tour_type") delete newErrors.tour_type_error;
      if (name === "remark") delete newErrors.remark_error;
      return newErrors;
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({ ...prev, [`${name}_error`]: undefined }));
  };

  const handleCheckboxChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name] === value ? "" : value,
    }));
  };

  const fetchUserDetails = async () => {
    try {
      const response = await UserServices.showDetail(
        data ? data.user.id : null,
      );
      if (response && response.status === 200) {
        setUser(response.data);
        updateFormDataWithUserName(response.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      throw error;
    }
  };

  const updateFormDataWithUserName = (userData) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
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
      tickets: apiData?.tickets || [],
      tour_type: apiData.tour_type || "",
      advance_percentage: apiData.advance_percentage || "",
      additional_expense: apiData.additional_expense || "",
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateTravelItinerary = () => {
    let errors = {};
    setFormErrors((prev) => ({
      ...prev,
      itinerary_error: "",
    }));

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

          // Upload new tickets if isDSA
          if (isDSA && formData.update_tickets.length > 0) {
            await FileServices.create(
              advanceResponse.id,
              formData.update_tickets,
              "tickets",
            );
          }

          // Delete removed files
          if (formData.delete_files.length > 0) {
            await FileServices.deleteFile(
              advanceResponse.id,
              formData.delete_files,
            );
          }

          // Delete removed tickets if isDSA
          if (isDSA && formData.delete_tickets.length > 0) {
            await FileServices.deleteFile(
              advanceResponse.id,
              formData.delete_tickets,
              "tickets",
            );
          }

          toast({
            title: "Success",
            description: "Advance has been successfully updated.",
            variant: "default",
          });

          setFormData((prev) => ({
            ...prev,
            delete_files: initialFormData.delete_files,
            delete_tickets: initialFormData.delete_tickets,
            update_files: [],
            update_tickets: [],
          }));
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
    setFormErrors({});
  };

  const haltCount = (index) => {
    let count = 0;
    if (index || index === 0) {
      for (let i = 0; i < index; i++) {
        if (rows[i]?.stop_at) {
          count++;
        }
      }
    } else {
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].stop_at) {
          count++;
        }
      }
    }
    return count;
  };

  const handleTravelItinerary = (newData) => {
    setFormErrors((prev) => ({
      ...prev,
      itinerary_error: "",
    }));

    const dataToCheck = editData || newData;
    const currentHaltCount = haltCount();

    if (dataToCheck.stop_at && currentHaltCount > 2) {
      setFormErrors((prev) => ({
        ...prev,
        itinerary_error:
          "Travel itinerary dates are not valid. User can only add 2 stop overs.",
      }));
    } else {
      if (editData) {
        setRows(rows.map((row) => (row.id === newData.id ? newData : row)));
        setEditData(null);
        setEditIndex(null);
      } else {
        setRows([...rows, { id: rows.length + 1, ...newData }]);
      }
    }

    handleDialogClose();
  };

  const removeRow = (id) => {
    const newRows = rows.filter((row) => row.id !== id);
    setRows(newRows);
    setEditData(null);
    setEditIndex(null);
  };

  const editRow = (rowData, index) => {
    setEditData(rowData);
    setEditIndex(index);
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditData(null);
    setEditIndex(null);
  };

  useEffect(() => {
    totalAmount();
  }, [rows, formData.advance_percentage, formData.additional_expense]);

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
  const FileDisplay = ({
    file,
    index,
    isExisting = false,
    onRemove,
    onDownload,
  }) => {
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
          {isExisting && onDownload && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDownload(file.id, fileName)}
              className="h-7 w-7 p-0"
            >
              <Download className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  };

  // Currency Display Component
  const CurrencyDisplay = ({ currency, amount }) => (
    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="font-mono">
          {currency}
        </Badge>
        <span className="text-sm font-medium">
          {currency === "Nu" ? "Bhutanese" : currency} Amount
        </span>
      </div>
      <span className="text-lg font-bold">
        {parseFloat(amount || 0).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    </div>
  );

  if (initialLoading) {
    return <FormSkeleton />;
  }

  const isReadOnly = data && !edit;
  const showSubmit = !data && !edit;
  const isManagement = formData.department === "Management";

  return (
    <Card className="w-full">
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
              <DisplayField
                label="Application Date"
                value={formData.date}
                icon={Calendar}
              />
              <DisplayField label="Department" value={formData.department} />
              <DisplayField label="Designation" value={formData.designation} />
            </div>
          </div>

          <Separator />

          {/* Tour Details Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-purple-600" />
              Tour Details
            </h3>

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
                    <SelectItem value="training">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Training
                      </div>
                    </SelectItem>
                    <SelectItem value="meeting/seminar">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Meeting/Seminar
                      </div>
                    </SelectItem>
                    <SelectItem value="remittance">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4" />
                        Cash Consignment (Remittance)
                      </div>
                    </SelectItem>
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
                      index={file.id || index}
                      isExisting={true}
                      onRemove={() => removeFile(file.id, "files")}
                      onDownload={handleDownload}
                    />
                  ))}

                  {/* New/Update Files */}
                  {formData.update_files.map((file, index) => (
                    <FileDisplay
                      key={`update-${index}`}
                      file={file}
                      index={index}
                      isExisting={false}
                      onRemove={() => removeUpdateFile(index, "files")}
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
                        onChange={(e) => handleFileChange(e, "files")}
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
                  <h4 className="text-lg font-semibold flex items-center gap-2">
                    <Plane className="h-5 w-5 text-green-600" />
                    Travel Itinerary
                  </h4>
                  <div className="mt-1 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">
                        International Tour Tip:
                      </span>{" "}
                      Add each travel segment in chronological order.
                      <span className="block mt-1">
                        •{" "}
                        <Badge variant="outline" className="text-xs mr-1">
                          Travel
                        </Badge>
                        : International flights/transit •{" "}
                        <Badge variant="warning" className="text-xs mr-1 ml-2">
                          Halt
                        </Badge>
                        : Stay for training/conference •{" "}
                        <Badge
                          variant="secondary"
                          className="text-xs mr-1 ml-2"
                        >
                          Stop Over
                        </Badge>
                        : Transit stops between flights • Different currencies
                        may apply to different segments
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
                type="outCountry"
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

            {/* Management Additional Expense */}
            {isManagement && (
              <div className="mt-4">
                <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-100 p-2 rounded-full">
                        <Briefcase className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-semibold text-amber-800">
                              Management Additional Expense
                            </h5>
                            <p className="text-sm text-amber-600">
                              Local conveyance and communication expenses
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="additional_expense"
                              checked={
                                parseFloat(formData.additional_expense) === 200
                              }
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  "additional_expense",
                                  checked ? "200" : "",
                                )
                              }
                              disabled={isReadOnly}
                            />
                            <Label
                              htmlFor="additional_expense"
                              className="font-bold text-lg text-amber-700"
                            >
                              200 USD
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Travel Documents for DSA */}
            {isDSA && (
              <div className="mt-4">
                <FormField
                  label="Boarding Pass & Travel Documents"
                  error={formErrors.file_error}
                >
                  <div className="space-y-3">
                    {/* Existing Tickets */}
                    {formData.tickets.map((file, index) => (
                      <FileDisplay
                        key={file.id || index}
                        file={file}
                        index={file.id || index}
                        isExisting={true}
                        onRemove={() => removeFile(file.id, "tickets")}
                        onDownload={handleDownload}
                      />
                    ))}

                    {/* New/Update Tickets */}
                    {formData.update_tickets.map((file, index) => (
                      <FileDisplay
                        key={`update-ticket-${index}`}
                        file={file}
                        index={index}
                        isExisting={false}
                        onRemove={() => removeUpdateFile(index, "tickets")}
                      />
                    ))}

                    {/* Upload Button for Tickets */}
                    {!isReadOnly && (
                      <div className="border-2 border-dashed border-green-200 rounded-lg p-4 bg-green-50">
                        <Label
                          htmlFor="ticket-upload"
                          className="flex flex-col items-center justify-center cursor-pointer hover:bg-green-100/50 rounded-lg p-4 transition-colors"
                        >
                          <Ticket className="h-8 w-8 text-green-600 mb-2" />
                          <span className="text-sm font-medium text-green-800">
                            Upload Boarding Pass/Tickets
                          </span>
                          <span className="text-xs text-green-600 mt-1">
                            Required for DSA claims (Max 10MB each)
                          </span>
                        </Label>
                        <Input
                          id="ticket-upload"
                          type="file"
                          multiple
                          onChange={(e) => handleFileChange(e, "tickets")}
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </div>
                    )}
                  </div>
                </FormField>
              </div>
            )}

            {/* Amount Summary */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Banknote className="h-5 w-5 text-green-600" />
                Amount Summary
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CurrencyDisplay
                  currency="Nu"
                  amount={formData.advanceAmount?.Total?.Nu || 0}
                />
                <CurrencyDisplay
                  currency="INR"
                  amount={formData.advanceAmount?.Total?.INR || 0}
                />
                <CurrencyDisplay
                  currency="USD"
                  amount={formData.advanceAmount?.Total?.USD || 0}
                />
              </div>

              {/* Advance Claim Options */}
              {!isDSA && (
                <div className="mt-6">
                  <h5 className="font-semibold mb-3">Advance Claim Options</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card
                      className={`border-2 ${
                        parseFloat(formData.advance_percentage) === 1.0
                          ? "border-green-500 bg-green-50"
                          : ""
                      }`}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="advance_full"
                            checked={
                              parseFloat(formData.advance_percentage) === 1.0
                            }
                            onCheckedChange={() =>
                              handleCheckboxChange("advance_percentage", "1.0")
                            }
                            disabled={isReadOnly}
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor="advance_full"
                              className="font-medium cursor-pointer"
                            >
                              Request Full Advance
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              Receive advance payment before tour
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card
                      className={`border-2 ${
                        parseFloat(formData.advance_percentage) === 0
                          ? "border-blue-500 bg-blue-50"
                          : ""
                      }`}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="advance_none"
                            checked={
                              parseFloat(formData.advance_percentage) === 0
                            }
                            onCheckedChange={() =>
                              handleCheckboxChange("advance_percentage", "0")
                            }
                            disabled={isReadOnly}
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor="advance_none"
                              className="font-medium cursor-pointer"
                            >
                              Claim DSA After Tour
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              Submit claims after completing the tour
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

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
                      className={
                        formErrors.remark_error ? "border-red-500" : ""
                      }
                      placeholder="Enter remarks for this international tour advance"
                    />
                  </FormField>
                </div>
              )}
            </div>

            {/* Voucher Number */}
            {data?.vch_no &&
              (data.status === "dispatched" || data.status === "closed") && (
                <div className="mt-4">
                  <DisplayField
                    label="Voucher No (ICBS)"
                    value={data.vch_no}
                    icon={FileCheck}
                  />
                </div>
              )}

            {/* Validation Summary */}
            {Object.keys(formErrors).length > 0 && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please fix the errors above before submitting
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

      {/* Travel Details Dialog */}
      {showDialog && (
        <TravelDetails
          existingData={data?.travel_itinerary}
          isOpen={showDialog}
          onClose={handleDialogClose}
          onSave={handleTravelItinerary}
          initialData={editData}
          type="outCountry"
          haltCount={haltCount}
          edit={edit}
          username={user?.username}
          outCountry={true}
          editIndex={editIndex}
          department={formData.department}
        />
      )}
    </Card>
  );
};

export default OutCountryTour;
