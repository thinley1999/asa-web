import React, { useState, useEffect } from "react";
import CustomInput from "./CustomInput";
import { dzongkhags } from "../../components/datas/dzongkhag_lists";
import RateServices from "../services/RateServices";
import { distanceAndSkiddingToXY } from "@popperjs/core/lib/modifiers/offset";

const TravelDetails = ({
  existingData,
  isOpen,
  onClose,
  onSave,
  initialData,
  type,
  haltCount,
  edit,
  username,
  outCountry,
  editIndex,
  department,
}) => {
  const [haltChecked, setHaltChecked] = useState(
    existingData?.halt_at || initialData?.halt_at ? true : false
  );
  const [stopChecked, setStopChecked] = useState(
    existingData?.stop_at || initialData?.stop_at ? true : false
  );
  const [returnChecked, setReturnChecked] = useState(initialData?.return);
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
      from_place: "",
      to: "",
      to_place: "",
      mode: "",
      mileage: "",
      rate: "",
      currency: "",
      halt_at: "",
      dsa_percentage: "",
      days: "",
      stop_at: "",
      return: false,
    }
  );
  const halt_count = haltCount(editIndex);

  const formatDateForInput = (date) => {
    if (!date) return "";

    let d;
    if (typeof date === "string" && date.endsWith("Z")) {
      d = new Date(date);
    } else {
      d = new Date(date + "Z");
    }

    if (isNaN(d.getTime())) {
      return "";
    }

    const year = d.getUTCFullYear();
    const month = ("0" + (d.getUTCMonth() + 1)).slice(-2);
    const day = ("0" + d.getUTCDate()).slice(-2);
    const hours = ("0" + d.getUTCHours()).slice(-2);
    const minutes = ("0" + d.getUTCMinutes()).slice(-2);

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
      stop_at,
      dsa_percentage,
      from_place,
      to_place,
    } = data;
    const newErrors = {};

    if (!start_date) newErrors.start_date = "Start date is required";
    if (!end_date) newErrors.end_date = "End date is required";
    if (!dsa_percentage)
      newErrors.dsa_percentage = "DSA percentage is required";

    if (mode === "Private Vehicle" && !mileage) {
      newErrors.mileage = "Mileage is required for private vehicle";
    }

    if (!haltChecked) {
      if (!from) newErrors.from = "From location is required";
      if (!to) newErrors.to = "To location is required";
      if (!mode) newErrors.mode = "Mode of travel is required";
    }

    if (haltChecked && !halt_at) {
      newErrors.halt_at = "Halt location is required when halt is checked";
    }

    if (stopChecked && !stop_at) {
      newErrors.stop_at =
        "Stop Over location is required when stop over is checked";
    }

    if (outCountry && !haltChecked) {
      if (!from_place) newErrors.from_place = "From Place is required";
      if (!to_place) newErrors.to_place = "To Place is required";
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
      // console.error("Error fetching countries:", error);
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
    stop_at,
    type
  ) => {
    try {
      let response;
      let stop_response;

      if (mode === "Private Vehicle" || tourType === "inCountry") {
        const rateType = tourType === "inCountry" ? from : "Other";
        if (mode === "Private Vehicle") {
          response = await RateServices.getRate(
            rateType,
            to,
            edit ? username : ""
          );
          const rate =
            16 * mileage +
            eval(`${dsaPercentage} * ${days} * ${response.rate}`);

          return {
            rate,
            currency: "Nu",
          };
        } else {
          response = await RateServices.getRate(from, to, edit ? username : "");
          const rate = eval(`${dsaPercentage} * ${days} * ${response.rate}`);
          return {
            rate,
            currency: "Nu",
          };
        }
      } else if (tourType === "outCountry") {
        if (stop_at) {
          stop_response = await RateServices.getStopOverRate(
            halt_count + 1,
            stop_at
          );
        }

        if (
          (from === "India" && to === "India") ||
          (from === "Bhutan" && to === "Bhutan")
        ) {
          response = await RateServices.getRate(from, to, edit ? username : "");
        } else if (
          (from === "Bhutan" && to === "India") ||
          (from === "India" && to === "Bhutan")
        ) {
          response = await RateServices.getRate(
            "Other",
            to,
            edit ? username : ""
          );
        } else if (
          (from != "India" && to === "Bhutan") ||
          (from != "India" && to === "India")
        ) {
          response = await RateServices.getRate(
            "Other",
            to,
            edit ? username : ""
          );
        } else if (halt_at) {
          if (halt_at == "India" || halt_at == "Bhutan") {
            response = await RateServices.getRate("Other", halt_at, edit ? username : "");
          } else {
            response = await RateServices.getThirdCountryRate(halt_at);
          }
        } else {
          response = await RateServices.getThirdCountryRate(to);
        }
      }

      if (response || stop_response) {
        if (response && stop_response) {
          if (response.currency != stop_response.currency) { 
            throw new Error("Currency mismatch between response and stop_response.");
          }
        }
        return {
          rate:
            eval(`${dsaPercentage} * ${days} * ${response.rate}`) +
            (stop_response ? stop_response.rate : 0),
          currency: response.currency,
        };
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async () => {
    const { isValid, errors } = validateData();
    setErrors(errors);

    if (!isValid) return;

    try {
      const {
        from,
        to,
        dsa_percentage,
        days,
        mode,
        mileage,
        halt_at,
        stop_at,
      } = data;
      const destination =
        type === "outCountry" ? { from, to } : { from: "Bhutan", to: "Bhutan" };

      const { rate, currency } = await fetchRate(
        destination.from,
        destination.to,
        dsa_percentage,
        days,
        mode,
        mileage,
        halt_at,
        stop_at
      );

      setData((prevData) => ({ ...prevData, rate, currency }));
      onSave({ ...data, rate, currency });
      // console.log("data....", data);
      setData([]);
      onClose();
    } catch (error) {
      // console.error("Error while submitting:", error);
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
                  disabled={existingData ? (edit ? false : true) : false}
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
                  disabled={existingData ? (edit ? false : true) : false}
                />
                {errors.end_date && (
                  <div className="text-danger">{errors.end_date}</div>
                )}
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="halt"
                    checked={haltChecked}
                    disabled={existingData ? (edit ? false : true) : false}
                    onChange={(e) => {
                      handleChange(e);
                      setHaltChecked(e.target.checked);
                      if (e.target.checked) {
                        setData((prevData) => ({
                          ...prevData,
                          from: "",
                          from_place: "",
                          to: "",
                          to_place: "",
                          stop_at: "",
                          mode: "",
                          return: false,
                        }));
                        setReturnChecked(false);
                        setStopChecked(false);
                      }
                    }}
                  />
                  <label className="form-check-label">Halt?</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="return"
                    checked={data.return}
                    disabled={existingData ? (edit ? false : true) : false}
                    onChange={(e) => {
                      setData((prevData) => ({
                        ...prevData,
                        halt_at: "",
                        stop_at: "",
                        return: !prevData.return,
                      }));
                      setHaltChecked(false);
                      setStopChecked(false);
                    }}
                  />
                  <label className="form-check-label">
                    Return on the same day?
                  </label>
                </div>
                {type === "outCountry" && (
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="stop_at"
                      checked={stopChecked}
                      disabled={existingData ? (edit ? false : true) : false}
                      onChange={(e) => {
                        handleChange(e);
                        setStopChecked(e.target.checked);
                        if (e.target.checked) {
                          setData((prevData) => ({
                            ...prevData,
                            return: false,
                          }));
                          setHaltChecked(false);
                          setReturnChecked(false);
                        }
                        else{
                          setData((prevData) => ({
                            ...prevData,
                            stop_at: "",
                          }))
                        }
                      }}
                    />
                    <label className="form-check-label">Stop Over?</label>
                  </div>
                )}
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">
                  {outCountry ? "From Country" : "From"}
                </label>
                <select
                  className={`form-select ${errors.from ? "is-invalid" : ""}`}
                  name="from"
                  value={data.from}
                  onChange={handleChange}
                  disabled={
                    haltChecked || (existingData && !edit) ? true : false
                  }
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
              {outCountry && (
                <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                  <label className="form-label">From Place</label>
                  <input
                    className="form-control"
                    type="text"
                    name="from_place"
                    value={data.from_place || ""}
                    onChange={handleChange}
                    disabled={
                      haltChecked || (existingData && !edit) ? true : false
                    }
                  />
                  {errors.from_place && (
                    <div className="text-danger">{errors.from_place}</div>
                  )}
                </div>
              )}
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">
                  {outCountry ? "To Country" : "To"}
                </label>
                <select
                  className={`form-select ${errors.to ? "is-invalid" : ""}`}
                  name="to"
                  value={data.to}
                  onChange={handleChange}
                  disabled={
                    haltChecked || (existingData && !edit) ? true : false
                  }
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
              {outCountry && (
                <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                  <label className="form-label">To Place</label>
                  <input
                    className="form-control"
                    type="text"
                    name="to_place"
                    value={data.to_place || ""}
                    onChange={handleChange}
                    disabled={
                      haltChecked || (existingData && !edit) ? true : false
                    }
                  />
                  {errors.to_place && (
                    <div className="text-danger">{errors.to_place}</div>
                  )}
                </div>
              )}
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">Mode of travel</label>
                <select
                  className={`form-select ${errors.mode ? "is-invalid" : ""}`}
                  name="mode"
                  value={data.mode}
                  disabled={
                    haltChecked || (existingData && !edit) ? true : false
                  }
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
                isDisable={
                  data.mode !== "Private Vehicle" || (existingData && !edit)
                    ? true
                    : false
                }
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
                isDisable={true}
              />
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">Halt at</label>
                <select
                  className={`form-select ${
                    errors.halt_at ? "is-invalid" : ""
                  }`}
                  name="halt_at"
                  disabled={
                    haltChecked && !data.return && (!existingData || edit)
                      ? false
                      : true
                  }
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
              {type === "outCountry" && (
                <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                  <label className="form-label">Stop at</label>
                  <select
                    className={`form-select ${
                      errors.stop_at ? "is-invalid" : ""
                    }`}
                    name="stop_at"
                    disabled={
                      stopChecked && !data.return && (!existingData || edit)
                        ? false
                        : true
                    }
                    value={data.stop_at}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select Stop Over Location
                    </option>
                    {dropDown.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>

                  {errors.stop_at && (
                    <div className="text-danger">{errors.stop_at}</div>
                  )}
                </div>
              )}
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">DSA Percentage</label>
                <select
                  className={`form-select ${
                    errors.dsa_percentage ? "is-invalid" : ""
                  }`}
                  name="dsa_percentage"
                  value={data.dsa_percentage}
                  disabled={existingData ? (edit ? false : true) : false}
                  onChange={(e) => {
                    handleChange(e);
                    setMode(e.target.value);
                  }}
                >
                  <option value="" disabled>
                    Select Percentage
                  </option>
                  <option value="1">100% (No meals & lodging)</option>
                  {department === "Management" && type === "inCountry" && (
                    <option value="7/10">70% (Lodging provided)</option>
                  )}
                  {department === "Management" && type === "outCountry" && (
                    <option value="7/12">58.33% (Lodging provided)</option>
                  )}
                  <option value="1/2">50% (Lodging provided)</option>
                  <option value="3/10">
                    30% (Both Meals and Lodging provided)
                  </option>
                  {
                    type === "outCountry" && (
                      <option value="1/5">20% (Partially Funded)</option>
                    )
                  }
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
            {!existingData || edit ? (
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
