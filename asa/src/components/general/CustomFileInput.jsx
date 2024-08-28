import React from "react";
import { FaCloudDownloadAlt, FaTimes } from "react-icons/fa";
import "../../assets/css/main.css";
import FileList from "./FileList";
import { RiDeleteBin6Line } from "react-icons/ri";

const CustomFileInput = ({
  label,
  name,
  files,
  handleFileChange,
  removeFile,
  error,
  data,
  isEditMode,
  updateFile,
  removeUpdateFile,
}) => {
  console.log("MyCheck", isEditMode);
  return (
    <div className="tourdetails col-xl-4 col-lg-4 col-md-4 col-12 mb-3">
      <label className="form-label">{label}</label>
      {isEditMode || !data ? (
        <div>
          {data && !isEditMode && <FileList files={data} />}
          <div className="d-flex">
            <label
              className="btn btn-primary btn-file"
              htmlFor={`file-upload-${name}`}
            >
              <FaCloudDownloadAlt size={20} /> <span>Upload Files</span>
              <input
                id={`file-upload-${name}`}
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
                aria-label={`Upload files for ${label}`}
              />
            </label>
            <span className="textwithbtn">Max file size 10 MB</span>
          </div>
        </div>
      ) : (
        data && <FileList files={data} />
      )}

       {(!isEditMode && !data) && (
        <div className={`file-names ${files?.length > 0 ? "padded" : ""}`}>
          {files?.map((file, index) => (
            <div key={index} className="file-name">
              {file.name}
              <RiDeleteBin6Line
                size={14}
                className="remove-icon"
                name={name}
                onClick={() => removeFile(index)}
                aria-label={`Remove ${file.name}`}
              />
            </div>
          ))}
        </div>
      )}

      {isEditMode && (
        <div className={`file-names ${files.length > 0 ? "padded" : ""}`}>
          {files.map((file) => (
            <div key={file.id} className="file-name">
              {file.name}
              <RiDeleteBin6Line
                size={14}
                className="remove-icon"
                name={name}
                onClick={() => removeFile(file.id)}
                aria-label={`Remove ${file.name}`}
              />
            </div>
          ))}
        </div>
      )}

      {updateFile && (
        <div className={`file-names ${updateFile.length > 0 ? "padded" : ""}`}>
          {updateFile.map((file, index) => (
            <div key={index} className="file-name">
              {file.name}
              <RiDeleteBin6Line
                size={14}
                className="remove-icon"
                name={name}
                onClick={() => removeUpdateFile(index)}
                aria-label={`Remove ${file.name}`}
              />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="invalid-feedback" style={{ display: "block" }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default CustomFileInput;
