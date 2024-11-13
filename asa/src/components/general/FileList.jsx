import React from "react";
import { FaRegFilePdf, FaEye } from "react-icons/fa";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";

const FileList = ({ files, myEdit }) => {
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
          <p className="m-0 ms-2">
            <span className="text-ellipsis" data-full-text={file.name}>
              {file.name}
            </span>
          </p>
          <div className="ms-auto">
            <button
              type="button"
              className="btn btn-warning preview-btn p-0 ms-2"
              onClick={() => handlePreview(file.url)}
            >
              <FaEye fontSize={12} />{" "}
              <span style={{ fontSize: "12px" }}>Preview </span>{" "}
            </button>
            <button
              type="button"
              className="btn btn-info preview-btn p-0 ms-2"
              onClick={() => handleDownload(file.url, file.name)}
            >
              <FaCloudDownloadAlt fontSize={12} />
            </button>
            {myEdit && (
              <button
                type="button"
                className="btn btn-danger preview-btn p-0 ms-2"
              >
                <RiDeleteBinLine fontSize={12} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;
