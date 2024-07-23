import React from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";

const ReportTable = () => {
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
  ];

  const data = [
    {
      id: 1,
      fromDate: "07/17/2024 10:07 AM",
      toDate: "07/17/2024 10:07 PM",
      from: "Bhutan",
      to: "Bhutan",
      dsaAmount: "2000",
    },
  ];

  const tableData = {
    columns,
    data,
    export: true,
    print: true,
  };
  return (
    <div className="bg-white px-4 py-4 my-3">
      <DataTable columns={columns} data={data} customStyles={customStyles} />
    </div>
  );
};

export default ReportTable;
