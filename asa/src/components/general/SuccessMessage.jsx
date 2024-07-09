import React from "react";
import { FaRegCheckCircle } from "react-icons/fa";

const SuccessMessage = ({ message, onClose }) => {
  return (
    <div
      className="alert alert-dismissible fade show myalert"
      role="alert"
      style={{ background: "#2dd284", color: "white" }}
    >
      <span className="me-3">
        <FaRegCheckCircle fontSize={21} />
      </span>
      {message}
      <button type="button" className="btn-close " onClick={onClose}></button>
    </div>
  );
};

export default SuccessMessage;
