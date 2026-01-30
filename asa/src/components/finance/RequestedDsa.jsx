import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Download,
  MoreHorizontal,
  Calendar,
  User,
  FileText,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  ShieldCheck,
  Globe,
  MapPin,
  Receipt,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import AdvanceServices from "../services/AdvanceServices";
import { advance_type } from "../datas/advance_type";
import { format } from "date-fns";

const RequestedDsa = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedStatuses, setSelectedStatuses] = useState([
    "pending",
    "verified",
    "confirmed",
    "dispatched",
    "rejected",
  ]);
  const [selectedDsaTypes, setSelectedDsaTypes] = useState([
    "ex_country_dsa_claim",
    "in_country_dsa_claim",
  ]);

  const statusConfig = {
    pending: { 
      label: "Pending", 
      color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200", 
      icon: Clock 
    },
    verified: { 
      label: "Verified", 
      color: "bg-blue-100 text-blue-800 hover:bg-blue-200", 
      icon: CheckCircle 
    },
    confirmed: { 
      label: "Confirmed", 
      color: "bg-purple-100 text-purple-800 hover:bg-purple-200", 
      icon: ShieldCheck 
    },
    dispatched: { 
      label: "Dispatched", 
      color: "bg-green-100 text-green-800 hover:bg-green-200", 
      icon: Truck 
    },
    rejected: { 
      label: "Rejected", 
      color: "bg-red-100 text-red-800 hover:bg-red-200", 
      icon: XCircle 
    },
  };

  const dsaTypeConfig = {
    ex_country_dsa_claim: { 
      label: "International DSA", 
      color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
      icon: Globe,
      description: "Overseas tour claims"
    },
    in_country_dsa_claim: { 
      label: "Domestic DSA", 
      color: "bg-teal-100 text-teal-800 hover:bg-teal-200",
      icon: MapPin,
      description: "Local tour claims"
    },
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusIcon = (status) => {
    const Icon = statusConfig[status]?.icon || Clock;
    return <Icon className="h-3 w-3 mr-1" />;
  };

  const getDsaTypeIcon = (type) => {
    const Icon = dsaTypeConfig[type]?.icon || Receipt;
    return <Icon className="h-3 w-3 mr-1" />;
  };

  const fetchDsaClaims = async (pageNum, perPage) => {
    if (selectedStatuses.length === 0 || selectedDsaTypes.length === 0) {
      setRecords([]);
      setFilteredRecords([]);
      setTotalPages(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const dsaParams = {
      status: selectedStatuses,
      advance_type: selectedDsaTypes,
      page: pageNum,
      per_page: perPage,
      search_query: searchTerm,
      type: "claim_dsa",
    };

    try {
      const response = await AdvanceServices.get(dsaParams);
      setRecords(response.data.advances);
      setFilteredRecords(response.data.advances);
      setTotalPages(response.data.pagy.pages);
    } catch (error) {
      console.error("Error fetching DSA claims:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDsaClaims(page, rowsPerPage);
  }, [page, selectedStatuses, selectedDsaTypes, rowsPerPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleStatusToggle = (status) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
    setPage(1);
  };

  const handleDsaTypeToggle = (type) => {
    setSelectedDsaTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
    setPage(1);
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setPage(1);
  };

  const resetFilters = () => {
    setSelectedStatuses([
      "pending",
      "verified",
      "confirmed",
      "dispatched",
      "rejected",
    ]);
    setSelectedDsaTypes([
      "ex_country_dsa_claim",
      "in_country_dsa_claim",
    ]);
    setSearchTerm("");
    setPage(1);
  };

  const getAmountDisplay = (row) => {
    if (row.advance_type === "ex_country_dsa_claim") {
      const amounts = [];
      if (row.dsa_amount?.Nu > 0) amounts.push(`Nu. ${parseFloat(row.dsa_amount.Nu).toLocaleString('en-IN')}`);
      if (row.dsa_amount?.INR > 0) amounts.push(`₹ ${parseFloat(row.dsa_amount.INR).toLocaleString('en-IN')}`);
      if (row.dsa_amount?.USD > 0) amounts.push(`$ ${parseFloat(row.dsa_amount.USD).toLocaleString('en-IN')}`);
      
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {amounts.map((amount, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {amount}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Multiple currencies</p>
        </div>
      );
    } else if (row.advance_type === "in_country_dsa_claim") {
      return (
        <div className="space-y-1">
          <p className="font-medium">
            Nu. {row.dsa_amount?.Nu ? parseFloat(row.dsa_amount.Nu).toLocaleString('en-IN') : "0.00"}
          </p>
          <p className="text-xs text-muted-foreground">Domestic claim</p>
        </div>
      );
    }
  };

  const SkeletonRow = () => (
    <TableRow>
      <TableCell>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-28" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-36" />
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
      </TableCell>
    </TableRow>
  );

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedStatuses.length < Object.keys(statusConfig).length) count++;
    if (selectedDsaTypes.length < Object.keys(dsaTypeConfig).length) count++;
    if (searchTerm) count++;
    return count;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">DSA Claims</h1>
          <p className="text-muted-foreground">
            Review and manage Daily Subsistence Allowance claims
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>DSA Claim Applications</CardTitle>
              <CardDescription>
                {records.length} claims • {selectedStatuses.length} statuses • {selectedDsaTypes.length} types
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    {getActiveFilterCount() > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                        {getActiveFilterCount()}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-96 p-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Filter DSA Claims</h3>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-muted-foreground">
                          Apply filters to narrow down results
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetFilters}
                          className="h-8"
                        >
                          Reset All
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Claim Status
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(statusConfig).map(([status, config]) => (
                          <div key={status} className="flex items-center space-x-2">
                            <Checkbox
                              id={`status-${status}`}
                              checked={selectedStatuses.includes(status)}
                              onCheckedChange={() => handleStatusToggle(status)}
                            />
                            <Label 
                              htmlFor={`status-${status}`} 
                              className="text-sm cursor-pointer flex items-center gap-1"
                            >
                              <config.icon className="h-3 w-3" />
                              {config.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        DSA Type
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(dsaTypeConfig).map(([type, config]) => (
                          <div key={type} className="flex items-start space-x-2">
                            <Checkbox
                              id={`type-${type}`}
                              checked={selectedDsaTypes.includes(type)}
                              onCheckedChange={() => handleDsaTypeToggle(type)}
                            />
                            <Label 
                              htmlFor={`type-${type}`} 
                              className="text-sm cursor-pointer"
                            >
                              <div className="font-medium">{config.label}</div>
                              <div className="text-xs text-muted-foreground">{config.description}</div>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        className="w-full"
                        onClick={() => document.querySelector('[data-radix-popper-content-wrapper]').click()}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">Employee</TableHead>
                  <TableHead className="w-[180px]">Status</TableHead>
                  <TableHead className="w-[180px]">DSA Type</TableHead>
                  <TableHead className="w-[200px]">Claim Amount</TableHead>
                  <TableHead className="w-[150px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonRow key={index} />
                  ))
                ) : filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No DSA claims found</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {searchTerm 
                            ? "No claims match your search criteria" 
                            : "No claims match your current filters"}
                        </p>
                        {(searchTerm || selectedStatuses.length === 0 || selectedDsaTypes.length === 0) && (
                          <Button
                            variant="outline"
                            onClick={resetFilters}
                          >
                            Reset Filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((row) => (
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{row.user?.name || "N/A"}</p>
                            <p className="text-sm text-muted-foreground">
                              {row.user?.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant="outline"
                            className={`${statusConfig[row.status]?.color} border-0 font-medium w-fit`}
                          >
                            <div className="flex items-center">
                              {getStatusIcon(row.status)}
                              {statusConfig[row.status]?.label || row.status}
                            </div>
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Applied: {formatDate(row.created_at)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge
                            variant="outline"
                            className={`${dsaTypeConfig[row.advance_type]?.color} border-0`}
                          >
                            <div className="flex items-center">
                              {getDsaTypeIcon(row.advance_type)}
                              {advance_type[row.advance_type] || row.advance_type}
                            </div>
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {dsaTypeConfig[row.advance_type]?.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getAmountDisplay(row)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => window.location.href = `/viewRequestedAdvance/${row.id}`}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Button>
                          {(row.status === "pending" || row.status === "rejected") && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={() => window.location.href = `/editRequestedAdvance/${row.id}`}
                            >
                              <Edit className="h-3.5 w-3.5" />
                              Edit
                            </Button>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => window.location.href = `/viewRequestedAdvance/${row.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {(row.status === "pending" || row.status === "rejected") && (
                                  <DropdownMenuItem onClick={() => window.location.href = `/editRequestedAdvance/${row.id}`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Claim
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Receipt
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Receipt className="mr-2 h-4 w-4" />
                                  Generate Certificate
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredRecords.length > 0 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Rows per page:
                </span>
                <Select
                  value={rowsPerPage.toString()}
                  onValueChange={handleRowsPerPageChange}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={rowsPerPage} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={pageSize.toString()}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Pagination>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center gap-1 px-4 text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestedDsa;