import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Calendar,
  Clock,
  MapPin,
  Navigation,
  Car,
  Train,
  Plane,
  Bed,
  Home,
  Percent,
  Calculator,
  Route,
  Building,
  Globe,
  ChevronRight,
} from "lucide-react";
import { dzongkhags } from "../../components/datas/dzongkhag_lists";
import RateServices from "../services/RateServices";

const TravelDetails = ({
  existingData,
  isOpen,
  onClose,
  onSave,
  initialData,
  type,
  haltCount,
  edit,
  username,
  outCountry,
  editIndex,
  department,
}) => {
  const [haltChecked, setHaltChecked] = useState(
    existingData?.halt_at || initialData?.halt_at ? true : false
  );
  const [stopChecked, setStopChecked] = useState(
    existingData?.stop_at || initialData?.stop_at ? true : false
  );
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [tourType, setTourType] = useState(type);
  const [dropDown, setDropDown] = useState([]);
  const [calculatedRate, setCalculatedRate] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showCalculationError, setShowCalculationError] = useState(false);
  
  const [data, setData] = useState(
    initialData || {
      start_date: "",
      end_date: "",
      from: "",
      from_place: "",
      to: "",
      to_place: "",
      mode: "",
      mileage: "",
      rate: "",
      currency: "",
      halt_at: "",
      dsa_percentage: "",
      days: "",
      stop_at: "",
      return: false,
    }
  );
  const halt_count = haltCount(editIndex);

  const formatDateForInput = (date) => {
    if (!date) return "";

    let d;
    if (typeof date === "string" && date.endsWith("Z")) {
      d = new Date(date);
    } else {
      d = new Date(date + "Z");
    }

    if (isNaN(d.getTime())) {
      return "";
    }

    const year = d.getUTCFullYear();
    const month = ("0" + (d.getUTCMonth() + 1)).slice(-2);
    const day = ("0" + d.getUTCDate()).slice(-2);
    const hours = ("0" + d.getUTCHours()).slice(-2);
    const minutes = ("0" + d.getUTCMinutes()).slice(-2);

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getNumberOfDays = (start_date, end_date) => {
    const start = new Date(start_date);
    const end = new Date(end_date);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return Math.ceil(differenceInDays);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "start_date" || name === "end_date") {
      const { start_date, end_date } = { ...data, [name]: value };
      if (start_date && end_date) {
        if (new Date(start_date) >= new Date(end_date)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            end_date: "End date must be greater than start date",
          }));
        } else {
          delete errors.end_date
          const days = getNumberOfDays(start_date, end_date);
          setData((prevData) => ({ ...prevData, days: days }));
        }
      }
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      delete errors.name
    }
    
    // Clear calculation error when user makes changes
    if (showCalculationError) {
      setShowCalculationError(false);
    }
  };

  const handleSelectChange = (name, value) => {
    setData((prevData) => ({ ...prevData, [name]: value }));
    
    // Clear error when user makes a selection
    if (errors[name]) {
      delete errors.name
    }
    
    // Clear mileage when mode changes from Private Vehicle
    if (name === "mode" && value !== "Private Vehicle") {
      setData(prev => ({ ...prev, mileage: "" }));
      if (errors.mileage) {
        delete errors.mileage
      }
    }
    
    // Clear calculation error when user makes changes
    if (showCalculationError) {
      setShowCalculationError(false);
    }
  };

  const handleHaltCheckChange = (checked) => {
    setHaltChecked(checked);
    if (checked) {
      // Clear all route-related fields when halt is checked
      setData(prevData => ({
        ...prevData,
        from: "",
        from_place: "",
        to: "",
        to_place: "",
        stop_at: "",
        mode: "",
        mileage: "",
        halt_at: "",
        return: false,
      }));

      delete errors.from
      delete errors.from_place
      delete errors.to
      delete errors.to_place
      delete errors.stop_at
      delete errors.mode
      delete errors.mileage
      delete errors.halt_at
      setStopChecked(false);
    }
  };

  const handleReturnCheckChange = (checked) => {
    setData(prevData => ({
      ...prevData,
      halt_at: "",
      stop_at: "",
      return: checked,
    }));

    delete errors.halt_at
    delete errors.stop_at
    setHaltChecked(false);
    setStopChecked(false);
  };

  const handleStopOverCheckChange = (checked) => {
    setStopChecked(checked);
    if (checked) {
      setData(prevData => ({
        ...prevData,
        return: false,
        stop_at: "",
      }));
      delete errors.return
      delete errors.stop_at
      setHaltChecked(false);
    } else {
      setData(prevData => ({
        ...prevData,
        stop_at: "",
      }));
      delete errors.stop_at
    }
  };

  const validateData = (showAllErrors = false) => {
    const {
      start_date,
      end_date,
      from,
      to,
      mode,
      mileage,
      halt_at,
      stop_at,
      dsa_percentage,
      from_place,
      to_place,
    } = data;
    const newErrors = {};

    if (!start_date) newErrors.start_date = "Start date is required";
    if (!end_date) newErrors.end_date = "End date is required";
    if (!dsa_percentage)
      newErrors.dsa_percentage = "DSA percentage is required";

    if (mode === "Private Vehicle" && !mileage) {
      newErrors.mileage = "Mileage is required for private vehicle";
    }

    // Only validate route fields if not on halt journey
    if (!haltChecked) {
      if (!from) newErrors.from = "From location is required";
      if (!to) newErrors.to = "To location is required";
      if (!mode) newErrors.mode = "Mode of travel is required";
    }

    if (haltChecked && !halt_at) {
      newErrors.halt_at = "Halt location is required when halt is checked";
    }

    if (stopChecked && !stop_at) {
      newErrors.stop_at =
        "Stop Over location is required when stop over is checked";
    }

    // Only validate place details for international travel when not on halt journey
    if (outCountry && !haltChecked) {
      if (!from_place) newErrors.from_place = "From Place is required";
      if (!to_place) newErrors.to_place = "To Place is required";
    }

    if (showAllErrors) {
      setErrors(newErrors);
    }

    return Object.keys(newErrors).length === 0;
  };

  const fetchCountry = async () => {
    try {
      const response = await RateServices.getCountryTo();
      if (response && response.status === 200) {
        setDropDown(response.data);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
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
    stop_at
  ) => {
    try {
      let response;
      let stop_response;

      if (mode === "Private Vehicle" || tourType === "inCountry") {
        const rateType = tourType === "inCountry" ? from : "Other";
        if (mode === "Private Vehicle") {
          response = await RateServices.getRate(
            rateType,
            to,
            edit ? username : ""
          );
          const rate =
            16 * mileage +
            eval(`${dsaPercentage} * ${days} * ${response.rate}`);

          return {
            rate,
            currency: "Nu",
          };
        } else {
          response = await RateServices.getRate(from, to, edit ? username : "");
          const rate = eval(`${dsaPercentage} * ${days} * ${response.rate}`);
          return {
            rate,
            currency: "Nu",
          };
        }
      } else if (tourType === "outCountry") {
        if (stop_at) {
          stop_response = await RateServices.getStopOverRate(
            halt_count + 1,
            stop_at
          );
        }

        if (
          (from === "India" && to === "India") ||
          (from === "Bhutan" && to === "Bhutan")
        ) {
          response = await RateServices.getRate(from, to, edit ? username : "");
        } else if (
          (from === "Bhutan" && to === "India") ||
          (from === "India" && to === "Bhutan")
        ) {
          response = await RateServices.getRate(
            "Other",
            to,
            edit ? username : ""
          );
        } else if (
          (from != "India" && to === "Bhutan") ||
          (from != "India" && to === "India")
        ) {
          response = await RateServices.getRate(
            "Other",
            to,
            edit ? username : ""
          );
        } else if (halt_at) {
          if (halt_at == "India" || halt_at == "Bhutan") {
            response = await RateServices.getRate("Other", halt_at, edit ? username : "");
          } else {
            response = await RateServices.getThirdCountryRate(halt_at);
          }
        } else {
          response = await RateServices.getThirdCountryRate(to);
        }
      }

      if (response || stop_response) {
        if (response && stop_response) {
          if (response.currency != stop_response.currency) { 
            throw new Error("Currency mismatch between response and stop_response.");
          }
        }
        return {
          rate:
            eval(`${dsaPercentage} * ${days} * ${response.rate}`) +
            (stop_response ? stop_response.rate : 0),
          currency: response.currency,
        };
      }
    } catch (error) {
      throw error;
    }
  };

  const calculateRate = async () => {
    // First validate all fields and show errors
    const isValid = validateData(true);
    if (!isValid) {
      setShowCalculationError(true);
      return;
    }

    setIsCalculating(true);
    try {
      const { from, to, dsa_percentage, days, mode, mileage, halt_at, stop_at } = data;
      const destination = type === "outCountry" ? { from, to } : { from: "Bhutan", to: "Bhutan" };

      const rateData = await fetchRate(
        destination.from,
        destination.to,
        dsa_percentage,
        days,
        mode,
        mileage,
        halt_at,
        stop_at
      );

      setCalculatedRate(rateData);
      setShowCalculationError(false);
    } catch (error) {
      console.error("Error calculating rate:", error);
      setErrors(prev => ({
        ...prev,
        calculation: "Failed to calculate rate. Please check your inputs."
      }));
      setShowCalculationError(true);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = async () => {
    const isValid = validateData(true);

    if (!isValid) return;

    try {
      const { from, to, dsa_percentage, days, mode, mileage, halt_at, stop_at } = data;
      const destination = type === "outCountry" ? { from, to } : { from: "Bhutan", to: "Bhutan" };

      let rateData;
      if (!calculatedRate) {
        rateData = await fetchRate(
          destination.from,
          destination.to,
          dsa_percentage,
          days,
          mode,
          mileage,
          halt_at,
          stop_at
        );
      } else {
        rateData = calculatedRate;
      }

      onSave({ ...data, ...rateData });
      setData({
        start_date: "",
        end_date: "",
        from: "",
        from_place: "",
        to: "",
        to_place: "",
        mode: "",
        mileage: "",
        rate: "",
        currency: "",
        halt_at: "",
        dsa_percentage: "",
        days: "",
        stop_at: "",
        return: false,
      });
      setCalculatedRate(null);
      onClose();
    } catch (error) {
      console.error("Error while submitting:", error);
    }
  };

  useEffect(() => {
    if (initialData) {
      setData(initialData);
      if (initialData.rate) {
        setCalculatedRate({
          rate: initialData.rate,
          currency: initialData.currency
        });
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (type === "outCountry") {
      fetchCountry();
    } else if (type === "inCountry") {
      setDropDown(dzongkhags);
    }
  }, [type]);

  // Auto-calculate days when dates change
  useEffect(() => {
    if (data.start_date && data.end_date) {
      const days = getNumberOfDays(data.start_date, data.end_date);
      setData(prev => ({ ...prev, days }));
    }
  }, [data.start_date, data.end_date]);

  if (!isOpen) return null;

  const isDisabled = existingData ? (edit ? false : true) : false;
  const travelType = type === "inCountry" ? "Domestic" : "International";
  console.log("errors", errors);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {edit ? "Edit" : "Add"} Travel Details
              </DialogTitle>
              <DialogDescription>
                Configure travel itinerary for {travelType.toLowerCase()} tour
              </DialogDescription>
            </div>
            <Badge variant={travelType === "Domestic" ? "default" : "secondary"}>
              {travelType} Tour
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="route" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Route Details
            </TabsTrigger>
            <TabsTrigger value="calculation" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculation
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Date */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      Start Date & Time
                    </Label>
                    <Input
                      type="datetime-local"
                      name="start_date"
                      value={formatDateForInput(data.start_date)}
                      onChange={handleChange}
                      disabled={isDisabled}
                      className={errors.start_date ? "border-red-500" : ""}
                    />
                    {errors.start_date && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.start_date}
                      </p>
                    )}
                  </div>

                  {/* End Date */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      End Date & Time
                    </Label>
                    <Input
                      type="datetime-local"
                      name="end_date"
                      value={formatDateForInput(data.end_date)}
                      onChange={handleChange}
                      disabled={isDisabled}
                      className={errors.end_date ? "border-red-500" : ""}
                    />
                    {errors.end_date && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.end_date}
                      </p>
                    )}
                  </div>

                  {/* Duration Display */}
                  <div className="md:col-span-2">
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="font-medium text-blue-800">Duration</p>
                              <p className="text-sm text-blue-600">
                                Calculated based on selected dates
                              </p>
                            </div>
                          </div>
                          <Badge variant="default" className="text-lg px-4 py-1">
                            {data.days || 0} {data.days === 1 ? 'Day' : 'Days'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Travel Options */}
                  <div className="md:col-span-2 space-y-4">
                    <Label className="text-base font-medium">Travel Options</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <Checkbox
                          id="halt"
                          checked={haltChecked}
                          onCheckedChange={handleHaltCheckChange}
                          disabled={isDisabled}
                        />
                        <Label htmlFor="halt" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Bed className="h-4 w-4 text-amber-600" />
                          <div>
                            <p className="font-medium">Halt Journey</p>
                            <p className="text-xs text-muted-foreground">Stay at a location</p>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <Checkbox
                          id="return"
                          checked={data.return}
                          onCheckedChange={handleReturnCheckChange}
                          disabled={isDisabled}
                        />
                        <Label htmlFor="return" className="flex items-center gap-2 cursor-pointer flex-1">
                          <Home className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="font-medium">Return Same Day</p>
                            <p className="text-xs text-muted-foreground">Complete trip in one day</p>
                          </div>
                        </Label>
                      </div>

                      {type === "outCountry" && (
                        <div className="flex items-center space-x-2 p-3 border rounded-lg">
                          <Checkbox
                            id="stop_over"
                            checked={stopChecked}
                            onCheckedChange={handleStopOverCheckChange}
                            disabled={isDisabled}
                          />
                          <Label htmlFor="stop_over" className="flex items-center gap-2 cursor-pointer flex-1">
                            <Navigation className="h-4 w-4 text-purple-600" />
                            <div>
                              <p className="font-medium">Stop Over</p>
                              <p className="text-xs text-muted-foreground">Brief stop during travel</p>
                            </div>
                          </Label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Route Details Tab */}
          <TabsContent value="route" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Only show From/To locations when NOT on halt journey */}
                  {!haltChecked && (
                    <>
                      {/* From Location */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          {outCountry ? <Globe className="h-4 w-4" /> : <Building className="h-4 w-4" />}
                          {outCountry ? "From Country" : "From Location"}
                        </Label>
                        <Select
                          value={data.from}
                          onValueChange={(value) => handleSelectChange("from", value)}
                          disabled={isDisabled}
                        >
                          <SelectTrigger className={errors.from ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select starting point" />
                          </SelectTrigger>
                          <SelectContent>
                            {dropDown.map((item, index) => (
                              <SelectItem key={index} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.from && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.from}
                          </p>
                        )}
                      </div>

                      {/* To Location */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          {outCountry ? <Globe className="h-4 w-4" /> : <Building className="h-4 w-4" />}
                          {outCountry ? "To Country" : "To Location"}
                        </Label>
                        <Select
                          value={data.to}
                          onValueChange={(value) => handleSelectChange("to", value)}
                          disabled={isDisabled}
                        >
                          <SelectTrigger className={errors.to ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select destination" />
                          </SelectTrigger>
                          <SelectContent>
                            {dropDown.map((item, index) => (
                              <SelectItem key={index} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.to && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.to}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Halt Location - Only shown when Halt is checked */}
                  {haltChecked && (
                    <div className="md:col-span-2 space-y-2">
                      <Label className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-amber-600" />
                        Halt Location
                      </Label>
                      <Select
                        value={data.halt_at}
                        onValueChange={(value) => handleSelectChange("halt_at", value)}
                        disabled={isDisabled}
                      >
                        <SelectTrigger className={errors.halt_at ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select where to halt" />
                        </SelectTrigger>
                        <SelectContent>
                          {dropDown.map((item, index) => (
                            <SelectItem key={index} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.halt_at && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.halt_at}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Stop Over Location - Only shown when Stop Over is checked */}
                  {stopChecked && type === "outCountry" && !haltChecked && (
                    <div className="md:col-span-2 space-y-2">
                      <Label className="flex items-center gap-2">
                        <Navigation className="h-4 w-4 text-purple-600" />
                        Stop Over Location
                      </Label>
                      <Select
                        value={data.stop_at}
                        onValueChange={(value) => handleSelectChange("stop_at", value)}
                        disabled={isDisabled}
                      >
                        <SelectTrigger className={errors.stop_at ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select stop over location" />
                        </SelectTrigger>
                        <SelectContent>
                          {dropDown.map((item, index) => (
                            <SelectItem key={index} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.stop_at && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.stop_at}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Place Details for International Travel - Only shown when not on Halt and outCountry */}
                  {outCountry && !haltChecked && (
                    <>
                      <div className="space-y-2">
                        <Label>From Place Details</Label>
                        <Input
                          type="text"
                          name="from_place"
                          value={data.from_place || ""}
                          onChange={handleChange}
                          disabled={isDisabled}
                          placeholder="e.g., Airport name, city district"
                          className={errors.from_place ? "border-red-500" : ""}
                        />
                        {errors.from_place && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.from_place}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>To Place Details</Label>
                        <Input
                          type="text"
                          name="to_place"
                          value={data.to_place || ""}
                          onChange={handleChange}
                          disabled={isDisabled}
                          placeholder="e.g., Hotel name, venue address"
                          className={errors.to_place ? "border-red-500" : ""}
                        />
                        {errors.to_place && (
                          <p className="text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.to_place}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Mode of Travel - Only shown when NOT on Halt journey */}
                  {!haltChecked && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Route className="h-4 w-4" />
                        Mode of Travel
                      </Label>
                      <Select
                        value={data.mode}
                        onValueChange={(value) => handleSelectChange("mode", value)}
                        disabled={isDisabled}
                      >
                        <SelectTrigger className={errors.mode ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select travel mode" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Airplane">
                            <div className="flex items-center gap-2">
                              <Plane className="h-4 w-4" />
                              Airplane
                            </div>
                          </SelectItem>
                          <SelectItem value="Train">
                            <div className="flex items-center gap-2">
                              <Train className="h-4 w-4" />
                              Train
                            </div>
                          </SelectItem>
                          <SelectItem value="Private Vehicle">
                            <div className="flex items-center gap-2">
                              <Car className="h-4 w-4" />
                              Private Vehicle
                            </div>
                          </SelectItem>
                          <SelectItem value="Pool Vehicle">
                            <div className="flex items-center gap-2">
                              <Navigation className="h-4 w-4" />
                              Pool Vehicle
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.mode && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.mode}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Mileage for Private Vehicle - Only shown when Private Vehicle is selected AND not on Halt journey */}
                  {data.mode === "Private Vehicle" && !haltChecked && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        Mileage (Kilometers)
                      </Label>
                      <Input
                        type="number"
                        name="mileage"
                        value={data.mileage || ""}
                        onChange={handleChange}
                        disabled={isDisabled}
                        placeholder="Enter total kilometers"
                        className={errors.mileage ? "border-red-500" : ""}
                        min="0"
                        step="0.1"
                      />
                      {errors.mileage && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.mileage}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Required for private vehicle travel (Rate: Nu. 16 per km)
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculation Tab */}
          <TabsContent value="calculation" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* DSA Percentage */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-orange-600" />
                      DSA Percentage
                    </Label>
                    <Select
                      value={data.dsa_percentage}
                      onValueChange={(value) => handleSelectChange("dsa_percentage", value)}
                      disabled={isDisabled}
                    >
                      <SelectTrigger className={errors.dsa_percentage ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select DSA percentage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">
                          <div className="flex justify-between w-full">
                            <span className="font-medium">100%</span>
                            <span className="text-muted-foreground">No meals & lodging</span>
                          </div>
                        </SelectItem>
                        {department === "Management" && type === "inCountry" && (
                          <SelectItem value="7/10">
                            <div className="flex justify-between w-full">
                              <span className="font-medium">70%</span>
                              <span className="text-muted-foreground">Lodging provided</span>
                            </div>
                          </SelectItem>
                        )}
                        {department === "Management" && type === "outCountry" && (
                          <SelectItem value="7/12">
                            <div className="flex justify-between w-full">
                              <span className="font-medium">58.33%</span>
                              <span className="text-muted-foreground">Lodging provided</span>
                            </div>
                          </SelectItem>
                        )}
                        <SelectItem value="1/2">
                          <div className="flex justify-between w-full">
                            <span className="font-medium">50%</span>
                            <span className="text-muted-foreground">Lodging provided</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="3/10">
                          <div className="flex justify-between w-full">
                            <span className="font-medium">30%</span>
                            <span className="text-muted-foreground">Both meals & lodging provided</span>
                          </div>
                        </SelectItem>
                        {type === "outCountry" && (
                          <SelectItem value="1/5">
                            <div className="flex justify-between w-full">
                              <span className="font-medium">20%</span>
                              <span className="text-muted-foreground">Partially funded</span>
                            </div>
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.dsa_percentage && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.dsa_percentage}
                      </p>
                    )}
                  </div>

                  {/* Calculation Error Alert */}
                  {showCalculationError && Object.keys(errors).length > 0 && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Please fill in all required fields before calculating. Check all tabs for missing information.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Calculate Button */}
                  <Button
                    onClick={calculateRate}
                    disabled={isCalculating || isDisabled}
                    className="w-full"
                  >
                    {isCalculating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Calculator className="mr-2 h-4 w-4" />
                        Calculate Amount
                      </>
                    )}
                  </Button>

                  {/* Calculated Amount Display */}
                  {calculatedRate && (
                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-green-800">Calculated Amount</h4>
                            <p className="text-sm text-green-600">
                              Based on your travel configuration
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-800">
                              {calculatedRate.currency} {calculatedRate.rate?.toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </div>
                            <p className="text-sm text-green-600">
                              Ready to save
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Navigation to fix errors */}
                  {showCalculationError && Object.keys(errors).length > 0 && (
                    <Card className="border-amber-200 bg-amber-50">
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <p className="font-medium text-amber-800">Missing Required Fields:</p>
                          <div className="space-y-1">
                            {errors.start_date && (
                              <div className="flex items-center gap-2 text-sm text-amber-700">
                                <ChevronRight className="h-3 w-3" />
                                <span>Start Date - </span>
                                <Button
                                  variant="link"
                                  className="p-0 h-auto text-amber-700 hover:text-amber-800"
                                  onClick={() => document.querySelector('[data-tab="basic"]').click()}
                                >
                                  Go to Basic Info
                                </Button>
                              </div>
                            )}
                            {errors.end_date && (
                              <div className="flex items-center gap-2 text-sm text-amber-700">
                                <ChevronRight className="h-3 w-3" />
                                <span>End Date - </span>
                                <Button
                                  variant="link"
                                  className="p-0 h-auto text-amber-700 hover:text-amber-800"
                                  onClick={() => document.querySelector('[data-tab="basic"]').click()}
                                >
                                  Go to Basic Info
                                </Button>
                              </div>
                            )}
                            {(errors.from || errors.to || errors.mode || errors.mileage) && (
                              <div className="flex items-center gap-2 text-sm text-amber-700">
                                <ChevronRight className="h-3 w-3" />
                                <span>Route Details - </span>
                                <Button
                                  variant="link"
                                  className="p-0 h-auto text-amber-700 hover:text-amber-800"
                                  onClick={() => document.querySelector('[data-tab="route"]').click()}
                                >
                                  Go to Route Details
                                </Button>
                              </div>
                            )}
                            {errors.halt_at && (
                              <div className="flex items-center gap-2 text-sm text-amber-700">
                                <ChevronRight className="h-3 w-3" />
                                <span>Halt Location - </span>
                                <Button
                                  variant="link"
                                  className="p-0 h-auto text-amber-700 hover:text-amber-800"
                                  onClick={() => document.querySelector('[data-tab="route"]').click()}
                                >
                                  Go to Route Details
                                </Button>
                              </div>
                            )}
                            {errors.dsa_percentage && (
                              <div className="flex items-center gap-2 text-sm text-amber-700">
                                <ChevronRight className="h-3 w-3" />
                                <span>DSA Percentage - Already on Calculation tab</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Global Error Display */}
        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fix the errors in the form before proceeding. {showCalculationError && "Click the links above to navigate to missing fields."}
              <ul className="list-disc pl-4 space-y-1">
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field} className="text-sm">
                        {error}
                      </li>
                    ))}
                  </ul>
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter className="flex gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {(!existingData || edit) && (
            <Button 
              onClick={handleSubmit} 
              disabled={isCalculating || (!calculatedRate && !initialData?.rate)}
              className="min-w-[120px]"
            >
              Save Travel Details
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TravelDetails;
