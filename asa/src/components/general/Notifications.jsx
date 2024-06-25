import React from "react";

const Notifications = ({ toastRef, profileImage }) => {
  return (
    <div
      className="toast"
      ref={toastRef}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="toast-header">
        <h6 className="me-auto text-primary">Notifications</h6>
        <a href="">Mark all as read</a>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
      <div className="toast-body bg-white">
        <p className="textsubheading">Today</p>

        <div className="d-flex align-items-center">
          <img
            src={profileImage}
            className="rounded-circle me-2"
            style={{ width: "6vh", height: "6vh" }}
            alt="Profile"
          />
          <div className="ms-3">
            <p className="textsubheading">
              Thinley Yoezer requested for salary advance. Click here to see
              more.
            </p>
            <small className="text-primary">3 minutes ago</small>
          </div>
        </div>

        <div className="d-flex align-items-center">
          <img
            src={profileImage}
            className="rounded-circle me-2"
            style={{ width: "6vh", height: "6vh" }}
            alt="Profile"
          />
          <div className="ms-3">
            <p className="textsubheading">
              Thinley Yoezer requested for salary advance. Click here to see
              more.
            </p>
            <small className="text-primary">5 minutes ago</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
