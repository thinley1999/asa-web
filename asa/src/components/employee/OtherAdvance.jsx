import React from "react";
import "../../assets/css/main.css";
import { FaCloudDownloadAlt } from "react-icons/fa";
import CustomInput from "../general/CustomInput";
import { useState, useEffect } from "react";
import UserServices from "../services/UserServices";
import { processUserName } from "../utils/UserUtils";

const OtherAdvance = ({data}) => {
  const [user, setUser] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: " - ",
    middleName: " - ",
    lastName: "- ",
    date: new Date().toISOString().slice(0, 10),
    department: "IT Department",
    designation: " ",
    employeeID: " ",
    advanceAmount: 0,
    purpose: " ",
    other_advance_type: "",
    advance_type: "other_advance",
  });

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
    const { firstName, middleName, lastName } = processUserName(formData, user.name);
    setFormData((prevFormData) => ({
      ...prevFormData,
      firstName: firstName || prevFormData.firstName,
      middleName: middleName || prevFormData.middleName,
      lastName: lastName || prevFormData.lastName,
      employeeID: user.username || prevFormData.employeeID,
      department: user.department || prevFormData.department,
      designation: user.grade.position_title || prevFormData.designation,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);
  console.log('formData ....', formData);
  return (
    <div className="mb-3">
      <form action="">
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
              value={formData.advanceAmount}
              name="advanceAmount"
              isDisable={data ? true : false}
              onChange={handleChange}
              error={formErrors.advanceAmount}
            />

            <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
              <label className="form-label">Advance Type</label>
              <select className="form-select" name="other_advance_type" onChange={handleChange} value={formData.other_advance_type}>
                <option>Select Advance Type</option>
                <option value="medical_advance">
                  Medical Advance
                </option>
                <option value="study_advance">Study Advance</option>
              </select>
            </div>

            <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
              <label className="form-label">Relavant Documents</label>
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

            <div className="tourdetails col-xl-6 col-lg-6 col-md-6 col-12 mb-3">
              <label className="form-label">Purpose of advance</label>
              <textarea
                className="form-control"
                name="purpose"
                rows="4"
                value={formData.purpose}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="bg-white px-4 pb-3 text-center">
          <button type="button" className="btn btn-primary px-5">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default OtherAdvance;
