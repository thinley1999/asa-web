import React from "react";
import "../../assets/css/main.css";

const ViewPreviousApplication = () => {
  return (
    <div className="my-3">
      <form action="">
        <div className="bg-white px-4 pt-4">
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
              <label className="form-label">Tour Type</label>
              <select className="form-select" name="advanceType" disabled>
                <option selected>Select Tour Type</option>
                <option value="1" selected>
                  Excountry
                </option>
                <option value="2">Incountry</option>
              </select>
            </div>

            <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
              <label className="form-label">Download Attchment</label>
              <div className="d-flex">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ borderRadius: "0" }}
                >
                  <span>Download</span> <i className="bi bi-download"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white px-4">
          <label className="form-label">Travel Itinerary</label>
          <div className="row w-100 ">
            <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
              <label className="form-label">Start Date</label>
              <input
                className="form-control"
                type="date"
                name="startDate"
                value="2024-06-19"
                disabled
              />
            </div>
            <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
              <label className="form-label">End Date</label>
              <input
                className="form-control"
                type="date"
                name="endDate"
                value="2024-06-19"
                disabled
              />
            </div>
            <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
              <label className="form-label">From</label>
              <select className="form-select" name="from" disabled>
                <option selected>Select From</option>
                <option value="1" selected>
                  Thimphu
                </option>
                <option value="2">Paro</option>
                <option value="3">Wangdue</option>
              </select>
            </div>
            <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
              <label className="form-label">To</label>
              <select className="form-select" name="to" disabled>
                <option selected>Select To</option>
                <option value="1" selected>
                  Thimphu
                </option>
                <option value="2">Paro</option>
                <option value="3">Wangdue</option>
              </select>
            </div>
            <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
              <label className="form-label">Mode of travel</label>
              <select className="form-select" name="mode" disabled>
                <option selected>Select mode of travel</option>
                <option value="1" selected>
                  Airplane
                </option>
                <option value="2">Train</option>
                <option value="3">Car</option>
              </select>
            </div>
            <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
              <label className="form-label">Rate</label>
              <input
                className="form-control"
                type="text"
                name="rate"
                value="50$"
                disabled
              />
            </div>
          </div>
          <div className="row w-100 ">
            <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
              <label className="form-label">Start Date</label>
              <input
                className="form-control"
                type="date"
                name="startDate"
                value="2024-06-19"
                disabled
              />
            </div>
            <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
              <label className="form-label">End Date</label>
              <input
                className="form-control"
                type="date"
                name="endDate"
                value="2024-06-19"
                disabled
              />
            </div>
            <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
              <label className="form-label">From</label>
              <select className="form-select" name="from" disabled>
                <option selected>Select From</option>
                <option value="1" selected>
                  Thimphu
                </option>
                <option value="2">Paro</option>
                <option value="3">Wangdue</option>
              </select>
            </div>
            <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
              <label className="form-label">To</label>
              <select className="form-select" name="to" disabled>
                <option selected>Select To</option>
                <option value="1" selected>
                  Thimphu
                </option>
                <option value="2">Paro</option>
                <option value="3">Wangdue</option>
              </select>
            </div>
            <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
              <label className="form-label">Mode of travel</label>
              <select className="form-select" name="mode" disabled>
                <option selected>Select mode of travel</option>
                <option value="1" selected>
                  Airplane
                </option>
                <option value="2">Train</option>
                <option value="3">Car</option>
              </select>
            </div>
            <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
              <label className="form-label">Rate</label>
              <input
                className="form-control"
                type="text"
                name="rate"
                value="50$"
                disabled
              />
            </div>
          </div>
        </div>
        <div className="bg-white px-4">
          <div className="row w-100 ">
            <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
              <label className="form-label">Stop Over</label>
              <select className="form-select" name="from" disabled>
                <option selected>Select Stop Over</option>
                <option value="1" selected>
                  Bangkok
                </option>
                <option value="2">Dehli</option>
              </select>
            </div>
            <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
              <label className="form-label">Rate</label>
              <input
                className="form-control"
                type="text"
                name="rate"
                value="50$"
                disabled
              />
            </div>
          </div>
          <div className="row w-100 ">
            <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
              <label className="form-label">Stop Over</label>
              <select className="form-select" name="from" disabled>
                <option selected>Select Stop Over</option>
                <option value="1" selected>
                  Bangkok
                </option>
                <option value="2">Dehli</option>
              </select>
            </div>
            <div className="tourdetails col-xl-2 col-lg-2 col-md-4 col-12 mb-3">
              <label className="form-label">Rate</label>
              <input
                className="form-control"
                type="text"
                name="rate"
                value="50$"
                disabled
              />
            </div>
          </div>
        </div>
        <div className="bg-white px-4">
          <div className="row w-100 ">
            <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
              <label className="form-label">Additional Information</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  checked
                />
                <label className="form-label">Accomodation is provided</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  checked
                />
                <label className="form-label">Meal is provided</label>
              </div>
            </div>

            <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
              <label className="form-label">Total Advance Issued</label>
              <input
                className="form-control"
                type="text"
                name="totalAdvance Issued"
                value="USD 230"
                disabled
              />
            </div>

            <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
              <label className="form-label">
                Air tickets & relevant documents
              </label>
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
              <label className="form-label">Remarks</label>
              <textarea
                className="form-control"
                name="remarks"
                rows="5"
                disabled
              ></textarea>
            </div>
          </div>
        </div>
        <div className="bg-white px-4 pb-3 text-center">
          <button type="button" className="btn btn-primary">
            Claim DSA
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewPreviousApplication;
