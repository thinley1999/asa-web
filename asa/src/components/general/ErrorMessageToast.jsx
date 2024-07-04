import React, { useState, useEffect } from "react";
import { IoMdCloseCircle } from "react-icons/io";

const ErrorMessageToast = ({ message }) => {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      {show && (
        <div
          className="toast align-items-center show error-message-toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body fs-6">
              <span className="pe-1 fw-bold">
                <IoMdCloseCircle fontSize={20} color="#F83C2F" />
              </span>{" "}
              {message}
            </div>
            <button
              type="button"
              className="btn-close me-2 m-auto"
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorMessageToast;
