import React from "react";
import CustomInput from "./CustomInput";
import { useState, useEffect } from "react";
import UserServices from "../services/UserServices";
import AdvanceServices from "../services/AdvanceServices";
import FileServices from "../services/FileServices";
import CustomFileInput from "./CustomFileInput";
import SuccessMessage from "./SuccessMessage";
import ErrorMessage from "./ErrorMessage";
import { FaPlus } from "react-icons/fa";
import TravelDetails from "./TravelDetails";
import TravelDetailsTable from "./TravelDetailsTable";

const OutCountryTour = ({
  data,
  setActiveTab,
  isDSA,
  showButtons,
  handleDialogOpen,
  edit
}) => {
  const [user, setUser] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [editData, setEditData] = useState(null);

  const initialFormData = {
    firstName: " - ",
    middleName: " - ",
    lastName: " - ",
    date: new Date().toISOString().slice(0, 10),
    department: "IT Department",
    designation: " ",
    advanceAmount: { Nu: 0, USD: 0, INR: 0 },
    totalAmount: 0,
    purpose: " ",
    remark: " ",
    advance_type: "ex_country_tour_advance",
    files: [],
    advance_percentage: "",
    office_order: ""
  };

  const [formData, setFormData] = useState(initialFormData);

  const totalAmount = () => {
    let Nu = 0;
    let INR = 0;
    let USD = 0;
    rows.forEach((row) => {
      if (row.currency == "Nu") {
        Nu += parseFloat(row.rate);
      }
      if (row.currency == "INR") {
        INR += parseFloat(row.rate);
      }
      if (row.currency == "USD") {
        USD += parseFloat(row.rate);
      }
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      advanceAmount: {
        Nu: Nu * 0,
        INR: INR * formData.advance_percentage,
        USD: USD * formData.advance_percentage,
        Total: { Nu: Nu, INR: INR, USD: USD },
      },
    }));
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);

    setFormData((prevFormData) => ({
      ...prevFormData,
      files: [...prevFormData.files, ...newFiles],
    }));

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      file_error: "",
    }));
  };

  const removeFile = (indexToRemove) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      files: prevFormData.files.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    const isTravelItineraryValid = validateTravelItinerary();

    if (isFormValid && isTravelItineraryValid) {
      try {
        const advanceResponse = await AdvanceServices.update(data.id, formData, rows);
        if (advanceResponse ) {
            setSuccessMessage(
              "Advance has been successfully updated."
            );
        } else {
          setErrorMessage("Your application submission has failed");
        }
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
            "An error occurred during submission. Please try again."
        );
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
      console.error("Error fetching current applications:", error);
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.files.length && !edit) {
      errors.file_error = "Please upload relevant documents.";
    }

    if (!formData.office_order) {
      errors.office_order_error = "Please enter office order number.";
    }

    setFormErrors((prevErrors) => ({ ...prevErrors, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const validateTravelItinerary = () => {
    let errors = {};

    if (rows.length == 0) {
      errors.itinerary_error = "Please add travel itinerary for the advance.";
    }

    for (let i = 0; i < rows.length - 1; i++) {
      const currentEndDate = new Date(rows[i].end_date);
      const nextStartDate = new Date(rows[i + 1].start_date);

      if (currentEndDate >= nextStartDate) {
        errors.itinerary_error =
          "Travel itinerary dates are not valid. Start date of the next itinerary should be greater than the end date of the previous itinerary.";
        break;
      }
    }
    setFormErrors((prevErrors) => ({ ...prevErrors, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    const isTravelItineraryValid = validateTravelItinerary();

    if (isFormValid && isTravelItineraryValid) {
      try {
        const advanceResponse = await AdvanceServices.create(formData, rows);
        if (advanceResponse) {
          const fileResponse = await FileServices.create(
            advanceResponse.id,
            formData.files
          );

          if (fileResponse && fileResponse.status === 201) {
            setSuccessMessage(
              "Your application has been successfully subbmitted."
            );
            resetForm();
          } else {
            setErrorMessage("File creation failed");
          }
        } else {
          setErrorMessage("Your application subbmission has been failed");
        }
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message ||
          "An error occurred during submission. Please try again."
        );
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      advanceAmount: initialFormData.advanceAmount,
      purpose: initialFormData.purpose,
      remark: initialFormData.remark,
      files: initialFormData.files,
    }));
    setRows([]);
    setFormErrors([]);
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

  const haltCount = () => {
    let count = 0;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].halt_at) {
        count++;
      }
    }
    return count;
  };

  const handleTravelItinerary = (newData) => {
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      itinerary_error: "",
    }));
    const dataToCheck = editData || newData;
    const currentHaltCount = haltCount();

    if (dataToCheck.halt_at && currentHaltCount >= 2) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        itinerary_error:
          "Travel itinerary dates are not valid. User can only add 2 halts.",
      }));
    } else {
      if (editData) {
        setRows(rows.map((row) => (row.id === newData.id ? newData : row)));
        setEditData(null);
      } else {
        setRows([...rows, { id: rows.length + 1, ...newData }]);
      }
    }

    handleDialogClose();
  };

  const removeRow = (id) => {
    const newRows = rows.filter((row) => row.id !== id);
    setRows(newRows);
    setEditData(null);
  };

  const editRow = (rowData) => {
    setEditData(rowData);
    setShowDialog(true);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    totalAmount();
  }, [rows, formData.advance_percentage]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      office_order: data?.office_order || prevFormData.office_order,
      remark: data?.remark || prevFormData.remark,
      advanceAmount: data?.advance_amount || prevFormData.advanceAmount,
      advance_percentage:
        data?.advance_percentage || prevFormData.advance_percentage,
    }));
    setRows(data?.travel_itinerary || []);
  }, [data]);

  const handleCloseSuccessMessage = () => {
    setSuccessMessage("");
  };

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  console.log("form data", formData);

  return (
    <form onSubmit={handleSubmit}>
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
            value={formData.employeeID}
            name="employeeID"
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
          <CustomFileInput
            label="Relevant Documents"
            name="relevantDocument1"
            files={formData.files}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
            error={formErrors.file_error}
            data={data?.files}
          />
        </div>
      </div>

      <div className="bg-white px-4">
        <div className="row w-100 ">
        <CustomInput
            label="Office Order No" 
            type="text"
            value={formData.office_order}
            name="office_order"
            isDisable={data ? ( edit ? false:true) : false}
            onChange={handleChange}
            error={formErrors?.office_order_error}
          />
          <div className="col-12 mb-3">
            <label className="form-label">Travel Itinerary</label>
          </div>
          {showDialog && (
            <TravelDetails
              existingData={data ? data.travel_itinerary : null}
              isOpen={showDialog}
              onClose={handleDialogClose}
              onSave={handleTravelItinerary}
              initialData={editData}
              type="outCountry"
              haltCount={haltCount}
              edit={edit}
            />
          )}
          <TravelDetailsTable
            existingData={data ? data.travel_itinerary : null}
            data={rows}
            removeRow={removeRow}
            editRow={editRow}
            edit={edit}
          />
          {formErrors?.itinerary_error && (
            <div className="invalid-feedback" style={{ display: "block" }}>
              {formErrors?.itinerary_error}
            </div>
          )}
          <div className="mb-3">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowDialog(true)}
              disabled={data ? (edit ? false : true) : false}
            >
              <FaPlus size={18} />
            </button>
          </div>
          <CustomInput
            label="Total Amount"
            type="text"
            value={
              isDSA
                ? `Nu.${data.dsa_amount?.Nu ?? 0}, INR.${
                    data.dsa_amount?.INR ?? 0
                  }, USD.${data.dsa_amount?.USD ?? 0}`
                : data
                ? edit
                  ? `Nu.${formData.advanceAmount?.Nu ?? 0}, INR.${
                    formData.advanceAmount?.INR ?? 0
                  }, USD.${formData.advanceAmount?.USD ?? 0}`
                  : `Nu.${data.advance_amount?.Nu ?? 0}, INR.${
                    data.advance_amount?.INR ?? 0
                  }, USD.${data.advance_amount?.USD ?? 0}`
                : `Nu.${formData.advanceAmount?.Nu ?? 0}, INR.${
                    formData.advanceAmount?.INR ?? 0
                  }, USD.${formData.advanceAmount?.USD ?? 0}`
            }
            name="advanceAmount"
            isDisable={true}
            onChange={handleChange}
          />
          {!isDSA && (
            <>
              <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">Claim Advance</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="advance_percentage"
                    value={1.0}
                    checked={
                      parseFloat(formData.advance_percentage) === 1.0
                        ? true
                        : false
                    }
                    onChange={handleChange}
                    disabled={data ? (edit ? false : true) : false}
                  />
                  <label className="form-check-label">Request Advance</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="advance_percentage"
                    checked={
                      parseFloat(formData.advance_percentage) === 0
                        ? true
                        : false
                    }
                    onChange={handleChange}
                    value={0}
                    disabled={data ? (edit ? false : true) : false}
                  />
                  <label className="form-check-label">
                    Claim DSA after tour
                  </label>
                </div>
              </div>
              <div className="tourdetails col-xl-6 col-lg-6 col-md-6 col-12 mb-3">
                <label className="form-label">Remarks</label>
                <textarea
                  className="form-control"
                  name="remark"
                  rows="4"
                  disabled={data ? (edit ? false : true) : false}
                  value={data ? data.remark : formData.remark}
                  onChange={handleChange}
                ></textarea>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white px-4 pb-3 text-center">
        {!data && (
          <button type="submit" className="btn btn-primary px-5">
            Submit
          </button>
        )}
        {edit && (
          <button onClick={handleUpdate} className="btn btn-primary px-5">
            Update
          </button>
        )}
      </div>
      {showButtons?.show && (
        <div className="d-flex justify-content-center bg-white">
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
    </form>
  );
};

export default OutCountryTour;
