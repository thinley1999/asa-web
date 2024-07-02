import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-plugin-datalabels";
import "../../assets/css/main.css";
import profileImage from "../../assets/img/Thinley.jpeg";
import { CiChat2 } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";
import { CiBookmarkRemove } from "react-icons/ci";
import { BsCartCheckFill } from "react-icons/bs";
import AdvanceServices from "../services/AdvanceServices";

const FinanceDashboard = () => {
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

  const [monthlycount, setMonthlyCount] = useState([]);

  const [applicationDetails, setApplicationDetails] = useState([]);

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
              backgroundColor: window.theme?.primary || "rgba(3, 104, 250)",
              hoverBackgroundColor:
                window.theme?.primary || "rgba(0,123,255,0.7)",
              data: data,
              barPercentage: 0.75,
              categoryPercentage: 0.5,
              borderRadius: 10,
            },
          ],
        },
        options: {
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
              backgroundColor: [
                window.theme?.primary || "rgba(3, 104, 250)",
                window.theme?.success || "rgba(40, 167, 69)",
                window.theme?.warning || "rgba(255, 193, 7)",
                "#dee2e6",
              ],
              borderColor: "transparent",
            },
          ],
        },
        options: {
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
    }

    return () => {
      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
      }
      if (pieChartInstanceRef.current) {
        pieChartInstanceRef.current.destroy();
      }
    };
  }, [typeCount]);

  return (
    <div>
      <div className="row my-2">
        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
          <div className="card pt-3 pe-2 mb-2 pb-4">
            <div className="d-flex justify-content-between">
              <div className="ms-3">
                <h6 className="mb-0 c-details">Pending Application</h6>
              </div>
              <div className="dashboardicon1">
                <CiChat2 size={24} />
              </div>
            </div>
            <div className="text-center">
              {statusCount.status_count.pending ? (
                <h1 className="cardheading">
                  {statusCount.status_count.pending}
                </h1>
              ) : (
                <h1 className="cardheading">0</h1>
              )}
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
                <FaCheck size={24} />
              </div>
            </div>
            <div className="text-center">
              {statusCount.status_count.verified ? (
                <h1 className="cardheading">
                  {statusCount.status_count.verified}
                </h1>
              ) : (
                <h1 className="cardheading">0</h1>
              )}
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
          <div className="card pt-3 pe-2 mb-2 pb-4">
            <div className="d-flex justify-content-between">
              <div className="ms-3">
                <h6 className="mb-0 c-details">Rejected Application</h6>
              </div>
              <div className="dashboardicon3">
                <CiBookmarkRemove size={24} />
              </div>
            </div>
            <div className="text-center">
              {statusCount.status_count.rejected ? (
                <h1 className="cardheading">
                  {statusCount.status_count.rejected}
                </h1>
              ) : (
                <h1 className="cardheading">0</h1>
              )}
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
          <div className="card pt-3 pe-2 mb-2 pb-4">
            <div className="d-flex justify-content-between">
              <div className="ms-3">
                <h6 className="mb-0 c-details">Approved Application</h6>
              </div>
              <div className="dashboardicon4">
                <BsCartCheckFill size={24} />
              </div>
            </div>
            <div className="text-center">
              {statusCount.status_count.approved ? (
                <h1 className="cardheading">
                  {statusCount.status_count.approved}
                </h1>
              ) : (
                <h1 className="cardheading">0</h1>
              )}
            </div>
          </div>
        </div>
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
