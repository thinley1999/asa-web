import React from "react";

const ClaimDropDown = ({
  label,
  name,
  value,
  handleChange,
  errors,
  dropDown,
  isDisable,
  disoptions,
}) => {
  return (
    <div className="col-xl-4 col-lg-3 col-md-3 col-12 mb-3">
      <label className="form-label">{label}</label>
      <select
        className={`form-select ${errors ? "is-invalid" : ""}`}
        name={name}
        value={value || ""}
        onChange={handleChange}
        disabled={isDisable}
      >
        <option value="" disabled>
          {disoptions}
        </option>
        {dropDown.map((country, index) => (
          <option
            key={index}
            value={country === "100" ? 1 : country === "50" ? 0.5 : country}
          >
            {country}
          </option>
        ))}
      </select>
      {errors && <div className="text-danger">{errors}</div>}
    </div>
  );
};

export default ClaimDropDown;
