import React, { useState, useEffect } from "react";
import "../../assets/css/main.css";
import CustomInput from "../general/CustomInput";
import UserServices from "../services/UserServices";
import AdvanceServices from "../services/AdvanceServices";
import SuccessMessage from "../general/SuccessMessage";
import ErrorMessage from "../general/ErrorMessage";
import { formatDate } from "../utils/DateUtils";

const SalaryAdvance = ({ data, showButons, handleDialogOpen }) => {
  const [user, setUser] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    firstName: " - ",
    middleName: " - ",
    lastName: "- ",
    date: new Date().toISOString().slice(0, 10),
    department: "IT Department",
    designation: " ",
    advanceAmount: 0,
    thresholdAmount: " ",
    duration: 0,
    deduction: 0.0,
    purpose: " ",
    advance_type: "salary_advance",
    completion_month: "june 2023",
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (data) {
      const { firstName, middleName, lastName } = processUserName(
        data.user.name
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        firstName: firstName || " - ",
        middleName: middleName || " - ",
        lastName: lastName || "- ",
        date: formatDate(data.created_at) || " -",
        department: data.department || "IT Department",
        designation: data.grade.position_title || " ",
        advanceAmount: data.amount || 0,
        thresholdAmount: data.grade.basic_pay * 2 || " ",
        duration: data.advance_detail.duration || 0,
        deduction: data.advance_detail.deduction || 0.0,
        purpose: data.purpose || " ",
        advance_type: data.advance_type || "salary_advance",
        completion_month: data.advance_detail.completion_month || "june 2023",
      }));
    }
  }, [data]);

  const fetchUserDetails = async () => {
    try {
      const response = await UserServices.showDetail();
      if (response && response.status === 200) {
        setUser(response.data);
        updateFormDataWithUserName(response.data);
      }
    } catch (error) {
      console.error("Error fetching current applications:", error);
    }
  };

  const updateFormDataWithUserName = (user) => {
    const { firstName, middleName, lastName } = processUserName(user.name);
    setFormData((prevFormData) => ({
      ...prevFormData,
      firstName: firstName || prevFormData.firstName,
      middleName: middleName || prevFormData.middleName,
      lastName: lastName || prevFormData.lastName,
      designation: user.grade.position_title || prevFormData.designation,
      thresholdAmount: user.grade.basic_pay * 2 || prevFormData.thresholdAmount,
    }));
  };

  const processUserName = (name) => {
    const nameParts = name.split(" ");
    let firstName = formData.firstName;
    let middleName = formData.middleName;
    let lastName = formData.lastName;

    if (nameParts.length === 2) {
      [firstName, lastName] = nameParts;
    } else if (nameParts.length === 3) {
      [firstName, middleName, lastName] = nameParts;
    } else if (nameParts.length === 1) {
      firstName = nameParts[0];
      middleName = "";
      lastName = "";
    }
    return { firstName, middleName, lastName };
  };

  const calculateDeduction = () => {
    const { advanceAmount, duration } = formData;
    if (duration <= 0) {
      return 0;
    }
    const deduction = parseFloat(advanceAmount) / parseFloat(duration);
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
  };

  const validateForm = () => {
    let errors = {};
    if (
      formData.advanceAmount <= 0 ||
      formData.advanceAmount > formData.thresholdAmount
    ) {
      errors.advanceAmount =
        "Advance amount should be more than 0 and less than the threshold amount.";
    }
    if (formData.duration <= 0 || formData.duration >= 10) {
      errors.duration = "Duration should be more than 0 and less than 10.";
    }
    if (!formData.purpose.trim()) {
      errors.purpose = "Purpose is required.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await AdvanceServices.create(formData);

        if (response && response.status === 201) {
          setSuccessMessage("Advance created successfully");
        } else {
          setErrorMessage("Internal Server Error");
        }
      } catch (error) {
        setErrorMessage(error.response?.data || "An error occurred");
      }
    }
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
    if (formData.advanceAmount && formData.duration) {
      calculateDeduction();
    }
  }, [formData.advanceAmount, formData.duration]);

  return (
    <div className="mb-3 ">
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
              value={formData.advanceAmount}
              name="advanceAmount"
              isDisable={data ? true : false}
              onChange={handleChange}
              error={formErrors.advanceAmount}
            />
            <CustomInput
              label="Threshold Amount (Netpay * 2)"
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
              isDisable={data ? true : false}
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
                disabled={data ? true : false}
              ></textarea>
              {formErrors.purpose && (
                <div className="invalid-feedback" style={{ display: "block" }}>
                  {formErrors.purpose}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white px-4 pb-3 text-center">
          {!data && (
            <button type="submit" className="btn btn-primary px-5">
              Submit
            </button>
          )}
        </div>
      </form>
      {showButons && (
        <div className="d-flex justify-content-center bg-white">
          <div className="px-4 pb-3 text-center">
            <button
              name="approve"
              type="button"
              className="btn btn-success px-5"
              onClick={handleDialogOpen}
            >
              Approve
            </button>
          </div>
          <div className="pb-3 text-center">
            <button
              name="approve"
              type="button"
              className="btn btn-danger px-5"
              onClick={handleDialogOpen}
            >
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryAdvance;
