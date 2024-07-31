import React from "react";
import { useNavigate } from "react-router-dom";

const MyApplications = ({
  heading,
  applications,
  activeTab,
  profileImage,
  title,
}) => {
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDetails = (id) => {
    navigate(`/advanceDetail/${id}`);
  };

  const handleDSAClaim = (id) => {
    navigate(`/dsaClaim/${id}`);
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
                src={application?.user?.profile_pic?.url}
                className="rounded-circle me-2"
                style={{ width: "8vh", height: "8vh" }}
                alt="Profile"
              />
              <div>
                <p className="textheading">{application.user.name}</p>
                <p className="textsubheading">{application.user.email}</p>
              </div>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">
                <span
                  className={`${application.claim_dsa ? "p-1 bg-warning" : ""}`}
                >
                  {application.claim_dsa ? "DSA Claim" : "Advance Claim"}
                </span>
              </p>
              <p className="textsubheading">
                {application.advance_type === "ex_country_tour_advance"
                  ? `Nu.${application.advance_amount?.Nu ?? 0}, INR.${
                      application.advance_amount?.INR ?? 0
                    },  USD.${application.advance_amount?.USD ?? 0}`
                  : `Nu.${application.amount ?? 0}`}
              </p>
            </div>
            <div className="details py-1 col-lg-2 col-xl-2 col-md-4 col-6">
              <p className="textheading">
                {application.claim_dsa ? "DSA Type" : "Advance Type"}
              </p>
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
                onClick={() => handleDetails(application.id)}
                className="btn btn-outline-primary btn-fixed-width"
              >
                View Details
              </a>
              {application.status === "dispatched" &&
                (application.advance_type === "ex_country_tour_advance" ||
                  application.advance_type === "in_country_tour_advance") && (
                  <a
                    className="btn btn-outline-success mt-1 btn-fixed-width"
                    onClick={() => handleDSAClaim(application.id)}
                  >
                    Claim DSA
                  </a>
                )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default MyApplications;
