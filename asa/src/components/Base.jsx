import React, { useEffect, useRef } from "react";
import logoImage from "../assets/img/rma-logo-white.png";
import profileImage from "../assets/img/Thinley.jpeg";
import { Outlet } from "react-router-dom";
import { Toast } from "bootstrap";

const Base = () => {
  const toastRef = useRef(null);

  useEffect(() => {
    const toastEl = toastRef.current;
    const toast = new Toast(toastEl);
    const showToast = () => {
      toast.show();
    };

    const btn = document.getElementById("showToastBtn");
    const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
    const sideNav = document.getElementById("side_nav");
    const closeBtn = document.getElementById("sidebarCloseBtn");

    if (btn) {
      btn.addEventListener("click", showToast);
    }

    if (sidebarToggleBtn && sideNav && closeBtn) {
      sidebarToggleBtn.addEventListener("click", () => {
        sideNav.classList.toggle("d-none");
      });

      closeBtn.addEventListener("click", () => {
        sideNav.classList.add("d-none");
      });
    }

    // Cleanup event listener on component unmount
    return () => {
      if (btn) {
        btn.removeEventListener("click", showToast);
      }

      if (sidebarToggleBtn && sideNav && closeBtn) {
        sidebarToggleBtn.removeEventListener("click", () => {
          sideNav.classList.toggle("d-none");
        });

        closeBtn.removeEventListener("click", () => {
          sideNav.classList.add("d-none");
        });
      }
    };
  }, []);

  return (
    <div className="main-container d-flex">
      {/* side bar */}
      <div className="sidebar d-none d-md-block" id="side_nav">
        <div className="header-box px-2 pt-3 pb-4 d-flex justify-content-between">
          <div className="spancontainer">
            <span>
              <img
                src={logoImage}
                alt=""
                className="img-fluid d-block mx-auto"
                style={{ width: "13vh" }}
              />
            </span>
            <span>
              <p className="customheading2">RMA ASA</p>
            </span>
          </div>
          <button
            className="btn d-md-none d-block close-btn px-1 py-0 text-white"
            id="sidebarCloseBtn"
          >
            <i className="fal fa-list"></i>
          </button>
        </div>

        <ul className="list-unstyled px-2">
          <li className="active">
            <a
              href="/dashboard"
              className="text-decoration-none px-3 py-2 d-block"
            >
              <i className="bi bi-house-door-fill customicon"></i>{" "}
              <span className="icontext">Dashboard</span>
            </a>
          </li>
          <li className="nav-item">
            <a
              href="/salaryAdvance"
              className="text-decoration-none px-3 py-2 d-block"
            >
              <i className="bi bi-cash-stack customicon"></i>{" "}
              <span className="icontext">Salary Advance</span>
            </a>
          </li>
          <li className="nav-item">
            <a
              href="/otherAdvance"
              className="text-decoration-none px-3 py-2 d-block"
            >
              <i className="bi bi-briefcase-fill customicon"></i>{" "}
              <span className="icontext">Other Advance</span>
            </a>
          </li>
          <li className="nav-item">
            <a
              href="/tourAdvance"
              className="text-decoration-none px-3 py-2 d-block"
            >
              <i className="bi bi-car-front-fill customicon"></i>{" "}
              <span className="icontext">Tour Advance</span>
            </a>
          </li>
          <li className="nav-item">
            <a
              href="/requestedAdvance"
              className="text-decoration-none px-3 py-2 d-block"
            >
              <i className="bi bi-cassette-fill customicon"></i>{" "}
              <span className="icontext">Requested Advance</span>
            </a>
          </li>
        </ul>

        <div className="signoutbtn">
          <button type="button" className="btn btn-danger">
            <i className="bi bi-box-arrow-right"></i> <span>Sign Out</span>
          </button>
        </div>
      </div>
      {/* end of side bar */}

      {/* nav bar */}
      <div className="content">
        <nav className="navbar navbar-expand-md">
          <div className="container-fluid">
            <div className="d-flex justify-content-between d-md-none d-block">
              <button className="btn px-1 py-0 open-btn" id="sidebarToggleBtn">
                <i className="bi bi-card-list"></i>
              </button>
              <a className="customtag" href="#">
                DASHBOARD
              </a>
            </div>

            <button className="p-0 border-0 d-none d-sm-block" type="button">
              <i className="bi bi-card-list"></i>
            </button>
            <button className="p-0 border-0 btn-responsive" type="button">
              <i className="bi bi-caret-down-fill"></i>
            </button>

            <div className="collapse navbar-collapse justify-content-start">
              <div className="navbar-nav mb-2 mb-lg-0">
                <a className="customtag" href="#">
                  DASHBOARD
                </a>
              </div>
            </div>

            <div className="collapse navbar-collapse justify-content-end me-5">
              <span>
                <button
                  type="button"
                  className="btn btn-info"
                  id="showToastBtn"
                >
                  <i className="bi bi-bell"></i>
                </button>
                <span className="badge">5</span>
              </span>

              <img
                src={profileImage}
                className="rounded-circle me-2"
                style={{ width: "8vh" }}
              />
              <div>
                <a className="profilelink text-decoration-none" href="/profile">
                  <p className="username">Thinley Yoezer</p>
                  <p className="userrole">User</p>
                </a>
              </div>
            </div>
          </div>
        </nav>

        <div className="px-1 pt-2">
          <Outlet />
        </div>
      </div>
      {/* nav bar */}

      {/* Toast element */}
      <div
        className="toast-container position-fixed top-0 start-50 translate-middle-x p-3"
        style={{ zIndex: 1055 }}
      >
        <div
          className="toast"
          ref={toastRef}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <h6 className="me-auto text-primary">Notifications</h6>
            <a href="">Mark all as read</a>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body bg-white">
            <p className="textsubheading">Today</p>

            <div className="d-flex align-items-center">
              <img
                src={profileImage}
                className="rounded-circle me-2"
                style={{ width: "6vh", height: "6vh" }}
                alt="Profile"
              />
              <div className="ms-3">
                <p className="textsubheading">
                  Thinley Yoezer requested for salary advance. Click here to see
                  more.
                </p>
                <small className="text-primary">3 minutes ago</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Base;
