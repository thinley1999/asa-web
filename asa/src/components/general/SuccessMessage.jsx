import React from "react";

const SuccessMessage = ({ message, onClose }) => {
  return (
    <div
      className="alert alert-success alert-dismissible fade show myalert"
      role="alert"
    >
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

export default SuccessMessage;
