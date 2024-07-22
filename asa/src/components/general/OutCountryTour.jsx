import React from "react";
import CustomInput from "./CustomInput";
import { useState, useEffect } from "react";
import TravelItinerary from "./TravelItinerary";
import UserServices from "../services/UserServices";
import { processUserName } from "../utils/UserUtils";
import RateServices from "../services/RateServices";
import AdvanceServices from "../services/AdvanceServices";
import FileServices from "../services/FileServices";
import CustomFileInput from "./CustomFileInput";
import SuccessMessage from "./SuccessMessage";
import ErrorMessage from "./ErrorMessage";
import { FaPlus, FaTimes } from "react-icons/fa";
import TravelDetails from "./TravelDetails";
import TravelDetailsTable from "./TravelDetailsTable";

const OutCountryTour = ({
  data,
  setActiveTab,
  showButtons,
  handleDialogOpen,
}) => {
  const [user, setUser] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState([]);
  const [showDialog, setShowDialog] = useState(false);

  const initialFormData = {
    firstName: " - ",
    middleName: " - ",
    lastName: " - ",
    date: new Date().toISOString().slice(0, 10),
    department: "IT Department",
    designation: " ",
    advanceAmount: 0,
    purpose: " ",
    remark: " ",
    advance_type: "ex_country_tour_advance",
    files: [],
  };

  const initialRows = [
    { startDate: "", endDate: "", from: "", to: "", mode: "", rate: "" },
  ];

  const [formData, setFormData] = useState(initialFormData);
  const [rate, setRate] = useState([]);

  const fetchRate = async (startDate, endDate, from, to, index) => {
    try {
      const response = await RateServices.getRate(from, to);
      if (response) {
        const updatedRows = [...rows];
        updatedRows[index].rate =
          getNumberOfDays(startDate, endDate) * response.rate;
        setRows(updatedRows);
      }
    } catch (error) {
      console.error("Error fetching rates:", error);
    }
  };

  const getNumberOfDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays + 1;
  };

  const [rows, setRows] = useState([
    { startDate: "", endDate: "", from: "", to: "", mode: "", rate: "" },
  ]);

  const addRow = () => {
    setRows([
      ...rows,
      { startDate: "", endDate: "", from: "", to: "", mode: "", rate: "" },
    ]);
  };

  const removeRow = (index) => {
    const newRows = rows.filter((row, rowIndex) => rowIndex !== index);
    setRows(newRows);
  };

  const totalAmount = () => {
    let total = 0;
    console.log("ffdfs", rows);
    rows.forEach((row) => {
      if (row.rate) {
        total += parseFloat(row.rate);
      }
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      advanceAmount: total,
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

  const handleTravelItinerary = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    if (
      field === "from" ||
      field === "to" ||
      field === "startDate" ||
      field === "endDate"
    ) {
      const { startDate, endDate, from, to } = updatedRows[index];

      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          travelItinerary: `Start date must be earlier than end date for row ${
            index + 1
          }`,
        }));
      } else {
        setFormErrors((prevErrors) => {
          const { travelItinerary, ...rest } = prevErrors;
          return rest;
        });
        if (startDate && endDate && from && to) {
          fetchRate(startDate, endDate, from, to, index);
        }
      }
    }

    setRows(updatedRows);
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
    if (!formData.purpose.trim()) {
      errors.purpose = "Purpose is required.";
    }

    if (!formData.files.length) {
      errors.file_error = "Please upload relevant documents.";
    }

    setFormErrors((prevErrors) => ({ ...prevErrors, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const validateTravelItinerary = () => {
    const hasErrors = rows.some(
      (row) =>
        !row.startDate || !row.endDate || !row.from || !row.to || !row.mode
    );

    if (hasErrors) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        travelItinerary: "Complete the Travel Itinerary",
      }));
    } else {
      setFormErrors((prevErrors) => {
        const { travelItinerary, ...rest } = prevErrors;
        return rest;
      });
    }

    return !hasErrors;
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
        setErrorMessage("Error:", error.response?.data);
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
    setRows(initialRows);
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

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    totalAmount();
  }, [rows]);

  const handleCloseSuccessMessage = () => {
    setSuccessMessage("");
  };

  const handleCloseErrorMessage = () => {
    setErrorMessage("");
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  console.log("rows", rows);
  console.log("formdata", formData);
  console.log("trave.....", data);
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
          <div className="col-12 mb-3">
            <label className="form-label">Travel Itinerary</label>
            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowDialog(true)}
              >
                <FaPlus size={18} />
              </button>
            </div>
          </div>
          {showDialog && (
            <TravelDetails isOpen={showDialog} onClose={handleDialogClose} />
          )}
          <TravelDetailsTable />
          <CustomInput
            label="Total Amount"
            type="text"
            value={data ? data.amount : formData.advanceAmount}
            name="advanceAmount"
            isDisable={true}
            onChange={handleChange}
          />
          <div className="tourdetails col-xl-6 col-lg-6 col-md-6 col-12 mb-3">
            <label className="form-label">Remarks</label>
            <textarea
              className="form-control"
              name="remark"
              rows="4"
              disabled={data ? true : false}
              value={data ? data.remark : formData.remark}
              onChange={handleChange}
            ></textarea>
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
