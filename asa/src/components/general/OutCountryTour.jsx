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
  edit,
}) => {
  const [user, setUser] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [editData, setEditData] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

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
    remark: "",
    advance_type: "ex_country_tour_advance",
    files: [],
    advance_percentage: "",
    office_order: "",
    tour_type: "",
    update_files: [],
    update_tickets: [],
    delete_files: [],
    delete_tickets: [],
    additional_expense: "",
    tickets: [],
  };

  const [formData, setFormData] = useState(initialFormData);

  const totalAmount = () => {
    let Nu = 0;
    let INR = 0;
    let USD = formData?.additional_expense == 200 ? 200 : 0;
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

  const handleFileChange = (event, key) => {
    const newFiles = Array.from(event.target.files);

    setFormData((prevFormData) => ({
      ...prevFormData,
      [edit ? `update_${key}` : key]: [
        ...(prevFormData[edit ? `update_${key}` : key] || []),
        ...newFiles,
      ],
    }));

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      file_error: "",
    }));
  };

  const removeFile = (indexToRemove, key) => {
    setFormData((prevFormData) => {
      if (edit) {
        const deleteKey = key === 'files' ? 'delete_files' : 'delete_tickets';
  
        return {
          ...prevFormData,
          [key]: prevFormData[key].filter((file) => file.id !== indexToRemove),
          [deleteKey]: [
            ...(prevFormData[deleteKey] || []),
            indexToRemove,
          ],
        };
      } else {
        return {
          ...prevFormData,
          [key]: prevFormData[key].filter((_, index) => index !== indexToRemove),
        };
      }
    });
  };

  const removeUpdateFile = (indexToRemove, key) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [`update_${key}`]: prevFormData[`update_${key}`].filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split(".");

    setFormData((prevFormData) => {
      const newValue = type === "checkbox" ? (checked ? value : 0) : value;

      if (keys.length === 1) {
        return {
          ...prevFormData,
          [name]: newValue,
        };
      } else {
        return {
          ...prevFormData,
          [keys[0]]: {
            ...prevFormData[keys[0]],
            [keys[1]]: newValue,
          },
        };
      }
    });

    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (name === "office_order") {
        delete newErrors.office_order_error;
      }

      if (name === "tour_type") {
        delete newErrors.tour_type_error;
      }

      if (name === "remark") {
        delete newErrors.remark_error;
      }

      return newErrors;
    });
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

        const ticketResponse = await FileServices.create(
          advanceResponse.id,
          formData.update_tickets,
          "tickets"
        );

        const fileDeleteResponse = await FileServices.deleteFile(
          advanceResponse.id,
          formData.delete_files
        );

        const ticketDeleteResponse = await FileServices.deleteFile(
          advanceResponse.id,
          formData.delete_tickets,
          "tickets"
        );

        if (advanceResponse) {
          setSuccessMessage("Advance has been successfully updated.");
          setFormData((prevFormData) => ({
            ...prevFormData,
            delete_files: initialFormData.delete_files,
            delete_tickets: initialFormData.delete_tickets,
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
      // console.error("Error fetching current applications:", error);
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

    if (!formData.tour_type) {
      errors.tour_type_error = "Please select tour type.";
    }

    if (!formData.remark) {
      errors.remark_error = "Please enter remarks.";
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
      advance_percentage: initialFormData.advance_percentage,
      purpose: initialFormData.purpose,
      remark: initialFormData.remark,
      files: initialFormData.files,
      update_files: initialFormData.update_files,
      delete_files: initialFormData.delete_files,
      office_order: "",
      tour_type: "",
      additional_expense: "",
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

  const haltCount = (index) => {
    let count = 0;
    if (index || index == 0) {
      for (let i = 0; i < index; i++) {
        if (rows[i]?.stop_at) {
          count++;
        }
      }
    } else {
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].stop_at) {
          count++;
        }
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

    if (dataToCheck.stop_at && currentHaltCount > 2) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        itinerary_error:
          "Travel itinerary dates are not valid. User can only add 2 stop overs.",
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

  const editRow = (rowData, index) => {
    setEditData(rowData);
    setEditIndex(index);
    setShowDialog(true);
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    totalAmount();
  }, [rows, formData.advance_percentage, formData.additional_expense]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      office_order: data?.office_order || prevFormData.office_order,
      remark: data?.remark || prevFormData.remark,
      advanceAmount: data?.advance_amount || prevFormData.advanceAmount,
      tour_type: data?.tour_type || prevFormData.tour_type,
      files: data?.files || [],
      tickets: data?.tickets || [],
      additional_expense:
        data?.additional_expense || prevFormData.additional_expense,
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
          <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
            <label className="form-label">Tour Type</label>
            <select
              className="form-select"
              name="tour_type"
              value={formData.tour_type}
              onChange={handleChange}
              disabled={data ? (edit ? false : true) : false}
            >
              <option value="">Select Tour Type</option>
              <option value="training">Training</option>
              <option value="meeting/seminar">Meeting/Seminar</option>
              <option value="remittance">Cash Consignment(remittance)</option>
            </select>
            {formErrors.tour_type_error && (
              <div className="text-danger">{formErrors.tour_type_error}</div>
            )}
          </div>
          <CustomFileInput
            label="Relevant Documents"
            name="relevantDocument1"
            files={formData.files}
            handleFileChange={(event) => handleFileChange(event, "files")}
            removeFile={(index) => removeFile(index, "files")}
            removeUpdateFile={(index) => removeUpdateFile(index, "files")}
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
              type="outCountry"
              haltCount={haltCount}
              edit={edit}
              username={user.username}
              outCountry={true}
              editIndex={editIndex}
              department={formData.department}
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
          {formData?.department === "Management" && (
            <div className="col-12 mb-4">
              <label className="form-label">
                Additional Expense(Management only)
              </label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="additional_expense"
                  value={200}
                  checked={
                    parseFloat(formData.additional_expense) === 200
                      ? true
                      : false
                  }
                  onChange={handleChange}
                  disabled={data ? (edit ? false : true) : false}
                />
                <label className="form-check-label">
                  Local conveyance and communication expenses(200 USD)
                </label>
              </div>
            </div>
          )}

          {isDSA && (
            <div className="col-12 mb-3">
              <CustomFileInput
                label="Boarding Pass (Travel Documents)"
                name="relevantDocument2"
                files={formData.tickets}
                handleFileChange={(event) => handleFileChange(event, "tickets")}
                removeFile={(index) => removeFile(index, "tickets")}
                removeUpdateFile={(index) => removeUpdateFile(index, "tickets")}
                error={formErrors.file_error}
                data={data?.tickets}
                isEditMode={edit}
                updateFile={formData.update_tickets}
              />
            </div>
          )}

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
        {
          data?.vch_no && (data.status === "dispatched" || data.status === "closed") && (
            <CustomInput
            label="Voucher No(ICBS)"
            type="text"
            value={data?.vch_no}
            name="vch_no"
            isDisable={true}
          /> )
          }
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
