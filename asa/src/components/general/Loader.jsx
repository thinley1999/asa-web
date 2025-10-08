import React from "react";
import "../../assets/css/loader.css";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-spinner"></div>
      <p className="loader-text">{text}</p>
    </div>
  );
};

export default Loader;
