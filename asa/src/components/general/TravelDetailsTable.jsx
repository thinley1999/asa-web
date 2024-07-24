import React from "react";
import DataTable from "react-data-table-component";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";

const TravelDetailsTable = ({ existingData, data, removeRow, editRow }) => {
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f4f2ff",
        color: "#6e6893",
        borderBottom: "2px solid #ccc",
      },
    },
    headCells: {
      style: {
        fontSize: "15px",
        fontWeight: "600",
        textTransform: "uppercase",
      },
    },
    rows: {
      style: {
        borderBottom: "1px solid #ddd",
      },
    },
  };

  const columns = [
    {
      name: "Start Date",
      sortable: true,
      selector: (row) => row.start_date,
    },
    {
      name: "End Date",
      sortable: true,
      selector: (row) => row.end_date,
    },
    {
      name: "From",
      selector: (row) => row.from,
    },
    {
      name: "To",
      selector: (row) => row.to,
    },
    {
      name: "Mode",
      selector: (row) => row.mode,
    },
    {
      name: "DSA Amount",
      selector: (row) => row.rate,
    },
    {
      name: "Action",
      cell: (row) => {
        return (
          <div className="tabledetails">
            {existingData ? (
              <button
                type="button"
                className="btn btn-warning preview-btn p-0 ms-2 "
                onClick={() => editRow(row)}
              >
                <FaEye size={16} /> { }
                <span style={{ fontSize: "13px" }}>Preview</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-success ms-2"
                  onClick={() => editRow(row)}
                >
                  <MdModeEditOutline size={18} />
                </button>
                <button
                  type="button"
                  className="btn btn-danger ms-2"
                  onClick={() => removeRow(row.id)}
                >
                  <RiDeleteBinLine size={18} />
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="row w-100 mb-3">
      <DataTable columns={columns} data={existingData ? existingData : data} customStyles={customStyles} />
    </div>
  );
};

export default TravelDetailsTable;
