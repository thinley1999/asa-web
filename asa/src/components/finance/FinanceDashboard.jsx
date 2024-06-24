import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "chartjs-plugin-datalabels";
import "../../assets/css/main.css";
import profileImage from "../../assets/img/Thinley.jpeg";

const FinanceDashboard = () => {
  const barChartRef = useRef(null);
  const barChartInstanceRef = useRef(null);

  const pieChartRef = useRef(null);
  const pieChartInstanceRef = useRef(null);

  useEffect(() => {
    const barCtx = barChartRef.current.getContext("2d");

    // Destroy existing bar chart instance if it exists
    if (barChartInstanceRef.current) {
      barChartInstanceRef.current.destroy();
    }

    // Create new bar chart instance
    barChartInstanceRef.current = new Chart(barCtx, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
          {
            backgroundColor: window.theme?.primary || "rgba(3, 104, 250)",
            hoverBackgroundColor:
              window.theme?.primary || "rgba(0,123,255,0.7)",
            data: [54, 42, 41, 55, 33, 45, 55],
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

    // Create pie chart
    const pieCtx = pieChartRef.current.getContext("2d");

    // Destroy existing pie chart instance if it exists
    if (pieChartInstanceRef.current) {
      pieChartInstanceRef.current.destroy();
    }

    // Create new pie chart instance
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
            data: [260, 125, 54, 146],
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
            display: false, // Hide labels outside the pie chart
          },
        },
        tooltips: {
          enabled: false, // Disable tooltips if not needed
        },
        legend: {
          display: false, // Hide legend if not needed
        },
        layout: {
          padding: {
            top: 20, // Adjust as needed to ensure labels fit within the chart area
          },
        },
      },
    });

    // Cleanup function to destroy the chart instances when the component unmounts
    return () => {
      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
      }
      if (pieChartInstanceRef.current) {
        pieChartInstanceRef.current.destroy();
      }
    };
  }, []);

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
                <i className="bi bi-chat-square-dots-fill"></i>
              </div>
            </div>
            <div className="text-center">
              <h1 className="cardheading">20</h1>
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
                <i className="bi bi-check"></i>
              </div>
            </div>
            <div className="text-center">
              <h1 className="cardheading">200</h1>
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
                <i className="bi bi-bookmark-x-fill"></i>
              </div>
            </div>
            <div className="text-center">
              <h1 className="cardheading">30</h1>
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
                <i className="bi bi-cart-check-fill"></i>
              </div>
            </div>
            <div className="text-center">
              <h1 className="cardheading">300</h1>
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

      <div>
        <h6 className="custon-h6 py-2">My Applications</h6>
        <div className="d-flex flex-wrap align-items-center py-3 px-2 mb-2 employeediv w-100">
          <div className="d-flex align-items-center py-1 col-lg-3 col-xl-3 col-md-4 col-6 bio">
            <img
              src={profileImage}
              className="rounded-circle me-2"
              style={{ width: "8vh" }}
              alt="Profile"
            />
            <div>
              <p className="textheading">Thinley Yoezer</p>
              <p className="textsubheading">Asst. ICT Officer</p>
            </div>
          </div>
          <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
            <p className="textheading">Advance Claim</p>
            <p className="textsubheading">Nu.20,000</p>
          </div>
          <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
            <p className="textheading">Advance Type</p>
            <p className="textsubheading">Salary Advance</p>
          </div>
          <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
            <p className="textheading">Application Date</p>
            <p className="textsubheading">19/06/2024</p>
          </div>
          <div className="details py-1 col-lg-1 col-xl-1 col-md-4 col-6">
            <p className="textheading">Status</p>
            <p className="textsubheading text-success">Pending</p>
          </div>
          <div className="details py-1 col-lg-2 col-xl-2 col-md-4  col-6">
            <a
              href="/viewCurrentApplication"
              className="btn btn-outline-primary"
            >
              View Details
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
