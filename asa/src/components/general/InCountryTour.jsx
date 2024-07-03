import React from "react";
import { FaCloudDownloadAlt } from "react-icons/fa";
import CustomInput from "./CustomInput";
import { useState, useEffect } from "react";
import TravelItinerary from "./TravelItinerary";
import UserServices from "../services/UserServices";
import { processUserName } from "../utils/UserUtils";
import RateServices from "../services/RateServices";

const InCountryTour = () => {
  const [user, setUser] = useState([]);
  const [formErrors, setFormErrors] = useState([]); 
  const [formData, setFormData] = useState({
    firstName: " - ",
    middleName: " - ",
    lastName: " - ",
    date: new Date().toISOString().slice(0, 10),
    department: "IT Department",
    designation: " ",
    advanceAmount: 0,
    purpose: " ",
    remark: " ",
    advance_type: "in_country_tour_advance",
  });
  const [rate, setRate] = useState([]);

  const fetchRate = async (startDate, endDate, from, to, index) => {
    try {
      const response = await RateServices.getRate(from, to);
      if (response) {
        const updatedRows = [...rows];
        updatedRows[index].rate = (getNumberOfDays(startDate, endDate) *response.rate); 
        setRows(updatedRows);
      }
    } catch (error) {
      console.error("Error fetching rates:", error);
    }
  };

  const getNumberOfDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end.getTime() - start.getTime(); // Difference in milliseconds
    const differenceInDays = differenceInTime / (1000 * 3600 * 24); // Convert milliseconds to days
    return differenceInDays + 1;
  };

  const [rows, setRows] = useState([
    { startDate: "", endDate: "", from: "", to: "", mode: "", rate: "" }
  ]);

  const addRow = () => {
    setRows([...rows, { startDate: "", endDate: "", from: "", to: "", mode: "", rate: "" }]);
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

  const handleTravelItinerary = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;

    if (field === "from" || field === "to" || field === "startDate" || field === "endDate") {
      const {  startDate, endDate, from, to } = updatedRows[index];

      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          travelItinerary: `Start date must be earlier than end date for row ${index + 1}`
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
    setFormErrors((prevErrors) => ({ ...prevErrors, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const validateTravelItinerary = () => {
    const hasErrors = rows.some((row) => !row.startDate || !row.endDate || !row.from || !row.to || !row.mode);

    if (hasErrors) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        travelItinerary: "Complete the Travel Itinerary"
      }));
    } else {
      setFormErrors((prevErrors) => {
        const { travelItinerary, ...rest } = prevErrors;
        return rest;
      });
    }

    return !hasErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isFormValid = validateForm();
    const isTravelItineraryValid = validateTravelItinerary();
    if (isFormValid && isTravelItineraryValid) {
      setFormErrors([]);
    }
  };

  const updateFormDataWithUserName = (user) => {
    const { firstName, middleName, lastName } = processUserName(formData, user.name);
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

  console.log('rows',rows);
  return (
    <form>
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
          <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
            <label className="form-label">
              Office order & revalent documents
            </label>
            <div className="d-flex">
              <button
                type="button"
                className="btn btn-primary"
                style={{ borderRadius: "0" }}
              >
                <FaCloudDownloadAlt size={20} /> <span>Upload File</span>
              </button>
              <span className="textwithbtn">Max file size 10 MB</span>
            </div>
          </div>
        </div>
      </div>

      <TravelItinerary rows={rows} 
        addRow={addRow} 
        handleTravelItinerary={handleTravelItinerary}
        removeRow = {removeRow}
        error = {formErrors.travelItinerary}
        />

      <div className="bg-white px-4">
        <div className="row w-100 ">
        <CustomInput
            label="Total Amount"
            type="text"
            value={formData.advanceAmount}
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
              value={formData.purpose}
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
              value={formData.remark}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="bg-white px-4 pb-3 text-center">
        <button type="submit" className="btn btn-primary px-5" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </form>
  );
};

export default InCountryTour;
