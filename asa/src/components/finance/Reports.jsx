import React, { useState } from "react";
import CustomInput from "../general/CustomInput";
import ReportTable from "../general/ReportTable";

const Reports = () => {
  const [reportType, setReportType] = useState("");
  const [isEmpNoDisabled, setIsEmpNoDisabled] = useState(false);

  const handleReportTypeChange = (e) => {
    const value = e.target.value;
    setReportType(value);
    if (value === "All") {
      setIsEmpNoDisabled(false);
    } else {
      setIsEmpNoDisabled(true);
    }
  };

  return (
    <div>
      <div className="bg-white px-4 pt-4">
        <div className="row w-100">
          <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
            <label className="form-label">Report Type</label>
            <select
              className="form-select"
              name="reportType"
              value={reportType}
              onChange={handleReportTypeChange}
            >
              <option disabled>Select Report Type</option>
              <option value="Individual">Individual</option>
              <option value="All">All</option>
            </select>
          </div>
          <CustomInput name="startDate" type="date" label="Start Date" />
          <CustomInput name="endDate" type="date" label="End Date" />
          <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
            <label className="form-label">Advance Type</label>
            <select className="form-select" name="advanceType">
              <option disabled>Select Advance Type</option>
              <option value="Salary Advance">Salary Advance</option>
              <option value="Other Advance">Other Advance</option>
              <option value="In Country Advance">In Country Advance</option>
              <option value="Ex Country Advance">Ex Country Advance</option>
              <option value="All">All</option>
            </select>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
            <label className="form-label">Department</label>
            <select className="form-select" name="department">
              <option disabled>Select Department</option>
              <option value="Department">Department</option>
              <option value="All">All</option>
            </select>
          </div>
          <CustomInput
            name="empno"
            type="number"
            label="Employee No."
            isDisable={isEmpNoDisabled}
          />
          <div className="col-12 mb-3 d-flex justify-content-end">
            <button type="button" className="btn btn-secondary me-2">
              Apply
            </button>
            <button type="button" className="btn btn-secondary">
              Clear
            </button>
          </div>
        </div>
      </div>
      <ReportTable />
    </div>
  );
};

export default Reports;
