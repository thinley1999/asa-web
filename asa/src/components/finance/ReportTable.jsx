import React from "react";
import { TbFileTypeXls } from "react-icons/tb";
import { FaRegFilePdf } from "react-icons/fa6";
import { data } from "../datas/report_sample";

const ReportTable = () => {
  return (
    <div className="bg-white px-4 py-4 my-3">
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-success me-1">
          <TbFileTypeXls fontSize={20} />
        </button>
        <button className="btn btn-danger me-1">
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
              <th className="text-end" colSpan="5">10,000</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;