import React, { useState, useEffect } from "react";
import { FaRegFilePdf } from "react-icons/fa6";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import SalaryAdvanceForm from "../forms/SalaryAdvanceForm";

const ReportTable = ({ data, total, filters }) => {
  const exportToPDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Define the table columns and data
    const columns = [
      "Name",
      "Employee ID",
      "Department",
      "Advance Type",
      "Amount",
    ];
    const rows = data.map((item) => [
      item.name,
      item.username,
      item.department,
      item.advance_type,
      item.amount,
    ]);

    // Calculate the total amount
    const totalAmount = data.reduce(
      (sum, item) => sum + parseFloat(item.amount),
      0
    );

    // Add title and financial year text
    doc.setFontSize(12); // Set font size for the title
    doc.text("Individual Advance Report", 15, 12);
    doc.setFontSize(12); // Set font size for the financial year text
    doc.text("Financial Year: 1st July 2024 - 31st July 2024", 15, 20);

    // Add the table with jsPDF autoTable
    doc.autoTable({
      head: [columns],
      body: [...rows, ["Total Amount", "", "", "", totalAmount.toFixed(2)]],
      margin: { top: 30 },
      startY: 25,
      didDrawPage: function (data) {},
    });

    // Save the PDF
    doc.save("report.pdf");
  };

  if (data.length === 0) {
    return (
      <div className="bg-white px-4 py-4 my-3">
        <div className="d-flex justify-content-center mb-3">
          <p className="text-center">No Reports available to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white px-4 py-4 my-3">
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-danger me-1" onClick={exportToPDF}>
          <FaRegFilePdf fontSize={20} />
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr className="text-center small fw-medium hover-row">
              <th colSpan="6">{filters?.report_type} Advance Report</th>
            </tr>
            <tr className="text-center small fw-medium hover-row">
              <th colSpan="6">
                Financial Year:{" "}
                {format(new Date(filters?.start_date), "dd MMMM yyyy")} -{" "}
                {format(new Date(filters?.end_date), "dd MMMM yyyy")}
              </th>
            </tr>
            <tr className="text-center small fw-medium hover-row">
              <th colSpan="6">Advance Details</th>
            </tr>
            <tr className="small fw-light hover-row">
              <th>Name</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th>Advance Type</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item?.id} className="hover-row">
                <td>{item?.user?.name}</td>
                <td>{item?.user?.username}</td>
                <td>{item?.user?.department}</td>
                <td>{item?.advance_type}</td>
                <td>{item?.amount}</td>
                <td>
                  <button type="button" className="btn btn-warning viewbtn">
                    <a
                      href={`/dsaClaimForm/`}
                      target="_blank"
                      style={{ color: "black" }}
                    >
                      View
                    </a>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="small fw-medium hover-row">
              <th>Total Amount</th>
              <th className="text-end" colSpan="5">
                {total?.Nu} Nu {total?.INR} INR {total?.USD} USD
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;
