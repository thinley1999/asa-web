import React from "react";
import { Link } from "react-router-dom";
import pagenotfoundimage from "../../assets/img/404.png";

const PageNotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <img
        src={pagenotfoundimage}
        className="rounded-circle me-2"
        style={{ width: "50vh" }}
      />
      <h1>Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link to="/">Go to Login</Link>
    </div>
  );
};

export default PageNotFound;
