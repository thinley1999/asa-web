import React from "react";
import logoImage from "../assets/img/rma-logo-white.png";
import profileImage from "../assets/img/Thinley.jpeg";
import { Outlet } from "react-router-dom";

const Base = () => {
  return (
    <div className="main-container d-flex">
      <div className="sidebar" id="side_nav">
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
          <button className="btn d-md-none d-block close-btn px-1 py-0 text-white">
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

      <div className="content">
        <nav className="navbar navbar-expand-md">
          <div className="container-fluid">
            <div className="d-flex justify-content-between d-md-none d-block">
              <button className="btn px-1 py-0 open-btn">
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
                <button type="button" className="btn btn-info">
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
    </div>
  );
};

export default Base;
