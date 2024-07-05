import React from "react";
import { FaRegFilePdf, FaEye } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";

const FileList = ({ files }) => {
  const handlePreview = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownload = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="file-names pt-2 ps-2 pe-2">
      {files.map((file, index) => (
        <div key={index} className="d-flex pb-2 align-items-center">
          <FaRegFilePdf fontSize={18} color="red" />
          <p className="m-0 ms-2">{file.name}</p>
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-warning preview-btn p-0 ms-2"
              onClick={() => handlePreview(file.url)}
            >
              <FaEye fontSize={12} />{" "}
              <span style={{ fontSize: "12px" }}>Preview</span>
            </button>
            <button
              type="button"
              className="btn btn-info preview-btn p-0 ms-2"
              onClick={() => handleDownload(file.url, file.name)}
            >
              <IoMdDownload fontSize={12} />{" "}
              <span style={{ fontSize: "12px" }}>Download</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;
