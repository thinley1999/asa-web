import React from "react";
import { Link } from "react-router-dom";
import vectorImage from "../assets/img/vector.jpg";
import logoImage from "../assets/img/rma-logo-white.png";
import "../assets/css/main.css";

const Login = () => {
  return (
    <div className="vh-100">
      <div className="container-fluid">
        <div className="row">
          {/* Image column */}
          <div className="col-sm-6 px-0 d-none d-md-block">
            <img
              src={vectorImage}
              alt="Login image"
              className="img-fluid vh-100"
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Form column */}
          <div className="col-sm-6 mt-5">
            <div className="px-5 ms-xl-4">
              <img
                src={logoImage}
                alt=""
                className="img-fluid d-block mx-auto"
                style={{ width: "18vh" }}
              />
              <p className="customheading">Login to your account</p>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center h-custom-2 px-5 ms-xl-4">
              <form style={{ maxWidth: "23rem", width: "100%" }}>
                <div className="form-outline mb-4">
                  <label className="form-label customlabel">Employee ID</label>
                  <input
                    type="text"
                    name="employeeId"
                    className="form-control"
                  />
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label customlabel">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                  />
                </div>
                <div className="form-outline mb-4">
                  <Link
                    to="/dashboard"
                    type="submit"
                    className="btn custombutton w-100"
                  >
                    Login
                  </Link>
                </div>
              </form>
              <div style={{ maxWidth: "23rem", width: "100%" }}>
                <p className="small mb-5 pb-lg-2 text-center customlabel">
                  <a href="#!">Forgot password?</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
