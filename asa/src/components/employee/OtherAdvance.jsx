import React from "react";
import "../../assets/css/main.css";

const OtherAdvance = () => {
  return (
    <div className="my-3">
      <form action="">
        <div className="bg-white px-4 py-4">
          <div className="row w-100 ">
            <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
              <label className="form-label">First Name</label>
              <input
                className="form-control"
                type="text"
                name="firstName"
                value="Thinley"
                disabled
              />
            </div>

            <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
              <label className="form-label">Middle Name</label>
              <input
                className="form-control"
                type="text"
                name="middleName"
                value="None"
                disabled
              />
            </div>

            <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
              <label className="form-label">Last Name</label>
              <input
                className="form-control"
                type="text"
                name="lastName"
                value="Yoezer"
                disabled
              />
            </div>

            <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
              <label className="form-label">Employee ID</label>
              <input
                className="form-control"
                type="text"
                name="employeeid"
                value="2023003"
                disabled
              />
            </div>

            <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
              <label className="form-label">Date</label>
              <input
                className="form-control"
                type="date"
                name="date"
                value="2024-06-19"
                disabled
              />
            </div>

            <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3s">
              <label className="form-label">Department</label>
              <input
                className="form-control"
                type="text"
                name="department"
                value="DIT"
                disabled
              />
            </div>

            <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
              <label className="form-label">Designation</label>
              <input
                className="form-control"
                type="text"
                name="designation"
                value="Asst. ICT Officer"
                disabled
              />
            </div>

            <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
              <label className="form-label">Advance Amount (Nu)*</label>
              <input
                className="form-control"
                type="text"
                name="advanceAmount"
                value="Nu. 40,000"
                disabled
              />
            </div>

            <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
              <label className="form-label">Advance Type</label>
              <select className="form-select" name="advanceType" disabled>
                <option selected>Select Advance Type</option>
                <option value="1" selected>
                  Medical Advance
                </option>
                <option value="2">Study Advance</option>
              </select>
            </div>

            <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
              <label className="form-label">Relavant Documents</label>
              <div className="d-flex">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ borderRadius: "0" }}
                >
                  <i className="bi bi-cloud-check-fill fs-6"></i>{" "}
                  <span>Upload File</span>
                </button>
                <span className="textwithbtn">Max file size 10 MB</span>
              </div>
            </div>

            <div className="tourdetails col-xl-6 col-lg-6 col-md-6 col-12 mb-3">
              <label className="form-label">Purpose of advance</label>
              <textarea
                class="form-control"
                name="purpose"
                rows="3"
                disabled
              ></textarea>
            </div>
          </div>
        </div>
        <div className="bg-white px-4 pb-3 text-center">
          <button type="button" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default OtherAdvance;
