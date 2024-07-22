import React from "react";
import DataTable from "react-data-table-component";
import { MdModeEditOutline } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const TravelDetailsTable = () => {
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f4f2ff",
        color: "#6e6893",
      },
    },
    headCells: {
      style: {
        fontSize: "15px",
        fontWeight: "600",
        textTransform: "uppercase",
      },
    },
  };

  const columns = [
    {
      name: "Start Date",
      sortable: true,
      selector: (row) => row.fromDate,
    },
    {
      name: "End Date",
      sortable: true,
      selector: (row) => row.toDate,
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
      name: "DSA Amount",
      selector: (row) => row.dsaAmount,
    },
    {
      name: "Action",
      selector: (row) => row.action,
    },
  ];

  const data = [
    {
      id: 1,
      fromDate: "07/17/2024 10:07 AM",
      toDate: "07/17/2024 10:07 PM",
      from: "Bhutan",
      to: "Bhutan",
      dsaAmount: "2000",
      action: (
        <div className="tabledetails">
          <button type="button" className="btn btn-success ms-2">
            <MdModeEditOutline size={18} />
          </button>
          <button type="button" className="btn btn-danger ms-2">
            <IoMdClose size={18} />
          </button>
        </div>
      ),
    },
  ];
  return (
    <div className="row w-100 mb-3">
      <DataTable columns={columns} data={data} customStyles={customStyles} />
    </div>
  );
};

export default TravelDetailsTable;
