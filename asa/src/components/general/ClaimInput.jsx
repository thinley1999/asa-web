import React from "react";

const ClaimInput = ({label, type, name, value, handleChange, isDisable}) => {
  return (
    <div className="col-xl-3 col-lg-3 col-md-3 col-12 mb-3">
      <label className="form-label">
        {label} <span className="reqspan">*</span>
      </label>
      <input
        type={type}
        className="form-control"
        name={name}
        value={value ? value : ""}
        onChange={handleChange}
        disabled={isDisable}
      />
    </div>
  );
};

export default ClaimInput;
