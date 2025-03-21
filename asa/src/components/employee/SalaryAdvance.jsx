import React, { useState, useEffect } from "react";
import "../../assets/css/main.css";
import CustomInput from "../general/CustomInput";
import UserServices from "../services/UserServices";
import AdvanceServices from "../services/AdvanceServices";
import SuccessMessage from "../general/SuccessMessage";
import ErrorMessage from "../general/ErrorMessage";
import { formatDate } from "../utils/DateUtils";

const SalaryAdvance = ({ data, showButtons, handleDialogOpen, editData }) => {
  const [user, setUser] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const initialFormData = {
    firstName: " - ",
    middleName: " - ",
    lastName: "- ",
    date: new Date().toISOString().slice(0, 10),
    department: "",
    designation: " ",
    totalAmount: 0,
    thresholdAmount: " ",
    duration: 0,
    deduction: 0.0,
    purpose: " ",
    username: " ",
    advance_type: "salary_advance",
    completion_month: "june 2023",
    tour_type: "salary_advance"
  };
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (data) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        date: formatDate(data.created_at) || " -",
        totalAmount: data.amount || 0,
        thresholdAmount: data.basic_pay * 2 || " ",
        duration: data.advance_detail.duration || 0,
        deduction: data.advance_detail.deduction || 0.0,
        purpose: data.purpose || " ",
        advance_type: data.advance_type || "salary_advance",
        completion_month: data.advance_detail.completion_month || "june 2023",
        tour_type: "salary_advance",
      }));
    }
  }, [data]);

  function monthsUntilFinYearEnd(currentDate) {
    let currentDay = currentDate.getDate();
    let currentMonth = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();
    let financialEndYear = null;
  
    if (currentMonth < 7) {
        financialEndYear = currentYear;
    } else {
        financialEndYear = currentYear + 1;
    }
  
    let monthsLeft;
  
    if (currentMonth >= 7) {
        monthsLeft = 12 - currentMonth + 6;
    } else {
        monthsLeft = 6 - currentMonth;
    }
  
    if (currentDay < 25) { monthsLeft += 1; }
  
    return Math.min(monthsLeft, 10);
  }

  const fetchUserDetails = async () => {
    try {
      const response = await UserServices.showDetail(
        data ? data.user.id : null
      );

      if (response && response.status === 200) {
        setUser(response.data);
        updateFormDataWithUserName(response.data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const updateFormDataWithUserName = (user) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      firstName: user.first_name || prevFormData.firstName,
      middleName: user.middle_name || prevFormData.middleName,
      lastName: user.last_name || prevFormData.lastName,
      designation: user.position_title || prevFormData.designation,
      thresholdAmount: user.net_pay * 2 || prevFormData.thresholdAmount,
      department: user.department_name || prevFormData.department,
      username: user.username || prevFormData.username,
    }));
  };

  const calculateDeduction = () => {
    const { totalAmount, duration } = formData;
    if (duration <= 0) {
      return 0;
    }
    const deduction = Math.ceil(parseFloat(totalAmount) / parseFloat(duration));
    setFormData((prevFormData) => ({
      ...prevFormData,
      deduction: deduction,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (name === "advanceAmount") {
        if (value > 0 && value <= formData.thresholdAmount) {
          delete newErrors.advanceAmount;
        }
      }
      if (name === "duration") {
        if (value > 0 && value < 10) {
          delete newErrors.duration;
        }
      }
      if (name === "purpose") {
        if (value.trim()) {
          delete newErrors.purpose;
        }
      }
      return newErrors;
    });
  };

  const validateForm = (isUpdate = false) => {
    let errors = {};
    let maxDate = monthsUntilFinYearEnd(new Date());
  
    // Allow amount to be more than threshold during update
    if (formData.totalAmount <= 0 || (!isUpdate && formData.totalAmount > formData.thresholdAmount)) {
      errors.advanceAmount =
        "Advance amount should be more than 0" + (isUpdate ? "" : " and less than the threshold amount.");
    }
    if (formData.duration <= 0 || formData.duration > maxDate) {
      errors.duration = `Duration should be less than or equal to ${maxDate}.`;
    }
    if (!formData.purpose.trim()) {
      errors.purpose = "Purpose is required.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm(false)) {
      try {
        const response = await AdvanceServices.create(formData);

        if (response) {
          setSuccessMessage("Advance created successfully");
          resetForm();
        } else {
          setErrorMessage("Internal Server Error");
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "An error occurred");
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateAdvance = async (e) => {
    e.preventDefault();
    if (validateForm(true)) {
      try {
        const response = await AdvanceServices.update(data.id, formData);
     
        if (response) {
          setSuccessMessage("Advance Updated successfully");
        } else {
          setErrorMessage("Internal Server Error");
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "An error occurred");
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalAmount: initialFormData.totalAmount,
      duration: initialFormData.duration,
      purpose: initialFormData.purpose,
      deduction: initialFormData.deduction,
    }));
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage("");
  };

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (formData.totalAmount && formData.duration) {
      calculateDeduction();
    }
  }, [formData.totalAmount, formData.duration]);

  return (
    <div>
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={handleCloseSuccessMessage}
        />
      )}
      {errorMessage && (
        <ErrorMessage
          message={errorMessage}
          onClose={handleCloseErrorMessage}
        />
      )}
      <form onSubmit={handleSubmit}>
        <div className="bg-white px-4 py-4">
          <div className="row w-100 ">
            <CustomInput
              label="First Name"
              type="text"
              value={formData.firstName}
              name="firstName"
              isDisable={true}
              onChange={handleChange}
            />
            <CustomInput
              label="Middle Name"
              type="text"
              value={formData.middleName}
              name="middleName"
              isDisable={true}
              onChange={handleChange}
            />
            <CustomInput
              label="Last Name"
              type="text"
              value={formData.lastName}
              name="lastName"
              isDisable={true}
              onChange={handleChange}
            />
            <CustomInput
              label="Employee ID"
              type="text"
              value={formData.username}
              name="username"
              isDisable={true}
              onChange={handleChange}
            />
            <CustomInput
              label="Date"
              type="text"
              value={formData.date}
              name="date"
              isDisable={true}
              onChange={handleChange}
            />
            <CustomInput
              label="Department"
              type="text"
              value={formData.department}
              name="department"
              isDisable={true}
              onChange={handleChange}
            />
            <CustomInput
              label="Designation"
              type="text"
              value={formData.designation}
              name="designation"
              isDisable={true}
              onChange={handleChange}
            />
            <CustomInput
              label="Advance Amount(Nu)*"
              type="number"
              value={formData.totalAmount}
              name="totalAmount"
              isDisable={data ? (editData ? false : true) : false}
              onChange={handleChange}
              error={formErrors.advanceAmount}
            />
            <CustomInput
              label="Threshold Amount (Net pay * 2)"
              type="number"
              value={formData.thresholdAmount}
              name="thresholdAmount"
              isDisable={true}
              onChange={handleChange}
            />
            <CustomInput
              label="Duration in months*"
              type="number"
              value={formData.duration}
              name="duration"
              isDisable={data ? (editData ? false : true) : false}
              onChange={handleChange}
              error={formErrors.duration}
            />
            <CustomInput
              label="Monthly deduction(Nu)"
              type="text"
              value={formData.deduction}
              name="deduction"
              isDisable={true}
              onChange={handleChange}
            />

            <div className="tourdetails col-xl-6 col-lg-6 col-md-6 col-12 mb-3">
              <label className="form-label">Purpose of advance</label>
              <textarea
                className={`form-control ${
                  formErrors.purpose ? "is-invalid" : ""
                }`}
                name="purpose"
                rows="4"
                value={formData.purpose}
                onChange={handleChange}
                disabled={data ? (editData ? false : true) : false}
              ></textarea>
              {formErrors.purpose && (
                <div className="invalid-feedback" style={{ display: "block" }}>
                  {formErrors.purpose}
                </div>
              )}
            </div>
          </div>
          {
              ( data?.vch_no && data.status == "dispatched") && 
                <CustomInput
                label="Voucher No(ICBS)"
                type="text"
                value={data?.vch_no}
                name="vch_no"
                isDisable={true}
              />
            }
        </div>
        <div className="bg-white px-4 pb-3 text-center">
          {!data && (
            <button type="submit" className="btn btn-primary px-5">
              Submit
            </button>
          )}
        </div>
      </form>
      {showButtons?.show && (
        <div className="d-flex justify-content-center bg-white mb-3">
          <div className="px-4 pb-3 text-center">
            <button
              name="approve"
              type="button"
              className="btn btn-success px-5"
              onClick={() => handleDialogOpen("approved")}
            >
              {showButtons?.message}
            </button>
          </div>
          <div className="pb-3 text-center">
            <button
              name="approve"
              type="button"
              className="btn btn-danger px-5"
              onClick={() => handleDialogOpen("rejected")}
            >
              Reject
            </button>
          </div>
        </div>
      )}
      {editData && (
        <div className="d-flex justify-content-center bg-white mb-3">
          <div className="px-4 pb-3 text-center">
            <button
              name="approve"
              type="button"
              className="btn btn-success px-5"
              onClick={updateAdvance}
            >
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryAdvance;
