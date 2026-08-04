import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Upload,
  Plane,
  Car,
  Bus,
  Plus,
  Edit,
  Trash2,
  FileText,
  Check,
  Loader2,
  DollarSign,
  Clock,
  Route,
  FileUp,
  X,
  Building,
  Wallet,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

import ItenararyService from "../services/ItenararyService";
import RateServices from "../services/RateServices";
import AdvanceServices from "../services/AdvanceServices";
import FileServices from "../services/FileServices";
import { dzongkhags } from "../datas/dzongkhag_lists";

const DsaClaim = () => {
  const [itinararies, setItineraries] = useState([]);
  const { id } = useParams();
  const [formData, setFormData] = useState(null);
  const [dsa_amount, setDsaAmount] = useState({ Nu: 0, INR: 0, USD: 0 });
  const [countries, setCountries] = useState([]);
  const [newForm, setNewForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [advance, setAdvance] = useState(null);
  const [showButton, setShowButton] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  const [tickets, setTickets] = useState({ tickets: [], updateTickets: [] });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fundings, setFundings] = useState([]);

  // Currency helper functions
  const getCurrencySymbol = (currency) => {
    const symbols = {
      'Nu': 'Nu.',
      'INR': '₹',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
    };
    return symbols[currency] || currency || 'Nu.';
  };

  const formatCurrency = (amount, currency) => {
    if (!amount) return "N/A";
    const symbol = getCurrencySymbol(currency);
    const formattedAmount = parseFloat(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${symbol} ${formattedAmount}`;
  };

  // Initialize form data
  const initializeFormData = () => ({
    start_date: "",
    end_date: "",
    from: "",
    to: "",
    halt_at: "",
    mode: "",
    mileage: "",
    dsa_percentage: "",
    days: "",
    rate: "",
    advance_id: id,
    notes: "",
  });

  const handleRowClicked = (row) => {
    setFormData(row);
    setSelectedRow(row);
    setNewForm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchCountry = async () => {
    if (advance?.advance_type === "in_country_tour_advance") {
      setCountries(dzongkhags);
    } else if (advance?.advance_type === "ex_country_tour_advance") {
      try {
        const response = await RateServices.getCountryTo();
        if (response && response.status === 200) {
          setCountries(response.data);
        }
      } catch (error) {
        toast.error("Failed to fetch countries");
      }
    }
  };

  const calculateDsa = () => {
    let Nu = 0;
    let INR = 0;
    let USD = 0;
    
    itinararies.forEach((row) => {
      if (row.currency == "Nu") {
        Nu += parseFloat(row.rate) || 0;
      }
      if (row.currency == "INR") {
        INR += parseFloat(row.rate) || 0;
      }
      if (row.currency == "USD") {
        USD += parseFloat(row.rate) || 0;
      }
    });

    // Calculate total funding per currency
    let fundingNu = 0;
    let fundingINR = 0;
    let fundingUSD = 0;
    
    fundings.forEach((funding) => {
      const amount = parseFloat(funding.funded_amount?.amount || funding.funded_amount || 0);
      const currency = funding.funded_amount?.currency || funding.currency || "Nu";
      
      if (currency === "Nu") {
        fundingNu += amount;
      } else if (currency === "INR") {
        fundingINR += amount;
      } else if (currency === "USD") {
        fundingUSD += amount;
      }
    });

    const advancePercentage = parseFloat(advance?.advance_percentage) || 0;
    const isExCountryAdvance = advance?.advance_type === "ex_country_tour_advance";
    const advanceAmountNu = parseFloat(advance?.advance_amount?.Nu) || 0;

    // Calculate DSA amounts and subtract funding
    const dsaNu = isExCountryAdvance 
      ? Nu 
      : (Nu - advanceAmountNu);
    
    setDsaAmount({
      Nu: Math.max(0, dsaNu - fundingNu).toFixed(2),
      INR: Math.max(0, (INR * (1 - advancePercentage)) - fundingINR).toFixed(2),
      USD: Math.max(0, (USD * (1 - advancePercentage)) - fundingUSD).toFixed(2),
    });
  };

  const handleSave = async () => {
    const { isValid, errors } = validateData();
    setErrors(errors);
    if (!isValid) {
      toast.error("Please fix the errors before saving");
      return;
    }

    try {
      const { from, to, dsa_percentage, days, mode, mileage, halt_at } =
        formData;

      const rate = await fetchRate(
        from,
        to,
        dsa_percentage,
        days,
        mode,
        mileage,
        halt_at,
      );

      const updatedFormData = {
        ...formData,
        rate,
      };

      const response = await ItenararyService.updateRow(updatedFormData);
      if (response) {
        fetchItinaries();
        toast.success("Itinerary updated successfully");
        setSelectedRow(null);
      }
    } catch (error) {
      toast.error("Failed to update itinerary");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await ItenararyService.deleteRow(formData.id);

      if (response) {
        fetchItinaries();
        toast.success("Itinerary deleted successfully");
        setDeleteDialogOpen(false);
        setFormData(initializeFormData());
        setSelectedRow(null);
      }
    } catch (error) {
      toast.error("Failed to delete itinerary");
    }
  };

  const handleAddRow = async () => {
    const { isValid, errors } = validateData();
    setErrors(errors);
    if (!isValid) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const { from, to, dsa_percentage, days, mode, mileage, halt_at } =
        formData;

      const rate = await fetchRate(
        from,
        to,
        dsa_percentage,
        days,
        mode,
        mileage,
        halt_at,
      );

      const updatedFormData = {
        ...formData,
        rate,
      };

      const response = await ItenararyService.addRow(updatedFormData);
      if (response) {
        fetchItinaries();
        toast.success("New itinerary added successfully");
        setFormData(initializeFormData());
        setNewForm(false);
      }
    } catch (error) {
      toast.error("Failed to add itinerary");
    }
  };

  const handleResetForm = () => {
    setNewForm(true);
    setFormData(initializeFormData());
    setSelectedRow(null);
  };

  const getNumberOfDays = (start_date, end_date) => {
    const start = new Date(start_date);
    const end = new Date(end_date);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return Math.ceil(differenceInDays);
  };

  const validateData = () => {
    const {
      start_date,
      end_date,
      from,
      to,
      mode,
      mileage,
      halt_at,
      dsa_percentage,
    } = formData || {};
    const newErrors = {};

    if (!start_date) newErrors.start_date = "Start date is required";
    if (!end_date) newErrors.end_date = "End date is required";
    if (!from) newErrors.from = "From location is required";
    if (!to) newErrors.to = "To location is required";
    if (!mode) newErrors.mode = "Mode of travel is required";
    if (!dsa_percentage)
      newErrors.dsa_percentage = "DSA percentage is required";

    if (mode === "Private Vehicle" && !mileage) {
      newErrors.mileage = "Mileage is required for private vehicle";
    }

    if (start_date && end_date) {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);

      if (endDate <= startDate) {
        newErrors.end_date = "End date must be greater than start date";
      }
    }

    if (halt_at == "on") {
      newErrors.halt_at = "Halt location is required when halt is checked";
    }

    if (Object.keys(newErrors).length === 0) {
      return { isValid: true, errors: {} };
    }

    return { isValid: false, errors: newErrors };
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === "start_date" || name === "end_date") {
      const { start_date, end_date } = { ...formData, [name]: value };
      if (start_date && end_date) {
        if (new Date(start_date) >= new Date(end_date)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            end_date: "End date must be greater than start date",
          }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, end_date: "" }));
          const days = getNumberOfDays(start_date, end_date);
          setFormData((prevData) => ({ ...prevData, days: days }));
        }
      }
    }
  };

  const handleCheckboxChange = (name, checked) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked ? "on" : "",
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    const hours = ("0" + d.getHours()).slice(-2);
    const minutes = ("0" + d.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const formatDisplayDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fetchItinaries = async () => {
    try {
      const response = await ItenararyService.getItineraries(id);

      if (response) {
        setItineraries(response);
        if (response.length > 0 && !selectedRow) {
          setFormData(response[0]);
          setSelectedRow(response[0]);
        }
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Failed to fetch itineraries");
      setIsLoading(false);
    }
  };

  const fetchAdvance = async () => {
    try {
      const response = await AdvanceServices.showDetail(id);
      if (response) {
        setAdvance(response.data);
        // Set fundings from the response
        if (response.data.fundings) {
          setFundings(response.data.fundings);
        }
      }
    } catch (error) {
      toast.error("Failed to fetch advance details");
    }
  };

  const fetchRate = async (
    from,
    to,
    dsaPercentage,
    days,
    mode,
    mileage,
    halt_at,
    type,
  ) => {
    try {
      if (mode === "Private Vehicle") {
        return eval(dsaPercentage) * 16 * parseFloat(mileage);
      }

      let response;
      if (advance.advance_type === "in_country_tour_advance") {
        response = await RateServices.getRate("Bhutan", "Bhutan");
      } else if (advance.advance_type === "ex_country_tour_advance") {
        if (halt_at) {
          response = await RateServices.getStopOverRate(
            halt_count + 1,
            halt_at,
          );
        } else if (
          (from === "India" && to === "India") ||
          (from === "Bhutan" && to === "Bhutan")
        ) {
          response = await RateServices.getRate(from, to);
        } else if (
          (from === "Bhutan" && to === "India") ||
          (from === "India" && to === "Bhutan")
        ) {
          response = await RateServices.getRate("Other", to);
        } else if (
          (from != "India" && to === "Bhutan") ||
          (from != "India" && to === "India")
        ) {
          response = await RateServices.getRate("Other", to);
        } else {
          response = await RateServices.getThirdCountryRate(to);
        }
      }

      if (response) {
        return eval(dsaPercentage) * days * response.rate;
      }
    } catch (error) {
      throw error;
    }
  };

  const checkTicket = () => {
    let errors = {};

    if (tickets.tickets.length <= 0) {
      errors.file_error = "Please upload relevant boarding pass of the travel.";
    }
    setFormErrors((prevErrors) => ({ ...prevErrors, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const handleClaim = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    const isInternational = advance?.advance_type === "ex_country_tour_advance";
    const hasValidFiles = checkTicket();
    
    if (isInternational && !hasValidFiles) {
      toast.error("Please upload required travel documents before submitting");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await AdvanceServices.claimDsa(id, dsa_amount);
      if (response) {
        if (tickets.tickets.length > 0) {
          const fileResponse = await FileServices.create(
            response.id,
            tickets.tickets,
            "tickets",
          );
          if (fileResponse?.status !== 201) {
            toast.error("File upload failed");
            setIsSubmitting(false);
            return;
          }
        }
        toast.success("DSA Claimed Successfully");
        setShowButton(false);
        setIsSubmitting(false);
      } else {
        toast.error("DSA claim failed");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error("An error occurred while claiming the DSA.");
      setIsSubmitting(false);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (event) => {
    const newFiles = Array.from(event.target.files);
    setIsUploading(true);

    for (let i = 0; i <= 100; i += 10) {
      setTimeout(() => setUploadProgress(i), i * 50);
    }

    setTimeout(() => {
      setTickets((prevFormData) => ({
        ...prevFormData,
        tickets: [...prevFormData.tickets, ...newFiles],
      }));

      setFormErrors((prevErrors) => ({
        ...prevErrors,
        file_error: "",
      }));

      setIsUploading(false);
      setUploadProgress(0);
      toast.success(`${newFiles.length} file(s) uploaded successfully`);
    }, 1000);
  };

  const removeFile = (indexToRemove) => {
    setTickets((prevFormData) => ({
      ...prevFormData,
      tickets: prevFormData.tickets.filter(
        (_, index) => index !== indexToRemove,
      ),
    }));
    toast.info("File removed");
  };

  const removeUpdateFile = (indexToRemove) => {
    setTickets((prevFormData) => ({
      ...prevFormData,
      updateTickets: prevFormData.updateTickets.filter(
        (_, index) => index !== indexToRemove,
      ),
    }));
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case "Airplane":
        return <Plane className="h-4 w-4" />;
      case "Bus":
        return <Bus className="h-4 w-4" />;
      case "Private Vehicle":
      case "Pool Vehicle":
        return <Car className="h-4 w-4" />;
      default:
        return <Route className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    fetchItinaries();
    fetchAdvance();
  }, []);

  useEffect(() => {
    fetchCountry();
  }, [advance]);

  useEffect(() => {
    calculateDsa();
  }, [advance, itinararies, fundings]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-1 space-y-4">

      {advance && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">Advance Amount Taken</p>
                  <p className="text-sm text-amber-600">
                    This amount will be deducted from your DSA claim
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-amber-900">
                  {advance?.advance_amount?.Nu && parseFloat(advance.advance_amount.Nu) > 0 && (
                    <span>{formatCurrency(advance.advance_amount.Nu, "Nu")}</span>
                  )}
                  {advance?.advance_amount?.INR && parseFloat(advance.advance_amount.INR) > 0 && (
                    <span className="ml-2">
                      + {formatCurrency(advance.advance_amount.INR, "INR")}
                    </span>
                  )}
                  {advance?.advance_amount?.USD && parseFloat(advance.advance_amount.USD) > 0 && (
                    <span className="ml-2">
                      + {formatCurrency(advance.advance_amount.USD, "USD")}
                    </span>
                  )}
                  {(!advance?.advance_amount?.Nu || parseFloat(advance.advance_amount.Nu) === 0) &&
                  (!advance?.advance_amount?.INR || parseFloat(advance.advance_amount.INR) === 0) &&
                  (!advance?.advance_amount?.USD || parseFloat(advance.advance_amount.USD) === 0) && (
                    <span>{formatCurrency(0, "Nu")}</span>
                  )}
                </p>
                <p className="text-xs text-amber-600">Deducted from total DSA</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="h-5 w-5" />
            Travel Itineraries ({itinararies.length})
          </CardTitle>
          <CardDescription>
            Click on any row to edit the details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {itinararies.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <Route className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Itineraries Added
              </h3>
              <p className="text-muted-foreground mb-4">
                Add your first travel itinerary to calculate DSA
              </p>
              <Button onClick={handleResetForm} className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Itinerary
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Date Range</TableHead>
                    <TableHead>From → To</TableHead>
                    <TableHead>Travel Mode</TableHead>
                    <TableHead>DSA %</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itinararies.map((item, index) => (
                    <TableRow
                      key={item.id || index}
                      className={`cursor-pointer hover:bg-muted/50 ${
                        selectedRow?.id === item.id ? "bg-primary/5" : ""
                      }`}
                      onClick={() => handleRowClicked(item)}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {formatDisplayDate(item.start_date)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            to {formatDisplayDate(item.end_date)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-normal">
                            {item.from}
                          </Badge>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <Badge variant="outline" className="font-normal">
                            {item.to}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getModeIcon(item.mode)}
                          <span>{item.mode}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.dsa_percentage === "100"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {(eval(item.dsa_percentage) * 100).toFixed(2)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{item.days} days</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <div className="flex items-center justify-end gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          {formatCurrency(item.rate, item.currency || "Nu")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRowClicked(item);
                                }}
                              >
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit this itinerary</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {itinararies.length > 0 && (
          <CardFooter className="border-t bg-muted/50">
            <div className="flex justify-between items-center w-full">
              <div className="text-sm text-muted-foreground">
                Showing {itinararies.length} itinerary items
              </div>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Funding Agencies Card - Read Only */}
      {fundings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Funding Agencies
            </CardTitle>
            <CardDescription>
              External funding sources contributing to this tour
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fundings.map((funding, index) => {
                const amount = funding.funded_amount?.amount || funding.funded_amount || 0;
                const currency = funding.funded_amount?.currency || funding.currency || "Nu";
                const agencyName = funding.funding_agency?.name || funding.funding_agency_name || "Unknown Agency";
                const agencyCode = funding.funding_agency?.code || funding.funding_agency_code || "";
                
                return (
                  <Card key={index} className="bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{agencyName}</p>
                          {agencyCode && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {agencyCode}
                            </Badge>
                          )}
                        </div>
                        <Badge variant="secondary" className="text-sm">
                          {formatCurrency(amount, currency)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Upload Section (for international tours only) */}
      {advance?.advance_type === "ex_country_tour_advance" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5" />
              Travel Documents
            </CardTitle>
            <CardDescription>
              Upload boarding passes and relevant travel documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Upload Area */}
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30"
              onClick={() => document.getElementById("file-upload").click()}
            >
              <Input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Upload Travel Documents
              </h3>
              <p className="text-muted-foreground mb-4">
                Click to browse or drag and drop files here
              </p>
              <p className="text-sm text-muted-foreground">
                Supported formats: PDF, JPG, PNG, DOC (Max 10MB each)
              </p>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Uploaded Files List */}
            {tickets.tickets.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">
                  Uploaded Documents ({tickets.tickets.length})
                </h4>
                <div className="space-y-2">
                  {tickets.tickets.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(2)} KB • {file.type}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error Message */}
            {formErrors.file_error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formErrors.file_error}</AlertDescription>
              </Alert>
            )}

            {/* Instructions */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Required Documents:</strong> Please upload boarding
                passes, train/bus tickets, and any other relevant travel
                documents for your international tour.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Final Claim Section */}
      <Card>
        <CardHeader>
          <CardTitle>Final DSA Claim</CardTitle>
          <CardDescription>Review and submit your DSA claim</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Amount Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Total DSA
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {formatCurrency(dsa_amount?.Nu, "Nu")}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              {advance?.advance_type === "ex_country_tour_advance" && (
                <>
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-800">
                            INR Amount
                          </p>
                          <p className="text-2xl font-bold text-blue-900">
                            {formatCurrency(dsa_amount?.INR, "INR")}
                          </p>
                        </div>
                        <span className="text-lg font-medium">₹</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-amber-800">
                            USD Amount
                          </p>
                          <p className="text-2xl font-bold text-amber-900">
                            {formatCurrency(dsa_amount?.USD, "USD")}
                          </p>
                        </div>
                        <span className="text-lg font-medium">$</span>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 p-1">
          <Alert className="w-full">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <AlertDescription className="text-sm">
                  Once submitted, your DSA claim will be sent for approval.
                  Please ensure all information is accurate before submitting.
                </AlertDescription>
              </div>

              <div className="flex-shrink-0">
                {showButton && (
                  <Button
                    onClick={handleClaim}
                    disabled={isSubmitting || loading}
                    size="lg"
                    className="gap-2 px-8 whitespace-nowrap"
                  >
                    {isSubmitting || loading ? (
                      <>
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="h-5 w-5" />
                        Submit Claim
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Alert>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Delete Itinerary
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this itinerary? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-800">
              <strong>Itinerary Details:</strong> {selectedRow?.from} →{" "}
              {selectedRow?.to} ({selectedRow?.days} days)
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Itinerary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Add missing ArrowRight component
const ArrowRight = ({ className }) => (
  <svg
    className={className}
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default DsaClaim;
