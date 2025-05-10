import React, { useState, useEffect } from "react";
import vectorImage from "../assets/img/vector.jpg";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/img/rma-logo-white.png";
import "../assets/css/main.css";
import AuthServices from "./services/AuthServices";
import LoginoutMessage from "./general/LoginoutMessage";
import ErrorMessageToast from "./general/ErrorMessageToast";

const Login = () => {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmployeeId, setForgotEmployeeId] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedOut = localStorage.getItem("isLoggedOut");
    if (isLoggedOut) {
      setIsLoggedOut(true);
      localStorage.removeItem("isLoggedOut");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

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
      const errorMessage = error.response?.data?.error || "An error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmployeeId.trim()) {
      setForgotPasswordMessage("Please enter your Employee ID");
      return;
    }

    setIsForgotPasswordLoading(true);
    setForgotPasswordMessage("");

    try {
      const response = await AuthServices.forgotPassword(forgotEmployeeId);
      if (response.status === 200) {
        setForgotPasswordMessage("Password reset instructions sent to your email.");
        setTimeout(() => closeModal(), 2000);
      } else {
        setForgotPasswordMessage("Unable to send reset instructions.");
      }
    } catch (err) {
      setForgotPasswordMessage(
        err.response?.data?.error || "Error occurred while requesting password reset."
      );
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  const closeModal = () => {
    setShowForgotPassword(false);
    setForgotEmployeeId("");
    setForgotPasswordMessage("");
  };

  const Loader = ({ small = false }) => (
    <div className="d-flex justify-content-center">
      <div 
        className={`spinner-border ${small ? "spinner-border-sm" : ""} text-white`} 
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="vh-100">
      {isLoggedOut && <LoginoutMessage message="Logout Successful!!!" />}
      {error && <ErrorMessageToast message={error} />}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Forgot Password</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={closeModal}
                  disabled={isForgotPasswordLoading}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="employeeId" className="form-label">Employee ID</label>
                  <input
                    type="text"
                    className="form-control"
                    id="employeeId"
                    placeholder="Enter Employee ID"
                    value={forgotEmployeeId}
                    onChange={(e) => setForgotEmployeeId(e.target.value)}
                    disabled={isForgotPasswordLoading}
                  />
                </div>
                {forgotPasswordMessage && (
                  <div className={`alert ${forgotPasswordMessage.includes("sent") ? "alert-success" : "alert-danger"}`}>
                    {forgotPasswordMessage}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleForgotPassword}
                  disabled={isForgotPasswordLoading || !forgotEmployeeId.trim()}
                >
                  {isForgotPasswordLoading ? <Loader small /> : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Login Content */}
      <div className="container-fluid">
        <div className="row">
          {/* Image column */}
          <div className="col-sm-6 px-0 d-none d-sm-block">
            <img
              src={vectorImage}
              alt="Login"
              className="img-fluid vh-100"
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Form column */}
          <div className="col-sm-6 mt-5">
            <div className="px-5 ms-xl-4">
              <img
                src={logoImage}
                alt="Company Logo"
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                  />
                </div>
                <div className="form-outline mb-4">
                  <button 
                    type="submit" 
                    className="btn custombutton w-100"
                    disabled={isLoading || !username.trim() || !password.trim()}
                  >
                    {isLoading ? <Loader /> : "Login"}
                  </button>
                </div>
              </form>
              <div style={{ maxWidth: "23rem", width: "100%" }}>
                <p className="small mb-5 pb-lg-2 text-center customlabel">
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={() => setShowForgotPassword(true)}
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-page loader for better UX */}
      {(isLoading || isForgotPasswordLoading) && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
             style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.3)', pointerEvents: 'none' }}>
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
        </div>
      )}
    </div>
  );
};

export default Login;