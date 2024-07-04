import React from "react";
import { FaRegFilePdf } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";

const FileList = () => {
  const files = [
    {
      name: "document1.pdf",
      size: "500 KB",
      preview: () => console.log("Preview document1"),
      download: () => console.log("Download document1"),
    },
    {
      name: "image1.jpg",
      size: "300 KB",
      preview: () => console.log("Preview image1"),
      download: () => console.log("Download image1"),
    },
  ];

  return (
    <div className="file-names pt-2 ps-2 pe-2">
      <div className="d-flex pb-2">
        <FaRegFilePdf fontSize={18} color="red" />
        <p className="m-0 ms-2">testing_file.pdf</p>
        <div>
          <button
            type="button"
            className="btn btn-warning preview-btn p-0 ms-2"
          >
            <FaEye fontSize={12} />{" "}
            <span style={{ fontSize: "12px" }}>Preview</span>
          </button>
          <button type="button" className="btn btn-info preview-btn p-0 ms-2">
            <IoMdDownload fontSize={12} />{" "}
            <span style={{ fontSize: "12px" }}>Download</span>
          </button>
        </div>
      </div>
      <div className="d-flex pb-2">
        <FaRegFilePdf fontSize={18} color="red" />
        <p className="m-0 ms-2">testing_file.pdf</p>
        <div>
          <button
            type="button"
            className="btn btn-warning preview-btn p-0 ms-2"
          >
            <FaEye fontSize={12} />{" "}
            <span style={{ fontSize: "12px" }}>Preview</span>
          </button>
          <button type="button" className="btn btn-info preview-btn p-0 ms-2">
            <IoMdDownload fontSize={12} />{" "}
            <span style={{ fontSize: "12px" }}>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileList;
