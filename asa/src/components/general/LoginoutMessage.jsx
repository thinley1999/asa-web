import React, { useState, useEffect } from "react";
import { FaCircleCheck } from "react-icons/fa6";

const LoginoutMessage = ({ message }) => {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      {show && (
        <div
          className="toast align-items-center show login-success-toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body fs-6">
              <span className="pe-1 fw-bold">
                <FaCircleCheck fontSize={20} color="#01a845" />
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

export default LoginoutMessage;
