import React from "react";
import { TbFileTypeXls } from "react-icons/tb";
import { FaRegFilePdf } from "react-icons/fa6";
import { data } from "../datas/report_sample";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const ReportTable = () => {
  const exportToPDF = () => {
    // Create a new jsPDF instance
    const doc = new jsPDF();
    
    // Define the table columns and data
    const columns = ["Name", "Employee ID", "Department", "Advance Type", "Amount"];
    const rows = data.map(item => [
      item.name,
      item.username,
      item.department,
      item.advance_type,
      item.amount
    ]);
  
    // Calculate the total amount
    const totalAmount = data.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    
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
      didDrawPage: function (data) {
        
      }
    });
    
    // Save the PDF
    doc.save("report.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: ["name", "username", "department", "advance_type", "amount"],
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Advances");
    XLSX.writeFile(workbook, "report.xlsx");
  };
  
  return (
    <div className="bg-white px-4 py-4 my-3">
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-success me-1" onClick={exportToExcel}>
          <TbFileTypeXls fontSize={20} />
        </button>
        <button className="btn btn-danger me-1" onClick={exportToPDF}>
          <FaRegFilePdf fontSize={20} />
        </button>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr className="text-center small fw-medium hover-row">
              <th colSpan="6">Individual Advance Report</th>
            </tr>
            <tr className="text-center small fw-medium hover-row">
              <th colSpan="6">
                Financial Year: 1st July 2024 - 31st July 2024
              </th>
            </tr>
            <tr className="text-center small fw-medium hover-row">
              <th colSpan="6">Advance Details</th>
            </tr>
            <tr className="text-center small fw-light hover-row">
              <th>Name</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th>Advance Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="hover-row">
                <td>{item.name}</td>
                <td>{item.username}</td>
                <td>{item.department}</td>
                <td>{item.advance_type}</td>
                <td>{item.amount}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="small fw-medium hover-row">
              <th>Total Amount</th>
              <th className="text-end" colSpan="5">
                10,000
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;