import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-plugin-datalabels";
import "../../assets/css/main.css";
import { FaSackDollar } from "react-icons/fa6";
import { FaHandHoldingUsd } from "react-icons/fa";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { PiPiggyBankFill } from "react-icons/pi";
import AdvanceServices from "../services/AdvanceServices";
import LoginoutMessage from "../general/LoginoutMessage";
import { FaCartShopping } from "react-icons/fa6";
import { FaFolderClosed } from "react-icons/fa6";

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

  console.log("statusCount...", statusCount);

  const [monthlycount, setMonthlyCount] = useState([]);

  const [applicationDetails, setApplicationDetails] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const isLoggedIn = localStorage.getItem("isLoggedIn");

      if (!isLoggedIn) {
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
      }
    }
  }, []);

  useEffect(() => {
    fetchStatusCount();
    fetchTypeCount();
    fetchMonthlyCount();
  }, []);

  const fetchStatusCount = async () => {
    try {
      const response = await AdvanceServices.statusCount();
      if (response && response.status == 200) {
        setStatusCount(response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchTypeCount = async () => {
    try {
      const response = await AdvanceServices.typeCount();
      if (response && response.status == 200) {
        setTypeCount(response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchMonthlyCount = async () => {
    try {
      const response = await AdvanceServices.monthlyCount();
      if (response && response.status == 200) {
        setMonthlyCount(response.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (barChartRef.current && barChartRef.current.getContext("2d")) {
      const barCtx = barChartRef.current.getContext("2d");

      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
      }

      const labels = monthlycount.map((item) => item.month);
      const data = monthlycount.map((item) => item.count);

      barChartInstanceRef.current = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              backgroundColor: window.theme?.primary || "rgb(24, 20, 243)",
              hoverBackgroundColor: window.theme?.primary || "rgb(24, 20, 243)",
              data: data,
              barPercentage: 0.75,
              categoryPercentage: 0.5,
              borderRadius: 10,
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
          },
          scales: {
            y: {
              grid: {
                display: false,
              },
              stacked: false,
            },
            x: {
              grid: {
                color: "transparent",
              },
              stacked: false,
            },
          },
        },
      });

      // Force resize
      window.dispatchEvent(new Event("resize"));
    }

    if (pieChartRef.current && pieChartRef.current.getContext("2d")) {
      const pieCtx = pieChartRef.current.getContext("2d");

      if (pieChartInstanceRef.current) {
        pieChartInstanceRef.current.destroy();
      }

      pieChartInstanceRef.current = new Chart(pieCtx, {
        type: "pie",
        data: {
          labels: [
            "Salary Advance",
            "Other Advance",
            "In country tour advance",
            "Out country tour advance",
          ],
          datasets: [
            {
              data: [
                typeCount.advance_type_count.salary_advance,
                typeCount.advance_type_count.other_advance,
                typeCount.advance_type_count.in_country_tour_advance,
                typeCount.advance_type_count.ex_country_tour_advance,
              ],
              backgroundColor: ["#343c6a", "#fc7900", "#1814f3", "#fa00ff"],
              borderColor: "transparent",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutoutPercentage: 65,
          plugins: {
            datalabels: {
              display: false,
            },
          },
          tooltips: {
            enabled: false,
          },
          legend: {
            display: false,
          },
          layout: {
            padding: {
              top: 20,
            },
          },
        },
      });

      // Force resize
      window.dispatchEvent(new Event("resize"));
    }

    return () => {
      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
      }
      if (pieChartInstanceRef.current) {
        pieChartInstanceRef.current.destroy();
      }
    };
  }, [typeCount, monthlycount]);

  return (
    <div className="container">
      {isLoggedIn && <LoginoutMessage message="Login Successful!!!" />}
      <div className="row my-2">
        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
          <div className="card pt-3 pe-2 mb-2 pb-4">
            <div className="d-flex justify-content-between">
              <div className="ms-3">
                <h6 className="mb-0 c-details">Pending Application</h6>
              </div>
              <div className="dashboardicon1">
                <FaSackDollar size={18} />
              </div>
            </div>
            <div className="text-center">
              <h1 className="cardheading">
                {statusCount &&
                statusCount.status_count &&
                statusCount.status_count.pending
                  ? statusCount.status_count.pending
                  : 0}
              </h1>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
          <div className="card pt-3 pe-2 mb-2 pb-4">
            <div className="d-flex justify-content-between">
              <div className="ms-3">
                <h6 className="mb-0 c-details">Verified Application</h6>
              </div>
              <div className="dashboardicon2">
                <FaHandHoldingUsd size={18} />
              </div>
            </div>
            <div className="text-center">
              <h1 className="cardheading">
                {statusCount &&
                statusCount.status_count &&
                statusCount.status_count.verified
                  ? statusCount.status_count.verified
                  : 0}
              </h1>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
          <div className="card pt-3 pe-2 mb-2 pb-4">
            <div className="d-flex justify-content-between">
              <div className="ms-3">
                <h6 className="mb-0 c-details">Confirmed Application</h6>
              </div>
              <div className="dashboardicon4">
                <PiPiggyBankFill size={18} />
              </div>
            </div>
            <div className="text-center">
              <h1 className="cardheading">
                {statusCount &&
                statusCount.status_count &&
                statusCount.status_count.confirmed
                  ? statusCount.status_count.confirmed
                  : 0}
              </h1>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
          <div className="card pt-3 pe-2 mb-2 pb-4">
            <div className="d-flex justify-content-between">
              <div className="ms-3">
                <h6 className="mb-0 c-details">Dispatched Application</h6>
              </div>
              <div className="dashboardicon5">
                <FaCartShopping size={18} />
              </div>
            </div>
            <div className="text-center">
              <h1 className="cardheading">
                {statusCount &&
                statusCount.status_count &&
                statusCount.status_count.dispatched
                  ? statusCount.status_count.dispatched
                  : 0}
              </h1>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
          <div className="card pt-3 pe-2 mb-2 pb-4">
            <div className="d-flex justify-content-between">
              <div className="ms-3">
                <h6 className="mb-0 c-details">Closed Application</h6>
              </div>
              <div className="dashboardicon6">
                <FaFolderClosed size={18} />
              </div>
            </div>
            <div className="text-center">
              <h1 className="cardheading">
                {statusCount &&
                statusCount.status_count &&
                statusCount.status_count.closed
                  ? statusCount.status_count.closed
                  : 0}
              </h1>
            </div>
          </div>
        </div>

        {/* <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
          <div className="card pt-3 pe-2 mb-2 pb-4">
            <div className="d-flex justify-content-between">
              <div className="ms-3">
                <h6 className="mb-0 c-details">Rejected Application</h6>
              </div>
              <div className="dashboardicon3">
                <FaFileInvoiceDollar size={18} />
              </div>
            </div>
            <div className="text-center">
              <h1 className="cardheading">
                {statusCount &&
                statusCount.status_count &&
                statusCount.status_count.rejected
                  ? statusCount.status_count.rejected
                  : 0}
              </h1>
            </div>
          </div>
        </div> */}
      </div>

      <div className="row my-2">
        <div className="col-xl-7 col-lg-7 col-md-7 col-12">
          <h6 className="custon-h6 py-2">Monthly Activity</h6>
          <div className="bargraph bg-white">
            <canvas id="chartjs-bar" ref={barChartRef}></canvas>
          </div>
        </div>
        <div className="col-xl-5 col-lg-5 col-md-5 col-12">
          <h6 className="custon-h6 py-2">Type of Advance</h6>
          <div className="bargraph bg-white">
            <canvas id="chartjs-pie" ref={pieChartRef}></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
