import React from "react";

const LoginSuccess = () => {
  const [show, setShow] = useState(true);
  return (
    <div
      className={`toast align-items-center text-white bg-primary border-0 ${
        show ? "show" : ""
      }`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="d-flex">
        <div className="toast-body">Hello, world! This is a toast message.</div>
        <button
          type="button"
          className="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
          onClick={() => setShow(false)}
        ></button>
      </div>
    </div>
  );
};

export default LoginSuccess;
