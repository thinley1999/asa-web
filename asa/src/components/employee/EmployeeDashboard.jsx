import React, { useState, useEffect } from "react";
import AdvanceServices from "../services/AdvanceServices";
import LoginoutMessage from "../general/LoginoutMessage";
import { FaBusinessTime } from "react-icons/fa6";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { FileText, RefreshCw } from "lucide-react";
import { ApplicationCard } from "../general/ApplicationCard";
import { PaginationControls, SimplePaginationControls } from "../general/PaginationControls";
import { Clock, CheckCircle, AlertCircle  } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmployeeApplications = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("currentapplication");
  const [currentApplications, setCurrentApplications] = useState([]);
  const [previousApplications, setPreviousApplications] = useState([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState({
    current: false,
    previous: false,
  });
  const [pagination, setPagination] = useState({
    current: { page: 1, pages: 1, count: 0 },
    previous: { page: 1, pages: 1, count: 0 },
  });

  const all_advance = [
    "ex_country_tour_advance",
    "in_country_tour_advance",
    "other_advance",
    "salary_advance",
    "in_country_dsa_claim",
    "ex_country_dsa_claim",
  ];

  const fetchCurrentApplications = async (page = 1) => {
    setLoading((prev) => ({ ...prev, current: true }));
    try {
      const currentParams = {
        status: ["pending", "rejected", "verified"],
        advance_type: all_advance,
        type: "my_advance",
        page: page,
        per_page: 5,
      };
      const response = await AdvanceServices.get(currentParams);

      if (response && response.data) {
        setCurrentApplications(response.data.advances || []);
        setPagination((prev) => ({
          ...prev,
          current: response.data.pagy || { page: 1, pages: 1, count: 0 },
        }));
      } else {
        setCurrentApplications([]);
      }
    } catch (error) {
      toast({
          title: "Error",
          description: "Failed to fetch current applications.",
          variant: "destructive",
        });
      setCurrentApplications([]);
    } finally {
      setLoading((prev) => ({ ...prev, current: false }));
    }
  };

  const fetchPreviousApplications = async (page = 1) => {
    setLoading((prev) => ({ ...prev, previous: true }));
    try {
      const preParams = {
        status: ["confirmed", "dispatched", "closed"],
        advance_type: all_advance,
        type: "my_advance",
        page: page,
        per_page: 5,
      };
      const response = await AdvanceServices.get(preParams);

      if (response && response.data) {
        setPreviousApplications(response.data.advances || []);
        setPagination((prev) => ({
          ...prev,
          previous: response.data.pagy || { page: 1, pages: 1, count: 0 },
        }));
      } else {
        setPreviousApplications([]);
      }
    } catch (error) {
      toast({
          title: "Error",
          description: "Error fetching previous applications.",
          variant: "destructive",
        });
      setPreviousApplications([]);
    } finally {
      setLoading((prev) => ({ ...prev, previous: false }));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const storedLoginStatus = localStorage.getItem("isLoggedIn");
      if (!storedLoginStatus) {
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
      }
    }
  }, []);

  useEffect(() => {
    if (activeTab === "currentapplication") {
      fetchCurrentApplications(1);
    } else if (activeTab === "previousapplication") {
      fetchPreviousApplications(1);
    }
  }, [activeTab]);

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        variant: "secondary",
        icon: Clock,
        label: "Pending",
        color: "text-yellow-600 bg-yellow-50 border-yellow-200",
      },
      verified: {
        variant: "default",
        icon: CheckCircle,
        label: "Verified",
        color: "text-blue-600 bg-blue-50 border-blue-200",
      },
      rejected: {
        variant: "destructive",
        icon: AlertCircle,
        label: "Rejected",
        color: "text-red-600 bg-red-50 border-red-200",
      },
      confirmed: {
        variant: "success",
        icon: CheckCircle,
        label: "Confirmed",
        color: "text-green-600 bg-green-50 border-green-200",
      },
      dispatched: {
        variant: "outline",
        icon: Clock,
        label: "Dispatched",
        color: "text-purple-600 bg-purple-50 border-purple-200",
      },
      closed: {
        variant: "secondary",
        icon: CheckCircle,
        label: "Closed",
        color: "text-gray-600 bg-gray-50 border-gray-200",
      },
    };
    return configs[status] || configs.pending;
  };

  const getAdvanceTypeLabel = (type) => {
    const typeMap = {
      ex_country_tour_advance: "Foreign Tour Advance",
      in_country_tour_advance: "Domestic Tour Advance",
      other_advance: "Other Advance",
      salary_advance: "Salary Advance",
      in_country_dsa_claim: "Domestic DSA Claim",
      ex_country_dsa_claim: "Foreign DSA Claim",
    };
    return typeMap[type] || type;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount) => {
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;

    if (
      isNaN(numericAmount) ||
      numericAmount === null ||
      numericAmount === undefined
    ) {
      return "Nu 0";
    }

    return `Nu ${numericAmount.toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const ApplicationSkeleton = () => (
    <Card className="mb-2">
      <CardContent className="p-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
          <Separator className="my-2" />
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ tab }) => (
    <Card className="border-dashed">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="rounded-full bg-muted p-3 mb-3">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold mb-1">
            No {tab === "currentapplication" ? "Current" : "Previous"}{" "}
            Applications
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {tab === "currentapplication"
              ? "You don't have any applications in progress."
              : "No previous applications found."}
          </p>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-3 w-3 mr-2" />
            Check Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col h-screen p-2 md:p-4 bg-background">
      {isLoggedIn && <LoginoutMessage message="Login Successful!" />}

      {/* Fixed Tabs Section */}
      <div className="flex-shrink-0">
        <Tabs
          defaultValue="currentapplication"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-10 mb-6">
            <TabsTrigger
              value="currentapplication"
              className="h-8 text-base gap-2"
            >
              <FaBusinessTime className="h-5 w-5" />
              Current
              {!loading.current && currentApplications.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-4 min-w-4 flex items-center justify-center text-xs"
                >
                  {currentApplications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="previousapplication"
              className="h-8 text-base gap-2"
            >
              <FaBusinessTime className="h-5 w-5" />
              Previous
              {!loading.previous && previousApplications.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 h-4 min-w-4 flex items-center justify-center text-xs"
                >
                  {previousApplications.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Current Applications Tab Content */}
          <TabsContent value="currentapplication" className="mt-4">
            <div className="flex flex-col h-[calc(100vh-200px)]">
              {/* Header with title and refresh */}
              <div className="flex items-center justify-between mb-2 flex-shrink-0">
                <div>
                  <h2 className="text-lg font-semibold">
                    Current Applications
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Applications that are currently being processed
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchCurrentApplications()}
                  disabled={loading.current}
                  className="gap-2"
                >
                  <RefreshCw
                    className={`h-3 w-3 ${
                      loading.current ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
              </div>

              {/* Scrollable Applications List */}
              <div className="flex-grow overflow-y-auto pr-2">
                {loading.current ? (
                  <div>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <ApplicationSkeleton key={i} />
                    ))}
                  </div>
                ) : currentApplications.length > 0 ? (
                  <div>
                    {currentApplications.map((app, index) => (
                      <ApplicationCard
                        key={app.id || index}
                        application={app}
                        index={index}
                        getStatusConfig={getStatusConfig}
                        getAdvanceTypeLabel={getAdvanceTypeLabel}
                        formatDate={formatDate}
                        formatCurrency={formatCurrency}
                        activeTab={activeTab}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState tab="currentapplication" />
                )}
              </div>

              {/* Fixed Pagination at Bottom */}
              <div className="flex-shrink-0">
                <PaginationControls
                  currentPage={pagination.current.page || 1}
                  totalPages={pagination.current.pages || 1}
                  totalItems={pagination.current.count || 0}
                  itemsPerPage={5}
                  onPageChange={fetchCurrentApplications}
                  showFirstLastButtons={true}
                />
              </div>
            </div>
          </TabsContent>

          {/* Previous Applications Tab Content */}
          <TabsContent value="previousapplication" className="mt-4">
            <div className="flex flex-col h-[calc(100vh-200px)]">
              {/* Header with title and refresh */}
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div>
                  <h2 className="text-lg font-semibold">
                    Previous Applications
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Completed and processed applications
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchPreviousApplications()}
                  disabled={loading.previous}
                  className="gap-2"
                >
                  <RefreshCw
                    className={`h-3 w-3 ${
                      loading.previous ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
              </div>

              {/* Scrollable Applications List */}
              <div className="flex-grow overflow-y-auto pr-2">
                {loading.previous ? (
                  <div>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <ApplicationSkeleton key={i} />
                    ))}
                  </div>
                ) : previousApplications.length > 0 ? (
                  <div>
                    {previousApplications.map((app, index) => (
                      <ApplicationCard
                        key={app.id || index}
                        application={app}
                        index={index}
                        getStatusConfig={getStatusConfig}
                        getAdvanceTypeLabel={getAdvanceTypeLabel}
                        formatDate={formatDate}
                        formatCurrency={formatCurrency}
                        activeTab={activeTab}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState tab="previousapplication" />
                )}
              </div>

              {/* Fixed Pagination at Bottom */}
              <div className="flex-shrink-0">
                <SimplePaginationControls
                  currentPage={pagination.previous.page || 1}
                  totalPages={pagination.previous.pages || 1}
                  totalItems={pagination.previous.count || 0}
                  itemsPerPage={5}
                  onPageChange={fetchPreviousApplications}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EmployeeApplications;
