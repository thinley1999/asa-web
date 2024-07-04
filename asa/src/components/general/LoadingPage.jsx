import React from "react";
import "../../assets/css/main.css";

const LoadingPage = () => {
  return (
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default LoadingPage;
