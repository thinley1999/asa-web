import React, { useEffect, useState } from "react";
import "../../assets/css/main.css";
import CustomInput from "../general/CustomInput";
import { useParams } from "react-router-dom";
import AdvanceServices from "../services/AdvanceServices";

const ViewRequestedAdvance = () => {
  const { id } = useParams();
  const [advance, setAdvance] = useState({});

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const processUserName = (name) => {
    if (!name) {
      return "-";
    }
    const nameParts = name.split(" ");
    let firstName;
    let middleName;
    let lastName;

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

  const fetchAdvance = async () => {
    try {
      const response = await AdvanceServices.showDetail(id);
      setAdvance(response.data);
      console.log("response", response.data);
    } catch (error) {
      console.error("Error fetching current applications:", error);
    }
  };

  useEffect(() => {
    fetchAdvance();
  }, []);

  return (
    <div className="mb-3">
      <form action="">
        <div className="bg-white px-4 py-4">
          <div className="row w-100 ">
            <CustomInput
              label="First Name"
              type="text"
              name="firstName"
              value={processUserName(advance?.user?.name).firstName}
              isDisable={true}
            />

            <CustomInput
              label="Middel Name"
              type="text"
              name="middleName"
              value={processUserName(advance?.user?.name).middleName}
              isDisable={true}
            />

            <CustomInput
              label="Last Name"
              type="text"
              name="lastName"
              value={processUserName(advance?.user?.name).lastName}
              isDisable={true}
            />

            <CustomInput
              label="Employee ID"
              type="text"
              name="employeeid"
              value={advance?.user?.username}
              isDisable={true}
            />

            <CustomInput
              label="Date"
              type="text"
              name="date"
              value={formatDate(advance?.created_at)}
              isDisable={true}
            />

            <CustomInput
              label="Department"
              type="text"
              name="department"
              value="IT Department"
              isDisable={true}
            />

            <CustomInput
              label="Designation"
              type="text"
              name="designation"
              value={advance?.grade?.position_title}
              isDisable={true}
            />

            <CustomInput
              label="Advance Amount"
              type="text"
              name="advanceAmount"
              value={advance?.amount}
              isDisable={true}
            />

            <CustomInput
              label="Threshold Amount (Netpay * 2)"
              type="text"
              name="thresholdAmount"
              value={parseFloat(advance?.grade?.basic_pay) * 2}
              isDisable={true}
            />

            <CustomInput
              label="Duration in months"
              type="number"
              name="duration"
              value={advance?.advance_detail?.duration}
              isDisable={true}
            />

            <CustomInput
              label="Monthly deduction"
              type="text"
              name="deduction"
              value="Nu. 5,000"
              isDisable={true}
            />

            {/* <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
              <label className="form-label">Download Attchment</label>
              <div className="d-flex">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ borderRadius: "0" }}
                >
                  <span>Download</span> <i className="bi bi-download"></i>
                </button>
              </div>
            </div> */}

            <div className="tourdetails col-xl-6 col-lg-6 col-md-6 col-12 mb-3">
              <label className="form-label">Purpose of advance</label>
              <textarea
                className="form-control"
                name="purpose"
                value={advance?.purpose}
                rows="3"
                disabled
              ></textarea>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center bg-white">
          <div className="px-4 pb-3 text-center">
            <button
              name="approve"
              type="button"
              className="btn btn-success px-5"
            >
              Approve
            </button>
          </div>
          <div className="pb-3 text-center">
            <button
              name="approve"
              type="button"
              className="btn btn-danger px-5"
            >
              Reject
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ViewRequestedAdvance;
