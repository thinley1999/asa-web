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

const InCountryTour = ({ data }) => {
  const [user, setUser] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState([]);
  // const [formData, setFormData] = useState({
  //   firstName: " - ",
  //   middleName: " - ",
  //   lastName: " - ",
  //   date: new Date().toISOString().slice(0, 10),
  //   department: "IT Department",
  //   designation: " ",
  //   advanceAmount: 0,
  //   purpose: " ",
  //   remark: " ",
  //   advance_type: "in_country_tour_advance",
  //   files: [],
  // });
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
  };

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
        setErrorMessage("Error:", error);
      }
    }
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
    const { firstName, middleName, lastName } = processUserName(
      formData,
      user.name
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      firstName: firstName || prevFormData.firstName,
      middleName: middleName || prevFormData.middleName,
      lastName: lastName || prevFormData.lastName,
      employeeID: user.username || prevFormData.employeeID,
      designation: user.grade.position_title || prevFormData.designation,
      department: user.department || prevFormData.department,
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
            name="relevantDocument"
            files={formData.files}
            handleFileChange={handleFileChange}
            removeFile={removeFile}
            error={formErrors.file_error}
            data={data?.files}
          />
        </div>
      </div>

      <TravelItinerary
        rows={data ? data.travel_itinerary : rows}
        addRow={addRow}
        handleTravelItinerary={handleTravelItinerary}
        removeRow={removeRow}
        error={formErrors.travelItinerary}
        data={data?.travel_itinerary}
      />

      <div className="bg-white px-4">
        <div className="row w-100 ">
          <CustomInput
            label="Total Amount"
            type="text"
            value={data ? data.amount : formData.advanceAmount}
            name="advanceAmount"
            isDisable={true}
            onChange={handleChange}
          />
          <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
            <label className="form-label">Purpose of advance</label>
            <textarea
              className="form-control"
              name="purpose"
              rows="4"
              disabled={data ? true : false}
              value={data ? data.purpose : formData.purpose}
              onChange={handleChange}
            ></textarea>
            {formErrors.purpose && (
              <div className="invalid-feedback" style={{ display: "block" }}>
                {formErrors.purpose}
              </div>
            )}
          </div>
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
    </form>
  );
};

export default InCountryTour;
