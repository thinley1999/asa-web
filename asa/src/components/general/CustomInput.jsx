import React from "react";

const CustomInput = ({
  label,
  type,
  value,
  name,
  isDisable,
  onChange,
  error,
}) => {
  return (
    <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
      <label className="form-label">{label}</label>
      <input
        className={`form-control ${error ? "is-invalid" : ""}`}
        type={type}
        name={name}
        value={value}
        disabled={isDisable ? true : false}
        onChange={onChange}
      />
      {error && (
        <div className="invalid-feedback" style={{ display: "block" }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default CustomInput;
