import React, { useState, useEffect } from "react";
import "../../assets/css/main.css";
import CustomInput from "../general/CustomInput";
import UserServices from "../services/UserServices";
import AdvanceServices from "../services/AdvanceServices";
import SuccessMessage from "../general/SuccessMessage";
import ErrorMessage from "../general/ErrorMessage";

const SalaryAdvance = () => {
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

  console.log("formData", formData);
  const updateFormDataWithUserName = (user) => {
    const { firstName, middleName, lastName } = processUserName(user.name);
    setFormData({
      ...formData,
      firstName: firstName || formData.firstName,
      middleName: middleName || formData.middleName,
      lastName: lastName || formData.lastName,
      designation: user.grade.position_title || formData.designation,
      thresholdAmount: user.grade.basic_pay * 2 || formData.thresholdAmount,
    });
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
    setFormData({ ...formData, deduction: deduction });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

  console.log("error", formErrors);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await AdvanceServices.create(formData);

        console.log("response", response);

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
    if (formData.advanceAmount && formData.duration) {
      calculateDeduction();
    }
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
              type="date"
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
              isDisable={false}
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
              isDisable={false}
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
          <button type="submit" className="btn btn-primary px-5">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalaryAdvance;
