import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, X, Search, Download } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { departments } from "../datas/department_list";
import ReportServices from "../services/ReportServices";
import ReportTable from "./ReportTable";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const [errors, setErrors] = useState({});
  const [reportData, setReportData] = useState([]);
  const [totalAmount, setTotalAmount] = useState({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    report_type: "",
    start_date: "",
    end_date: "",
    advance_type: "",
    department: "",
    employee_id: "",
  });

  const advanceTypes = [
    "Salary Advance",
    "Other Advance",
    "In Country Tour Advance",
    "Ex Country Tour Advance",
    "Dsa Claim",
    "All"
  ];

  const reportTypes = [
    { value: "Individual", label: "Individual" },
    { value: "All", label: "All" }
  ];

  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDateSelect = (name, date) => {
    const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
    handleFilterChange(name, formattedDate);
  };

  const handleFilterClear = () => {
    setFilters({
      report_type: "",
      start_date: "",
      end_date: "",
      advance_type: "",
      department: "",
      employee_id: "",
    });
    setErrors({});
    setReportData([]);
    setTotalAmount({});
  };

  const validateFilters = () => {
    const newErrors = {};
    const { report_type, start_date, end_date, advance_type, department, employee_id } = filters;

    if (!report_type) {
      newErrors.report_type = "Report Type is required";
    }

    if (start_date && end_date) {
      if (new Date(start_date) >= new Date(end_date)) {
        newErrors.end_date = "End date should be later than start date";
      }
    }

    if (!start_date) {
      newErrors.start_date = "Start Date is required";
    }
    if (!end_date) {
      newErrors.end_date = "End Date is required";
    }

    if (report_type === "Individual" && !employee_id) {
      newErrors.employee_id = "Employee No. is required for Individual report";
    }

    if (report_type === "All") {
      if (!advance_type) {
        newErrors.advance_type = "Advance Type is required for All reports";
      }
      if (!department) {
        newErrors.department = "Department is required for All reports";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (validateFilters()) {
      try {
        const response = await ReportServices.get(filters);
        if (response) {
          setReportData(response.data.advances);
          setTotalAmount(response.data.total);
        }
      } catch (error) {
        toast({
        title: "Error",
        description: "Error fetching reports.",
        variant: "destructive",
      });
      }
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Advance Reports</CardTitle>
              <CardDescription>
                Generate and view advance reports with custom filters
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Filters</span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {/* Report Type */}
              <div className="space-y-2">
                <Label htmlFor="report_type" className="text-sm font-medium">
                  Report Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={filters.report_type}
                  onValueChange={(value) => handleFilterChange("report_type", value)}
                >
                  <SelectTrigger id="report_type" className={errors.report_type ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select Report Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.report_type && (
                  <p className="text-sm text-red-500">{errors.report_type}</p>
                )}
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="start_date" className="text-sm font-medium">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.start_date && "text-muted-foreground",
                        errors.start_date && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.start_date ? format(new Date(filters.start_date), "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.start_date ? new Date(filters.start_date) : undefined}
                      onSelect={(date) => handleDateSelect("start_date", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.start_date && (
                  <p className="text-sm text-red-500">{errors.start_date}</p>
                )}
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="end_date" className="text-sm font-medium">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.end_date && "text-muted-foreground",
                        errors.end_date && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.end_date ? format(new Date(filters.end_date), "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={filters.end_date ? new Date(filters.end_date) : undefined}
                      onSelect={(date) => handleDateSelect("end_date", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.end_date && (
                  <p className="text-sm text-red-500">{errors.end_date}</p>
                )}
              </div>

              {/* Conditional Fields based on Report Type */}
              {filters.report_type === "Individual" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="employee_id" className="text-sm font-medium">
                      Employee No. <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="employee_id"
                      type="number"
                      placeholder="Enter employee number"
                      value={filters.employee_id}
                      onChange={(e) => handleFilterChange("employee_id", e.target.value)}
                      className={errors.employee_id ? "border-red-500" : ""}
                    />
                    {errors.employee_id && (
                      <p className="text-sm text-red-500">{errors.employee_id}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="advance_type" className="text-sm font-medium">
                      Advance Type
                    </Label>
                    <Select
                      value={filters.advance_type}
                      onValueChange={(value) => handleFilterChange("advance_type", value)}
                    >
                      <SelectTrigger id="advance_type">
                        <SelectValue placeholder="Select Advance Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {advanceTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {filters.report_type === "All" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="advance_type" className="text-sm font-medium">
                      Advance Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={filters.advance_type}
                      onValueChange={(value) => handleFilterChange("advance_type", value)}
                    >
                      <SelectTrigger id="advance_type" className={errors.advance_type ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select Advance Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {advanceTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.advance_type && (
                      <p className="text-sm text-red-500">{errors.advance_type}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-medium">
                      Department <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={filters.department}
                      onValueChange={(value) => handleFilterChange("department", value)}
                    >
                      <SelectTrigger id="department" className={errors.department ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept, index) => (
                          <SelectItem key={index} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.department && (
                      <p className="text-sm text-red-500">{errors.department}</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleFilterClear}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear All
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Search className="h-4 w-4" />
                {loading ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Report Table */}
      {reportData.length > 0 && (
        <div className="mt-6">
          <ReportTable data={reportData} total={totalAmount} filters={filters} />
        </div>
      )}

      {/* No Data State */}
      {reportData.length === 0 && filters.report_type && filters.start_date && filters.end_date && (
        <Card className="mt-6 border-dashed">
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Filter className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Report Data Found</h3>
              <p className="text-sm text-muted-foreground max-w-md mb-4">
                No advance data matches your current filter criteria. Try adjusting your filters or select a different date range.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Current Filters:</span>
                <span className="px-2 py-1 bg-muted rounded">
                  {filters.report_type} Report
                </span>
                <span className="px-2 py-1 bg-muted rounded">
                  {filters.start_date} to {filters.end_date}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Reports;
