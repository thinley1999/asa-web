import React, { useState, useEffect } from "react";
import "../../assets/css/main.css";
import CustomInput from "../general/CustomInput";
import CustomFileInput from "../general/CustomFileInput";
import UserServices from "../services/UserServices";
import { processUserName } from "../utils/UserUtils";
import AdvanceServices from "../services/AdvanceServices";
import FileServices from "../services/FileServices";
import SuccessMessage from "../general/SuccessMessage";
import ErrorMessage from "../general/ErrorMessage";

const OtherAdvance = ({ data, showButtons, handleDialogOpen, editData }) => {
  const [user, setUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const initialFormData = {
    firstName: " - ",
    middleName: " - ",
    lastName: "- ",
    date: new Date().toISOString().slice(0, 10),
    department: " ",
    designation: " ",
    employeeID: " ",
    totalAmount: 0,
    purpose: " ",
    other_advance_type: "",
    advance_type: "other_advance",
    files: [],
    update_files: [],
    delete_files: [],
    tour_type: "other_advance",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);

    if (!editData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        files: [...prevFormData.files, ...newFiles],
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        update_files: [...prevFormData.update_files, ...newFiles],
      }));
    }

    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (newFiles.length > 0) {
        delete newErrors.file_error;
      }
      return newErrors;
    });
  };

  const removeFile = (indexToRemove) => {
    if (!editData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        files: prevFormData.files.filter((_, index) => index !== indexToRemove),
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        files: prevFormData.files.filter((file) => file.id !== indexToRemove),
        delete_files: [...prevFormData.delete_files, indexToRemove],
      }));
    }

    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (formData.files.length <= 1) {
        newErrors.file_error = "Please upload relevant documents.";
      } else {
        delete newErrors.file_error;
      }
      return newErrors;
    });
  };

  const removeUpdateFile = (indexToRemove) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      update_files: prevFormData.update_files.filter((_, index) => index !== indexToRemove),
    }));
  };

  const fetchUserDetails = async () => {
    try {
      const response = await UserServices.showDetail(
        data ? data.user.id : null
      );
      if (response && response.status) {
        setUser(response.data);
        updateFormDataWithUserName(response.data);
      }
    } catch (error) {
      console.error("Error fetching current applications:", error);
    }
  };

  const updateFormDataWithUserName = (user) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      firstName: user.first_name || prevFormData.firstName,
      middleName: user.middle_name || prevFormData.middleName,
      lastName: user.last_name || prevFormData.lastName,
      employeeID: user.username || prevFormData.employeeID,
      department: user.department_name || prevFormData.department,
      designation: user.position_title || prevFormData.designation,
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
        if (value > 0) {
          delete newErrors.advanceAmount;
        }
      }
      if (name === "other_advance_type") {
        if (value.trim()) {
          delete newErrors.other_advance_type;
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

  const validateForm = () => {
    let errors = {};
    if (formData.totalAmount <= 0) {
      errors.advanceAmount = "Advance amount should be more than 0!";
    }
    if (!formData.other_advance_type.trim()) {
      errors.other_advance_type = "Select advance type!";
    }
    if (!formData.purpose.trim()) {
      errors.purpose = "Purpose is required.";
    }

    if (!formData.files.length && !editData) {
      errors.file_error = "Please upload relevant documents.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await AdvanceServices.create(formData);

        if (response) {
          const fileResponse = await FileServices.create(
            response.id,
            formData.files
          );
          if (fileResponse && fileResponse.status === 201) {
            setSuccessMessage("Advance created successfully");
            resetForm();
          } else {
            setErrorMessage("File creation failed");
          }
        } else {
          setErrorMessage("Internal Server Error");
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "An error occurred");
      }
    }
  };

  const updateAdvance = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await AdvanceServices.update(data.id, formData);

        const fileResponse = await FileServices.create(
          response.id,
          formData.update_files
        );

        const fileDeleteResponse = await FileServices.deleteFile(
          response.id,
          formData.delete_files
        );
     
        if (response) {
          setSuccessMessage("Advance Updated successfully");
          setFormData(
            (prevFormData) => ({
              ...prevFormData,
              delete_files: initialFormData.delete_files,
            }),
          );
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
      other_advance_type: initialFormData.other_advance_type,
      files: initialFormData.files,
      purpose: initialFormData.purpose,
      update_files: initialFormData.update_files,
      delete_files: initialFormData.delete_files,
    }));
  };

  useEffect(() => {
    if (data) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        purpose: data.purpose || " - ",
        other_advance_type: data.remark || " - ",
        totalAmount: data.amount || " - ",
        files: data?.files,
        tour_type: "other_advance"
      }));
    }
  }, [data]);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleCloseSuccessMessage = () => {
    setSuccessMessage("");
  };

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
  };

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
          <div className="row w-100">
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
              value={formData.employeeID}
              name="employeeId"
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
            <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
              <label className="form-label">Advance Type</label>
              <select
                className="form-select"
                name="other_advance_type"
                onChange={handleChange}
                disabled={data ? (editData ? false : true) : false}
                value={formData.other_advance_type}
              >
                <option>Select Advance Type</option>
                <option value="medical_advance">Medical Advance</option>
                <option value="study_advance">Study Advance</option>
                <option value="offical_advance">Offical Advance</option>
              </select>
              {formErrors.other_advance_type && (
                <div className="invalid-feedback" style={{ display: "block" }}>
                  {formErrors.other_advance_type}
                </div>
              )}
            </div>
            <CustomFileInput
              label="Relevant Documents"
              name="relevantDocument"
              files={formData.files}
              handleFileChange={handleFileChange}
              removeUpdateFile={removeUpdateFile}
              removeFile={removeFile}
              error={formErrors.file_error}
              data={data?.files}
              isEditMode={editData}
              updateFile={formData.update_files}
            />
            <div className="tourdetails col-xl-6 col-lg-6 col-md-6 col-12 mb-3">
              <label className="form-label">Purpose of advance</label>
              <textarea
                className="form-control"
                name="purpose"
                rows="4"
                disabled={data ? (editData ? false : true) : false}
                value={formData.purpose}
                onChange={handleChange}
              ></textarea>
              {formErrors.purpose && (
                <div className="invalid-feedback" style={{ display: "block" }}>
                  {formErrors.purpose}
                </div>
              )}
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

export default OtherAdvance;
