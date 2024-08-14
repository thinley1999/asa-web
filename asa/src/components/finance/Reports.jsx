import React, { useState } from "react";
import CustomInput from "../general/CustomInput";
import ReportTable from "./ReportTable";
import ClaimDropDown from "../employee/ClainDropDown";
import { departments } from "../datas/department_list";
import ReportServices from "../services/ReportServices";

const Reports = () => {
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState();
  const [reportData, setReportData] = useState([]);
  const [totalAmount, setTotalAmount] = useState({});
  const [filters, setFilters] = useState({
    report_type: "",
    start_date: "",
    end_date: "",
    advance_type: "",
    department: "",
    employee_id: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFilterClear = () => {
    setFilters({
      report_type: "",
      start_date: "",
      end_date: "",
      advance_type: "",
      department: "",
      employee_id: "",
    });
    setErrors({});
    setReportData([]);
    setTotalAmount({});
  };

  const validateFilters = () => {
    const newErrors = {};
    const {
      report_type,
      start_date,
      end_date,
      advance_type,
      department,
      employee_id,
    } = filters;

    if (!report_type) {
      newErrors.report_type = "Report Type is required";
    }

    if (start_date && end_date) {
      if (new Date(start_date) >= new Date(end_date)) {
        newErrors.end_date = "End date should be later than start date";
      }
    } else {
      if (!start_date) {
        newErrors.start_date = "Start Date is required";
      }
      if (!end_date) {
        newErrors.end_date = "End Date is required";
      }
    }

    if (report_type === "Individual" && !employee_id) {
      newErrors.employee_id = "Employee No. is required for Individual report";
    }

    if (report_type === "All") {
      if (!advance_type) {
        newErrors.advance_type = "Advance Type is required for All reports";
      }
      if (!department) {
        newErrors.department = "Department is required for All reports";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateFilters()) {
      try {
        const response = await ReportServices.get(filters);
        if (response) {
          setReportData(response.data.advances);
          setTotalAmount(response.data.total);
        }
      } catch (error) {
        setErrorMessage("An error occurred");
      }
    } else {
      console.log("Validation errors", errors);
    }
  };

  console.log("response message", reportData);
  // console.log("reportdata length", reportData.length);

  return (
    <div>
      <div className="bg-white px-4 pt-4">
        <div className="row w-100">
          <ClaimDropDown
            label="Report Type"
            name="report_type"
            value={filters.report_type}
            handleChange={handleFilterChange}
            errors={errors.report_type}
            dropDown={["Individual", "All"]}
            disoptions="Select Select Report Type"
          />
          <CustomInput
            error={errors.start_date}
            name="start_date"
            type="date"
            label="Start Date"
            value={filters.start_date}
            onChange={handleFilterChange}
          />
          <CustomInput
            error={errors.end_date}
            name="end_date"
            type="date"
            label="End Date"
            value={filters.end_date}
            onChange={handleFilterChange}
          />
          {filters.report_type === "Individual" ? (
            <>
              <CustomInput
                name="employee_id"
                type="number"
                label="Employee No."
                value={filters.employee_id}
                onChange={handleFilterChange}
                error={errors.employee_id}
              />
              <ClaimDropDown
                label="Advance Type"
                name="advance_type"
                value={filters.advance_type}
                handleChange={handleFilterChange}
                dropDown={[
                  "Salary Advance",
                  "Other Advance",
                  "In Country Tour Advance",
                  "Ex Country Tour Advance",
                  "Dsa Claim",
                ]}
                disoptions="Select Advance Type"
                errors={errors.advance_type}
              />
            </>
          ) : filters.report_type === "All" ? (
            <>
              <ClaimDropDown
                label="Advance Type"
                name="advance_type"
                value={filters.advance_type}
                handleChange={handleFilterChange}
                dropDown={[
                  "Salary Advance",
                  "Other Advance",
                  "In Country Tour Advance",
                  "Ex Country Tour Advance",
                  "All",
                ]}
                disoptions="Select Advance Type"
                errors={errors.advance_type}
              />
              <ClaimDropDown
                label="Department"
                name="department"
                value={filters.department}
                handleChange={handleFilterChange}
                errors={errors.department}
                dropDown={departments}
                disoptions="Select Department"
              />
            </>
          ) : null}
          <div className="col-12 mb-3 d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={handleSubmit}
            >
              Apply
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleFilterClear}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      <ReportTable data={reportData} total={totalAmount} filters={filters} />
    </div>
  );
};

export default Reports;
