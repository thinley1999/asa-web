import React, { useState } from "react";
import CustomInput from "./CustomInput";

const TravelDetails = ({ isOpen, onClose, onSubmit }) => {
  const [haltChecked, setHaltChecked] = useState(true);
  const [returnChecked, setReturnChecked] = useState(false);
  const [mode, setMode] = useState(true);

  if (!isOpen) return null;

  const validateForm = () => {
    let errors = {};
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleHaltChange = (e) => {
    const isChecked = e.target.checked;
    setHaltChecked(isChecked);

    if (isChecked) {
      setReturnChecked(false);
    }
  };

  const handleReturnChange = (e) => {
    const isChecked = e.target.checked;
    setReturnChecked(isChecked);
    if (isChecked) {
      setHaltChecked(false);
    }
  };

  const handleModeChange = (e) => {
    setMode(e.target.value);
  };

  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: "block" }}>
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ maxWidth: "900px" }}
      >
        <div className="modal-content">
          <div className="modal-header">
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
                />
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">End Date</label>
                <input
                  className="form-control"
                  type="datetime-local"
                  name="endDate"
                />
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">From</label>
                <select className="form-select" name="from">
                  <option value="" disabled>
                    Select From
                  </option>
                </select>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">To</label>
                <select className="form-select" name="to">
                  <option value="" disabled>
                    Select To
                  </option>
                </select>
              </div>
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label className="form-label">Mode of travel</label>
                <select
                  className="form-select"
                  name="mode"
                  onChange={handleModeChange}
                >
                  <option value="" disabled>
                    Select mode
                  </option>
                  <option value="Airplane">Airplane</option>
                  <option value="Train">Train</option>
                  <option value="Private Vehicle">Private Vehicle</option>
                  <option value="Other Vehicle">Other Vehicle</option>
                </select>
              </div>
              <CustomInput
                label={"Mileage"}
                name="mileage"
                type="number"
                isDisable={mode !== "Private Vehicle"}
              />
              <CustomInput label="Rate(Nu)" type="text" name="rate" />
              <div className="col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
                <label></label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="halt"
                    checked={haltChecked}
                    onChange={handleHaltChange}
                  />
                  <label className="form-check-label">Halt?</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="return"
                    checked={returnChecked}
                    onChange={handleReturnChange}
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
                  name="haltAt"
                  disabled={returnChecked}
                />
              </div>
              <div className="col-xl-3 col-lg-3 col-md-3 col-12 mb-3">
                <label className="form-label">
                  DSA Percent <span className="reqspan">*</span>
                </label>
                <select className="form-select" name="dsaPercent">
                  <option value="100">100</option>
                  <option value="50">50</option>
                </select>
              </div>
              <CustomInput label="DSA Amount" type="text" name="days" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelDetails;
