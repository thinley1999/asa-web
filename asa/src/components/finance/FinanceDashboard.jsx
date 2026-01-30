import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-plugin-datalabels";
import {
  Wallet,
  Clock,
  CheckCircle,
  Truck,
  FolderClosed,
  TrendingUp,
  PieChart,
  AlertCircle,
} from "lucide-react";
import AdvanceServices from "../services/AdvanceServices";
import LoginoutMessage from "../general/LoginoutMessage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const FinanceDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const barChartRef = useRef(null);
  const barChartInstanceRef = useRef(null);
  const pieChartRef = useRef(null);
  const pieChartInstanceRef = useRef(null);
  const [statusCount, setStatusCount] = useState({
    status_count: {
      pending: 0,
      verified: 0,
      rejected: 0,
      approved: 0,
      confirmed: 0,
      dispatched: 0,
      closed: 0,
    },
  });
  const [typeCount, setTypeCount] = useState({
    advance_type_count: {
      salary_advance: 0,
      other_advance: 0,
      in_country_tour_advance: 0,
      ex_country_tour_advance: 0,
    },
  });
  const [monthlycount, setMonthlyCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (!isLoggedIn) {
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
        toast({
          title: "Welcome back!",
          description: "Login successful",
          duration: 3000,
        });
      }
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchStatusCount(),
          fetchTypeCount(),
          fetchMonthlyCount(),
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const fetchStatusCount = async () => {
    try {
      const response = await AdvanceServices.statusCount();
      if (response && response.status === 200) {
        setStatusCount(response.data);
      }
    } catch (error) {
      console.error("Error fetching status count:", error);
      throw error;
    }
  };

  const fetchTypeCount = async () => {
    try {
      const response = await AdvanceServices.typeCount();
      if (response && response.status === 200) {
        setTypeCount(response.data);
      }
    } catch (error) {
      console.error("Error fetching type count:", error);
      throw error;
    }
  };

  const fetchMonthlyCount = async () => {
    try {
      const response = await AdvanceServices.monthlyCount();
      if (response && response.status === 200) {
        setMonthlyCount(response.data);
      }
    } catch (error) {
      console.error("Error fetching monthly count:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (loading) return;

    // Destroy existing charts
    if (barChartInstanceRef.current) {
      barChartInstanceRef.current.destroy();
    }
    if (pieChartInstanceRef.current) {
      pieChartInstanceRef.current.destroy();
    }

    // Create Bar Chart
    if (barChartRef.current && monthlycount.length > 0) {
      const barCtx = barChartRef.current.getContext("2d");
      const labels = monthlycount.map((item) => item.month);
      const data = monthlycount.map((item) => item.count);

      barChartInstanceRef.current = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Applications",
              data: data,
              backgroundColor: "rgba(59, 130, 246, 0.8)",
              borderColor: "rgb(59, 130, 246)",
              borderWidth: 1,
              borderRadius: 8,
              hoverBackgroundColor: "rgba(29, 78, 216, 0.9)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              titleColor: "#1f2937",
              bodyColor: "#4b5563",
              borderColor: "#e5e7eb",
              borderWidth: 1,
              padding: 12,
              cornerRadius: 6,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: "rgba(229, 231, 235, 0.5)",
              },
              ticks: {
                color: "#6b7280",
              },
            },
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#6b7280",
              },
            },
          },
        },
      });
    }

    // Create Pie Chart
    if (pieChartRef.current) {
      const pieCtx = pieChartRef.current.getContext("2d");
      const data = [
        typeCount.advance_type_count.salary_advance,
        typeCount.advance_type_count.other_advance,
        typeCount.advance_type_count.in_country_tour_advance,
        typeCount.advance_type_count.ex_country_tour_advance,
      ];

      if (data.some((value) => value > 0)) {
        pieChartInstanceRef.current = new Chart(pieCtx, {
          type: "pie",
          data: {
            labels: [
              "Salary Advance",
              "Other Advance",
              "Domestic Tour",
              "International Tour",
            ],
            datasets: [
              {
                data: data,
                backgroundColor: [
                  "rgb(59, 130, 246)",
                  "rgb(249, 115, 22)",
                  "rgb(16, 185, 129)",
                  "rgb(168, 85, 247)",
                ],
                borderWidth: 2,
                borderColor: "white",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  padding: 20,
                  usePointStyle: true,
                  pointStyle: "circle",
                  color: "#4b5563",
                },
              },
              tooltip: {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                titleColor: "#1f2937",
                bodyColor: "#4b5563",
                borderColor: "#e5e7eb",
                borderWidth: 1,
                padding: 12,
                cornerRadius: 6,
              },
            },
          },
        });
      }
    }

    return () => {
      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
      }
      if (pieChartInstanceRef.current) {
        pieChartInstanceRef.current.destroy();
      }
    };
  }, [monthlycount, typeCount, loading]);

  const statCards = [
    {
      title: "Pending Applications",
      value: statusCount.status_count.pending || 0,
      icon: Clock,
      color: "bg-amber-50 border-amber-200",
      iconColor: "text-amber-600",
      description: "Awaiting review",
    },
    {
      title: "Verified Applications",
      value: statusCount.status_count.verified || 0,
      icon: CheckCircle,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      description: "Approved by verifiers",
    },
    {
      title: "Confirmed Applications",
      value: statusCount.status_count.confirmed || 0,
      icon: Wallet,
      color: "bg-emerald-50 border-emerald-200",
      iconColor: "text-emerald-600",
      description: "Ready for processing",
    },
    {
      title: "Dispatched Applications",
      value: statusCount.status_count.dispatched || 0,
      icon: Truck,
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
      description: "Sent for payment",
    },
    {
      title: "Closed Applications",
      value: statusCount.status_count.closed || 0,
      icon: FolderClosed,
      color: "bg-gray-50 border-gray-200",
      iconColor: "text-gray-600",
      description: "Completed requests",
    },
  ];

  return (
    <div className="space-y-6">
      {isLoggedIn && <LoginoutMessage message="Login Successful!!!" />}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            ASA Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Overview of advance applications and activities
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <AlertCircle className="h-4 w-4" />
          <span>Last updated: Today</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))
          : statCards.map((stat, index) => (
              <Card key={index} className={`${stat.color} border`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${stat.iconColor} bg-opacity-10`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {stat.description}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Monthly Activity
                </CardTitle>
                <CardDescription>
                  Advance applications over time
                </CardDescription>
              </div>
              <div className="text-sm text-gray-500">
                {monthlycount.length} months
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : monthlycount.length > 0 ? (
                <canvas ref={barChartRef} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <TrendingUp className="h-12 w-12 mb-4 opacity-50" />
                  <p className="font-medium">No data available</p>
                  <p className="text-sm">Monthly activity data will appear here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-purple-600" />
                  Advance Type Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown by advance category
                </CardDescription>
              </div>
              <div className="text-sm text-gray-500">
                {Object.values(typeCount.advance_type_count).reduce(
                  (a, b) => a + b,
                  0
                )}{" "}
                total
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <Skeleton className="h-full w-full rounded-full" />
                </div>
              ) : (
                <canvas ref={pieChartRef} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total Salary Advances</p>
              <p className="text-2xl font-bold text-gray-900">
                {typeCount.advance_type_count.salary_advance || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total Other Advances</p>
              <p className="text-2xl font-bold text-gray-900">
                {typeCount.advance_type_count.other_advance || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Domestic Tours</p>
              <p className="text-2xl font-bold text-gray-900">
                {typeCount.advance_type_count.in_country_tour_advance || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">International Tours</p>
              <p className="text-2xl font-bold text-gray-900">
                {typeCount.advance_type_count.ex_country_tour_advance || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceDashboard;
