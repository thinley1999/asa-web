import React, { useState, useEffect } from "react";
import CustomInput from "./CustomInput";
import { dzongkhags } from "../../components/datas/dzongkhag_lists";
import RateServices from "../services/RateServices";

const TravelDetails = ({
  existingData,
  isOpen,
  onClose,
  onSave,
  initialData,
  type,
  haltCount,
}) => {
  const [haltChecked, setHaltChecked] = useState(existingData?.halt_at || initialData?.halt_at ? true : false);
  const [returnChecked, setReturnChecked] = useState(false);
  const [mode, setMode] = useState("");
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [tourType, setTourType] = useState(type);
  const [dropDown, setDropDown] = useState([]);
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
  const halt_count = haltCount();

  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    const hours = ("0" + d.getHours()).slice(-2);
    const minutes = ("0" + d.getMinutes()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

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
    const {
      start_date,
      end_date,
      from,
      to,
      mode,
      mileage,
      halt_at,
      dsa_percentage,
    } = data;
    const newErrors = {};

    if (!start_date) newErrors.start_date = "Start date is required";
    if (!end_date) newErrors.end_date = "End date is required";
    if (!from) newErrors.from = "From location is required";
    if (!to) newErrors.to = "To location is required";
    if (!mode) newErrors.mode = "Mode of travel is required";
    if (!dsa_percentage)
      newErrors.dsa_percentage = "DSA percentage is required";

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

  const fetchCountry = async () => {
    try {
      const response = await RateServices.getCountryTo();
      if (response && response.status === 200) {
        setDropDown(response.data);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchRate = async (
    from,
    to,
    dsaPercentage,
    days,
    mode,
    mileage,
    halt_at,
    type
  ) => {
    try {
      if (mode === "Private Vehicle") {
        return dsaPercentage * 16 * mileage;
      }

      let response;
      if (tourType === "inCountry") {
        response = await RateServices.getRate(from, to);
      } else if (tourType === "outCountry") {
        if (halt_at) {
          response = await RateServices.getStopOverRate(halt_count + 1, halt_at);
        } else if (from === "India" && to === "India") {
          response = await RateServices.getRate(from, to);
        } else {
          response = await RateServices.getThirdCountryRate(to);
        }
      }

      if (response) {
        return dsaPercentage * days * response.rate;
      }
    } catch (error) {
      console.error("Error fetching rates:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    const { isValid, errors } = validateData();
    setErrors(errors);

    if (!isValid) return;
    console.log('data..', data);

    try {
      const { from, to, dsa_percentage, days, mode, mileage, halt_at } = data;
      const destination =
        type === "outCountry" ? { from, to } : { from: "Bhutan", to: "Bhutan" };

      const rate = await fetchRate(
        destination.from,
        destination.to,
        dsa_percentage,
        days,
        mode,
        mileage,
        halt_at,
      );

      setData((prevData) => ({ ...prevData, rate }));
      onSave({ ...data, rate });
      onClose();
    } catch (error) {
      console.error("Error while submitting:", error);
    }
  };

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (type === "outCountry") {
      fetchCountry();
      setDropDown(countries);
    } else if (type === "inCountry") {
      setDropDown(dzongkhags);
    }
  }, [type]);

  console.log('data....', data);

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
                  className={`form-control ${
                    errors.start_date ? "is-invalid" : ""
                  }`}
                  type="datetime-local"
                  name="start_date"
                  value={
                    existingData
                      ? formatDateForInput(data.start_date)
                      : data.start_date
                  }
                  onChange={handleChange}
                  disabled={existingData ? true : false}
                />
                {errors.start_date && (
                  <div className="text-danger">{errors.start_date}</div>
                )}
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">End Date</label>
                <input
                  className={`form-control ${
                    errors.end_date ? "is-invalid" : ""
                  }`}
                  type="datetime-local"
                  name="end_date"
                  value={
                    existingData
                      ? formatDateForInput(data.end_date)
                      : data.end_date
                  }
                  onChange={handleChange}
                  disabled={existingData ? true : false}
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
                  disabled={existingData ? true : false}
                >
                  <option value="" disabled>
                    Select From
                  </option>
                  {dropDown.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
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
                  disabled={existingData ? true : false}
                >
                  <option value="" disabled>
                    Select To
                  </option>
                  {dropDown.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
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
                  disabled={existingData ? true : false}
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
                  {type === "inCountry" && (
                    <option value="Private Vehicle">Private Vehicle</option>
                  )}
                  <option value="Pool Vehicle">Pool Vehicle</option>
                </select>
                {errors.mode && (
                  <div className="text-danger">{errors.mode}</div>
                )}
              </div>
              {type === "inCountry" && (
                <CustomInput
                  label={"Mileage(Km)"}
                  name="mileage"
                  type="number"
                  isDisable={
                    data.mode !== "Private Vehicle" || existingData
                      ? true
                      : false
                  }
                  value={data.mileage}
                  onChange={handleChange}
                  error={errors.mileage || ""}
                />
              )}

              <CustomInput
                label="Number of days"
                type="number"
                name="days"
                value={data.days}
                onChange={handleChange}
                isDisable={true}
              />
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label></label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="halt"
                    checked={haltChecked}
                    disabled={existingData ? true : false}
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
                    disabled={existingData ? true : false}
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
                  className={`form-select ${
                    errors.halt_at ? "is-invalid" : ""
                  }`}
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
                  {dropDown.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
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
                  className={`form-select ${
                    errors.dsa_percentage ? "is-invalid" : ""
                  }`}
                  name="dsa_percentage"
                  value={data.dsa_percentage}
                  disabled={existingData ? true : false}
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
                {errors.dsa_percentage && (
                  <div className="text-danger">{errors.dsa_percentage}</div>
                )}
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
            {!existingData ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                Save
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelDetails;
