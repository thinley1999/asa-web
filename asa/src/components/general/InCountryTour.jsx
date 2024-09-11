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

const InCountryTour = ({
  data,
  showButtons,
  isDSA,
  handleDialogOpen,
  edit,
}) => {
  const [user, setUser] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editData, setEditData] = useState(null);

  const initialFormData = {
    firstName: " - ",
    middleName: " - ",
    lastName: " - ",
    date: new Date().toISOString().slice(0, 10),
    department: " ",
    designation: " ",
    advanceAmount: {},
    totalAmount: 0,
    remark: "",
    advance_type: "in_country_tour_advance",
    files: [],
    update_files: [],
    delete_files: [],
    advance_percentage: "",
    office_order: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [rows, setRows] = useState([]);

  const total = isDSA
    ? data.dsa_amount?.Nu
    : data
    ? edit
      ? formData.advanceAmount?.Nu
      : data.advance_amount?.Nu
    : formData.advanceAmount?.Nu;

  const totalAmount = () => {
    let total = 0;
    rows.forEach((row) => {
      if (row.rate) {
        total += parseFloat(row.rate);
      }
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      totalAmount: total,
    }));
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);

    if (!edit) {
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

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      file_error: "",
    }));
  };

  const removeFile = (indexToRemove) => {
    if (!edit) {
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
  };

  const removeUpdateFile = (indexToRemove) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      update_files: prevFormData.update_files.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setFormData((prevFormData) => {
      if (keys.length === 1) {
        return {
          ...prevFormData,
          [name]: value,
        };
      } else {
        return {
          ...prevFormData,
          [keys[0]]: {
            ...prevFormData[keys[0]],
            [keys[1]]: value,
          },
        };
      }
    });

    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (name === "office_order") {
        delete newErrors.office_order_error;
      }

      if (name === "remark") {
        delete newErrors.remark_error;
      }

      if (name === "advanceAmount.Nu") {
        delete newErrors.advance_amount_error;
      }

      return newErrors;
    });
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

    if (!formData.remark) {
      errors.remark_error = "Please enter remarks.";
    }

    if (!formData.advanceAmount?.Nu) {
      errors.advance_amount_error = "Please enter advance amount.";
    }

    if (formData.advanceAmount?.Nu > formData.totalAmount) {
      errors.advance_amount_error =
        "Advance amount cannot be greater than total amount.";
    }

    setFormErrors((prevErrors) => ({ ...prevErrors, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const validateTravelItinerary = () => {
    let errors = {};
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      itinerary_error: "",
    }));

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

        if (advanceResponse && advanceResponse.id) {
          const fileResponse = await FileServices.create(
            advanceResponse.id,
            formData.files
          );

          if (fileResponse && fileResponse.status === 201) {
            setSuccessMessage(
              "Your application has been successfully submitted."
            );
            resetForm();
          } else {
            setErrorMessage("File creation failed");
          }
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    const isFormValid = validateForm();
    const isTravelItineraryValid = validateTravelItinerary();

    if (isFormValid && isTravelItineraryValid) {
      try {
        const advanceResponse = await AdvanceServices.update(
          data.id,
          formData,
          rows
        );
        const fileResponse = await FileServices.create(
          advanceResponse.id,
          formData.update_files
        );

        const fileDeleteResponse = await FileServices.deleteFile(
          advanceResponse.id,
          formData.delete_files
        );

        if (advanceResponse) {
          setSuccessMessage("Advance has been successfully updated.");
          setFormData((prevFormData) => ({
            ...prevFormData,
            delete_files: initialFormData.delete_files,
          }));
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

  const resetForm = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      advanceAmount: initialFormData.advanceAmount,
      advance_percentage: initialFormData.advance_percentage,
      remark: initialFormData.remark,
      files: [],
      update_files: initialFormData.update_files,
      delete_files: initialFormData.delete_files,
      office_order: "",
    }));
    setRows([]);
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
      if (rows[i].stop_at) {
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

    if (dataToCheck.stop_at && currentHaltCount >= 2) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        itinerary_error:
          "Travel itinerary dates are not valid. User can only add 2 stop over.",
      }));
    } else {
      if (editData) {
        setRows(rows.map((row) => (row.id === newData.id ? newData : row)));
      } else {
        setRows([...rows, { id: rows.length + 1, ...newData }]);
      }
    }

    handleDialogClose();
  };

  const removeRow = (id) => {
    const newRows = rows.filter((row) => row.id !== id);
    setRows(newRows);
  };

  const editRow = (rowData) => {
    setEditData(rowData);
    setShowDialog(true);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      office_order: data?.office_order || prevFormData.office_order,
      remark: data?.remark || prevFormData.remark,
      advanceAmount: data?.advance_amount || prevFormData.advanceAmount,
      files: data?.files || [],
      advance_percentage:
        data?.advance_percentage || prevFormData.advance_percentage,
    }));
    setRows(data?.travel_itinerary || []);
  }, [data]);

  useEffect(() => {
    totalAmount();
  }, [rows, formData.advance_percentage]);

  const handleCloseSuccessMessage = () => {
    setSuccessMessage("");
  };

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setEditData(null);
  };

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
          <CustomInput
            label="Office Order No"
            type="text"
            value={formData.office_order}
            name="office_order"
            isDisable={data ? (edit ? false : true) : false}
            onChange={handleChange}
            error={formErrors?.office_order_error}
          />
          <CustomFileInput
            label="Relevant Documents"
            name="relevantDocument"
            files={formData?.files}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
            removeUpdateFile={removeUpdateFile}
            error={formErrors.file_error}
            data={data?.files}
            isEditMode={edit}
            updateFile={formData.update_files}
          />
        </div>
      </div>

      <div className="bg-white px-4">
        <div className="row w-100 ">
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
              type="inCountry"
              haltCount={haltCount}
              edit={edit}
              username={user.username}
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
              disabled={!data ? false : edit ? false : true}
              onClick={() => setShowDialog(true)}
            >
              <FaPlus size={18} />
            </button>
          </div>
          <CustomInput
            label={isDSA ? "DSA Amount (Nu)" : "Advance Amount (Nu)"}
            type="text"
            value={
              isDSA
                ? data.dsa_amount?.Nu
                : data
                ? edit
                  ? formData.advanceAmount?.Nu
                  : data.advance_amount?.Nu
                : formData.advanceAmount?.Nu
            }
            name="advanceAmount.Nu"
            isDisable={data ? (edit ? false : true) : false}
            onChange={handleChange}
            error={formErrors?.advance_amount_error}
          />
          <CustomInput
            label="Total Amount (Nu)"
            type="text"
            value={formData.totalAmount}
            name="totalAmount"
            isDisable={true}
            onChange={handleChange}
          />

          {!isDSA && (
            <>
              <div className="tourdetails col-xl-6 col-lg-6 col-md-6 col-12 mb-3">
                <label className="form-label">Remarks</label>
                <textarea
                  className="form-control"
                  name="remark"
                  rows="4"
                  disabled={data ? (edit ? false : true) : false}
                  value={formData.remark}
                  onChange={handleChange}
                ></textarea>
                {formErrors?.remark_error && (
                  <div
                    className="invalid-feedback"
                    style={{ display: "block" }}
                  >
                    {formErrors?.remark_error}
                  </div>
                )}
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

export default InCountryTour;
