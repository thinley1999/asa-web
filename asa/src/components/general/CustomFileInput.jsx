import React, { useState } from "react";
import { FaCloudDownloadAlt, FaTimes } from "react-icons/fa";
import "../../assets/css/main.css";

const CustomFileInput = ({ label, name }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
      <label className="form-label">{label}</label>
      <div className="d-flex">
        <span className="btn btn-primary btn-file">
          <FaCloudDownloadAlt size={20} /> <span>Upload Files</span>
          <input type="file" multiple onChange={handleFileChange} />
        </span>
        <span className="textwithbtn">Max file size 10 MB</span>
      </div>
      <div className={`file-names ${files.length > 0 ? "padded" : ""}`}>
        {files.map((file, index) => (
          <div key={index} className="file-name">
            {file.name}
            <FaTimes
              size={14}
              className="remove-icon"
              name={name}
              onClick={() => removeFile(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomFileInput;
