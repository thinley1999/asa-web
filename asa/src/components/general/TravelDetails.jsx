import React, { useState, useEffect } from "react";
import CustomInput from "./CustomInput";
import { dzongkhags } from "../../components/datas/dzongkhag_lists";
import RateServices from "../services/RateServices";

const TravelDetails = ({ isOpen, onClose, onSave, initialData }) => {
  const [haltChecked, setHaltChecked] = useState(false);
  const [returnChecked, setReturnChecked] = useState(false);
  const [mode, setMode] = useState("");
  const [errors, setErrors] = useState({});

  const [data, setData] = useState(
    initialData || {
      start_date: "",
      end_date: "",
      from: "",
      to: "",
      mode: "",
      mileage: "",
      rate: "",
      halt_at: "",
      dsa_percentage: "",
      days: "",
    }
  );

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const getNumberOfDays = (start_date, end_date) => {
    const start = new Date(start_date);
    const end = new Date(end_date);
    const differenceInTime = end.getTime() - start.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return Math.ceil(differenceInDays);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "start_date" || name === "end_date") {
      const { start_date, end_date } = { ...data, [name]: value };
      if (start_date && end_date) {
        if (new Date(start_date) >= new Date(end_date)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            end_date: "End date must be greater than start date",
          }));
        } else {
          setErrors((prevErrors) => ({ ...prevErrors, end_date: "" }));
          const days = getNumberOfDays(start_date, end_date);
          setData((prevData) => ({ ...prevData, days: days }));
        }
      }
    }
  };

  const validateData = () => {
    const { start_date, end_date, from, to, mode, mileage, halt_at, dsa_percentage} = data;
    const newErrors = {};

    if (!start_date) newErrors.start_date = "Start date is required";
    if (!end_date) newErrors.end_date = "End date is required";
    if (!from) newErrors.from = "From location is required";
    if (!to) newErrors.to = "To location is required";
    if (!mode) newErrors.mode = "Mode of travel is required";
    if (!dsa_percentage) newErrors.dsa_percentage = "DSA percentage is required";

    if (mode === "Private Vehicle" && !mileage) {
      newErrors.mileage = "Mileage is required for private vehicle";
    }

    if (haltChecked && !halt_at) {
      newErrors.halt_at = "Halt location is required when halt is checked";
    }

    if (Object.keys(newErrors).length === 0) {
      return { isValid: true, errors: {} };
    }

    return { isValid: false, errors: newErrors };
  };

  const fetchRate = async (from, to, dsaPercentage, days, mode, mileage) => {
    try {
      if (mode === "Private Vehicle") {
        return dsaPercentage * 16 * mileage;
      }
      const response = await RateServices.getRate(from, to, mode);
      if (response) {
        const rate = dsaPercentage * days * response.rate;
        return rate; 
      }
    } catch (error) {
      console.error("Error fetching rates:", error);
      throw error;
    }
  };
  
  const handleSubmit = async () => {
    const { isValid, errors } = validateData();
    setErrors(errors);
    if (isValid) {
      try {
        const { dsa_percentage, days, mode, mileage } = data;
        const rate = await fetchRate("Bhutan", "Bhutan", dsa_percentage, days, mode, mileage);
        setData((prevData) => ({ ...prevData, rate: rate }));
        onSave({ ...data, rate }); 
        onClose();
      } catch (error) {
        console.error("Error while submitting:", error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: "block" }}>
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: "900px" }}
      >
        <div className="modal-content">
          <div className="modal-header" style={{ borderTop: "5px solid blue" }}>
            <h5 className="modal-title">Travel Details</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row w-100">
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">Start Date</label>
                <input
                  className={`form-control ${errors.start_date ? "is-invalid" : ""}`}
                  type="datetime-local"
                  name="start_date"
                  value={data.start_date}
                  onChange={handleChange}
                />
                {errors.start_date && (
                  <div className="text-danger">{errors.start_date}</div>
                )}
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">End Date</label>
                <input
                  className={`form-control ${errors.end_date ? "is-invalid" : ""}`}
                  type="datetime-local"
                  name="end_date"
                  value={data.end_date}
                  onChange={handleChange}
                />
                {errors.end_date && (
                  <div className="text-danger">{errors.end_date}</div>
                )}
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">From</label>
                <select
                  className={`form-select ${errors.from ? "is-invalid" : ""}`}
                  name="from"
                  value={data.from}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select From
                  </option>
                  {dzongkhags.map((dzongkhag, index) => (
                    <option key={index} value={dzongkhag}>
                      {dzongkhag}
                    </option>
                  ))}
                </select>
                {errors.from && (
                  <div className="text-danger">{errors.from}</div>
                )}
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">To</label>
                <select
                  className={`form-select ${errors.to ? "is-invalid" : ""}`}
                  name="to"
                  value={data.to}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select To
                  </option>
                  {dzongkhags.map((dzongkhag, index) => (
                    <option key={index} value={dzongkhag}>
                      {dzongkhag}
                    </option>
                  ))}
                </select>
                {errors.to && <div className="text-danger">{errors.to}</div>}
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">Mode of travel</label>
                <select
                  className={`form-select ${errors.mode ? "is-invalid" : ""}`}
                  name="mode"
                  value={data.mode}
                  onChange={(e) => {
                    handleChange(e);
                    setMode(e.target.value);
                  }}
                >
                  <option value="" disabled>
                    Select mode
                  </option>
                  <option value="Airplane">Airplane</option>
                  <option value="Train">Train</option>
                  <option value="Private Vehicle">Private Vehicle</option>
                  <option value="Pool Vehicle">Pool Vehicle</option>
                </select>
                {errors.mode && (
                  <div className="text-danger">{errors.mode}</div>
                )}
              </div>
              <CustomInput
                label={"Mileage(Km)"}
                name="mileage"
                type="number"
                isDisable={data.mode !== "Private Vehicle"}
                value={data.mileage}
                onChange={handleChange}
                error={errors.mileage || ""}
              />
             
              <CustomInput
                label="Number of days"
                type="number"
                name="days"
                value={data.days}
                onChange={handleChange}
              />
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label></label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="halt"
                    checked={haltChecked}
                    onChange={(e) => {
                      handleChange(e);
                      setHaltChecked(e.target.checked);
                      if (e.target.checked) setReturnChecked(false);
                    }}
                  />
                  <label className="form-check-label">Halt?</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="return"
                    checked={returnChecked}
                    onChange={(e) => {
                      handleChange(e);
                      setReturnChecked(e.target.checked);
                      if (e.target.checked) setHaltChecked(false);
                    }}
                  />
                  <label className="form-check-label">
                    Return on the same day?
                  </label>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">Halt at</label>
                <select
                  className={`form-select ${errors.halt_at ? "is-invalid" : ""}`}
                  name="halt_at"
                  disabled={haltChecked ? false : true}
                  value={data.halt_at}
                  onChange={(e) => {
                    handleChange(e);
                    setMode(e.target.value);
                  }}
                >
                  <option value="" disabled>
                    Select Halt Location
                  </option>
                  {dzongkhags.map((dzongkhag, index) => (
                    <option key={index} value={dzongkhag}>
                      {dzongkhag}
                    </option>
                  ))}
                </select>

                {errors.halt_at && (
                  <div className="text-danger">{errors.halt_at}</div>
                )}
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">DSA Percentage</label>
                <select
                  className={`form-select ${errors.dsa_percentage ? "is-invalid" : ""}`}
                  name="dsa_percentage"
                  value={data.dsa_percentage}
                  onChange={(e) => {
                    handleChange(e);
                    setMode(e.target.value);
                  }}
                >
                  <option value="" disabled>
                    Select Percentage
                  </option>
                  <option value="1">100%</option>
                  <option value="0.5">50%</option>
                </select>
                {errors.dsa_percentage && <div className="text-danger">{errors.dsa_percentage}</div>}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelDetails;
