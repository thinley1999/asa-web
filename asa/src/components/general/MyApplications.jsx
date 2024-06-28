import React from "react";

const MyApplications = ({
  heading,
  applications,
  activeTab,
  profileImage,
  title,
}) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <div
      className={`tab-pane fade ${activeTab === title ? "show active" : ""}`}
      id="currentapplication"
      role="tabpanel"
      aria-labelledby="ex1-tab-1"
    >
      <h6 className="custon-h6 py-2">{heading}</h6>

      {applications?.advances &&
        applications.advances.map((application, index) => (
          <div
            key={index}
            className="d-flex flex-wrap align-items-center py-3 px-2 mb-2 employeediv w-100"
          >
            <div className="d-flex align-items-center py-1 col-lg-3 col-xl-3 col-md-4 col-6 bio">
              <img
                src={profileImage}
                className="rounded-circle me-2"
                style={{ width: "8vh" }}
                alt="Profile"
              />
              <div>
                <p className="textheading">{application.user.name}</p>
                <p className="textsubheading">{application.user.email}</p>
              </div>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Advance Claim</p>
              <p className="textsubheading">Nu.{application.amount}</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Advance Type</p>
              <p className="textsubheading">{application.advance_type}</p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">Application Date</p>
              <p className="textsubheading">
                {formatDate(application.created_at)}
              </p>
            </div>
            <div className="details py-1 col-lg-1 col-xl-1 col-md-4 col-6">
              <p className="textheading">Status</p>
              <p className="textsubheading text-success">
                {application.status}
              </p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4  col-6">
              <a
                href="/viewCurrentApplication"
                className="btn btn-outline-primary"
              >
                View Details
              </a>
            </div>
          </div>
        ))}
    </div>
  );
};

export default MyApplications;
