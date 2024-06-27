import React, { useState } from "react";
import vectorImage from "../assets/img/vector.jpg";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/img/rma-logo-white.png";
import "../assets/css/main.css";
import AuthServices from "./services/AuthServices";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await AuthServices.login(username, password);

      if (response && response.status === 200) {
        const token = response.headers.authorization;
        const user = response.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("id", user.id);
        navigate("/dashboard");
      } else {
        setError("Internal Server Issue");
      }
    } catch (error) {
      setError(error.response?.data || "An error occurred");
    }
  };

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
              <form
                style={{ maxWidth: "23rem", width: "100%" }}
                onSubmit={handleLogin}
              >
                <div className="form-outline mb-4">
                  <label className="form-label customlabel">Employee ID</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label customlabel">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-outline mb-4">
                  <button type="submit" className="btn custombutton w-100">
                    Login
                  </button>
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
