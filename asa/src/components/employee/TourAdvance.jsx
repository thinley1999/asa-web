import React, { useState } from "react";
import "../../assets/css/main.css";

const TourAdvance = () => {
  const [activeTab, setActiveTab] = useState("incountrytour");

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div>
      {/* Tabs navs */}
      <ul className="nav nav-tabs mb-2 col-12 mynav" id="ex1" role="tablist">
        <li className="nav-item col-6 text-center tablist" role="presentation">
          <a
            className={`nav-link ${
              activeTab === "incountrytour" ? "active" : ""
            }`}
            id="ex1-tab-1"
            href="#incountrytour"
            role="tab"
            aria-controls="incountrytour"
            aria-selected={activeTab === "incountrytour" ? "true" : "false"}
            onClick={() => handleTabClick("incountrytour")}
            style={{ color: activeTab === "incountrytour" ? "blue" : "" }}
          >
            <span>
              <i className="bi bi-car-front-fill customicon"></i>
            </span>
            <span> In Country Tour</span>
          </a>
        </li>
        <li className="nav-item col-6 text-center tablist" role="presentation">
          <a
            className={`nav-link ${
              activeTab === "excountrytour" ? "active" : ""
            }`}
            id="ex1-tab-2"
            href="#excountrytour"
            role="tab"
            aria-controls="excountrytour"
            aria-selected={activeTab === "excountrytour" ? "true" : "false"}
            onClick={() => handleTabClick("excountrytour")}
            style={{ color: activeTab === "excountrytour" ? "blue" : "" }}
          >
            <span>
              <i className="bi bi-airplane-fill customicon"></i>
            </span>
            <span> Ex Country Tour</span>
          </a>
        </li>
      </ul>
      {/* Tabs navs */}

      {/* Tabs content */}
      <div className="tab-content col-12">
        <div
          className={`tab-pane fade mt-2 mb-3 ${
            activeTab === "incountrytour" ? "show active" : ""
          }`}
          id="incountrytour"
          role="tabpanel"
          aria-labelledby="ex1-tab-1"
        >
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
                  <label className="form-label">
                    Office order & revalent documents
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
              <button type="button" className="btn">
                <i className="bi bi-plus-square-fill fs-4 text-primary"></i>
              </button>
            </div>

            <div className="bg-white px-4">
              <div className="row w-100 ">
                <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                  <label className="form-label">Total Advance</label>
                  <input
                    className="form-control"
                    type="text"
                    name="totalAdvance"
                    value="Nu. 20,000"
                    disabled
                  />
                </div>
                <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                  <label className="form-label">Purpose of advance</label>
                  <textarea
                    className="form-control"
                    name="purpose"
                    rows="3"
                    disabled
                  ></textarea>
                </div>
                <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                  <label className="form-label">Documents</label>
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
                    name="rmarks"
                    rows="6"
                    disabled
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="bg-white px-4 pb-3 text-center">
              <button type="button" className="btn btn-primary px-5">
                Submit
              </button>
            </div>
          </form>
        </div>

        <div
          className={`tab-pane fade ${
            activeTab === "excountrytour" ? "show active" : ""
          }`}
          id="excountrytour"
          role="tabpanel"
          aria-labelledby="ex1-tab-2"
        >
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
                  <label className="form-label">
                    Office order & revalent documents
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
              </div>
            </div>
            <div className="bg-white px-4 pb-3 text-center">
              <button type="button" className="btn btn-primary px-5">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Tabs content */}
    </div>
  );
};

export default TourAdvance;
