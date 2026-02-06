import React, { useEffect, useState, useCallback } from "react";
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
  MoreHorizontal,
  Calendar,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import AdvanceServices from "../services/AdvanceServices";
import { advance_type } from "../datas/advance_type";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const RequestedAdvance = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const { toast } = useToast();
  const [selectedStatuses, setSelectedStatuses] = useState([
    "pending",
    "verified",
    "confirmed",
    "dispatched",
    "rejected",
    "closed",
  ]);
  const [selectedAdvanceTypes, setSelectedAdvanceTypes] = useState([
    "ex_country_tour_advance",
    "in_country_tour_advance",
    "other_advance",
    "salary_advance",
  ]);

  const statusConfig = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
    verified: { label: "Verified", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
    confirmed: { label: "Confirmed", color: "bg-purple-100 text-purple-800", icon: ShieldCheck },
    dispatched: { label: "Dispatched", color: "bg-green-100 text-green-800", icon: Truck },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
    closed: { label: "Closed", color: "bg-gray-100 text-gray-800", icon: CheckCircle },
  };

  const advanceTypeConfig = {
    ex_country_tour_advance: { label: "International Tour", color: "bg-indigo-100 text-indigo-800" },
    in_country_tour_advance: { label: "Domestic Tour", color: "bg-teal-100 text-teal-800" },
    other_advance: { label: "Other Advance", color: "bg-orange-100 text-orange-800" },
    salary_advance: { label: "Salary Advance", color: "bg-pink-100 text-pink-800" },
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
    return <Icon className="h-4 w-4 mr-1" />;
  };

  const fetchAdvances = useCallback(async (pageNum, perPage, search, statuses, types) => {
    if (statuses.length === 0 || types.length === 0) {
      setRecords([]);
      setTotalPages(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const advanceParams = {
      status: statuses,
      advance_type: types,
      page: pageNum,
      per_page: perPage,
      search_query: search,
    };

    try {
      const response = await AdvanceServices.get(advanceParams);
      setRecords(response.data.advances);
      setTotalPages(response.data.pagy.pages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error fetching current applications.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchAdvances(page, rowsPerPage, searchQuery, selectedStatuses, selectedAdvanceTypes);
  }, [page, rowsPerPage, searchQuery, selectedStatuses, selectedAdvanceTypes, fetchAdvances]);

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      setSearchQuery(searchTerm);
      setPage(1);
    }
  };

  const handleSearchButtonClick = () => {
    setSearchQuery(searchTerm);
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

  const handleAdvanceTypeToggle = (type) => {
    setSelectedAdvanceTypes(prev =>
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
      "closed",
    ]);
    setSelectedAdvanceTypes([
      "ex_country_tour_advance",
      "in_country_tour_advance",
      "other_advance",
      "salary_advance",
    ]);
    setSearchTerm("");
    setSearchQuery("");
    setPage(1);
  };

  const getAmountDisplay = (row) => {
    if (row.advance_type === "ex_country_tour_advance") {
      return (
        <div className="space-y-1">
          <div className="flex flex-wrap gap-2">
            {row.advance_amount?.Nu > 0 && (
              <Badge variant="outline" className="bg-blue-50">
                Nu. {parseFloat(row.advance_amount.Nu).toLocaleString('en-IN')}
              </Badge>
            )}
            {row.advance_amount?.INR > 0 && (
              <Badge variant="outline" className="bg-green-50">
                ₹ {parseFloat(row.advance_amount.INR).toLocaleString('en-IN')}
              </Badge>
            )}
            {row.advance_amount?.USD > 0 && (
              <Badge variant="outline" className="bg-purple-50">
                $ {parseFloat(row.advance_amount.USD).toLocaleString('en-IN')}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Multi-currency advance</p>
        </div>
      );
    } else if (row.advance_type === "in_country_tour_advance") {
      return (
        <div>
          <p className="font-medium">
            Nu. {row.advance_amount?.Nu ? parseFloat(row.advance_amount.Nu).toLocaleString('en-IN') : "0.00"}
          </p>
          <p className="text-xs text-muted-foreground">Domestic tour</p>
        </div>
      );
    } else {
      return (
        <div>
          <p className="font-medium">
            Nu. {row.amount ? parseFloat(row.amount).toLocaleString('en-IN') : "0.00"}
          </p>
          <p className="text-xs text-muted-foreground">Regular advance</p>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Advance Requests</h1>
          <p className="text-muted-foreground">
            Manage and review all advance requests from employees
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Advance Applications</CardTitle>
              <CardDescription>
                Showing {records.length} of {totalPages * rowsPerPage} total records
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Employee ID"
                  className="pl-9 px-8"
                  value={searchTerm}
                  onChange={handleSearchInput}
                  onKeyDown={handleSearchSubmit}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                  onClick={handleSearchButtonClick}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    <Badge variant="secondary" className="ml-1">
                      {selectedStatuses.length + selectedAdvanceTypes.length}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 p-4">
                  <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Status</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(statusConfig).map(([status, config]) => (
                          <div key={status} className="flex items-center space-x-2">
                            <Switch
                              checked={selectedStatuses.includes(status)}
                              onCheckedChange={() => handleStatusToggle(status)}
                              id={`status-${status}`}
                            />
                            <Label htmlFor={`status-${status}`} className="text-sm">
                              {config.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-medium mb-2">Advance Type</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(advanceTypeConfig).map(([type, config]) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Switch
                              checked={selectedAdvanceTypes.includes(type)}
                              onCheckedChange={() => handleAdvanceTypeToggle(type)}
                              id={`type-${type}`}
                            />
                            <Label htmlFor={`type-${type}`} className="text-sm">
                              {config.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={resetFilters}
                      >
                        Reset Filters
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
                  <TableHead className="w-[180px]">Advance Type</TableHead>
                  <TableHead className="w-[200px]">Amount</TableHead>
                  <TableHead className="w-[150px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonRow key={index} />
                  ))
                ) : records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">No advances found</h3>
                        <p className="text-sm text-muted-foreground">
                          {searchQuery ? "Try adjusting your search or filters" : "No advance requests match your current filters"}
                        </p>
                        {(searchQuery || selectedStatuses.length === 0 || selectedAdvanceTypes.length === 0) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-4"
                            onClick={resetFilters}
                          >
                            Reset Filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((row) => (
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
                            {formatDate(row.created_at)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${advanceTypeConfig[row.advance_type]?.color} border-0`}
                        >
                          {advance_type[row.advance_type] || row.advance_type}
                        </Badge>
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
                                    Edit Request
                                  </DropdownMenuItem>
                                )}
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

          {records.length > 0 && (
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

export default RequestedAdvance;
