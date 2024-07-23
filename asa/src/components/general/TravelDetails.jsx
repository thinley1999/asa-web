import React, { useState, useEffect } from "react";
import CustomInput from "./CustomInput";
import { dzongkhags } from "../../components/datas/dzongkhag_lists";
import RateServices from "../services/RateServices";

const TravelDetails = ({ isOpen, onClose, onSave, initialData }) => {
  const [haltChecked, setHaltChecked] = useState(true);
  const [returnChecked, setReturnChecked] = useState(false);
  const [mode, setMode] = useState("");

  const [data, setData] = useState(
    initialData || {
      startDate: "",
      endDate: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(data);
    onClose();
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
                  className="form-control"
                  type="datetime-local"
                  name="startDate"
                  value={data.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">End Date</label>
                <input
                  className="form-control"
                  type="datetime-local"
                  name="endDate"
                  value={data.endDate}
                  onChange={handleChange}
                />
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">From</label>
                <select
                  className="form-select"
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
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">To</label>
                <select
                  className="form-select"
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
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">Mode of travel</label>
                <select
                  className="form-select"
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
              </div>
              <CustomInput
                label={"Mileage"}
                name="mileage"
                type="number"
                isDisable={data.mode !== "Private Vehicle"}
                value={data.mileage}
                onChange={handleChange}
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
                <label className="form-label">Halt At</label>
                <input
                  type="text"
                  className="form-control"
                  name="halt_at"
                  value={data.halt_at}
                  onChange={handleChange}
                  disabled={returnChecked}
                />
              </div>
              <div className="col-xl-3 col-lg-3 col-md-3 col-12 mb-3">
                <label className="form-label">DSA Percent</label>
                <select
                  className="form-select"
                  name="dsa_percentage"
                  value={data.dsa_percentage}
                  onChange={handleChange}
                >
                  <option value="100">100</option>
                  <option value="50">50</option>
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button
                type="button"
                className="btn btn-secondary me-4 mb-2"
                onClick={() => setData(initialData)}
              >
                Clear
              </button>
              <button
                type="button"
                className="btn btn-primary me-4 mb-2"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelDetails;
