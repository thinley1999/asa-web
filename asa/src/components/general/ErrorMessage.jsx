import React from "react";
import { SlClose } from "react-icons/sl";

const ErrorMessage = ({ message, onClose }) => {
  return (
    <div
      className="alert alert-danger alert-dismissible fade show myalert"
      role="alert"
      style={{ background: "#de0338", color: "white" }}
    >
      <span className="me-3">
        <SlClose fontSize={21} />
      </span>
      {message}
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={onClose}
      ></button>
    </div>
  );
};

export default ErrorMessage;
