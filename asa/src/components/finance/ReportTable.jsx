import React, { useState, useEffect } from "react";
import { FaRegFilePdf, FaEye } from "react-icons/fa6";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";
import filenotfound from "../../assets/img/file not found.jpg";
import { advance_type } from "../datas/advance_type";
import { isoToDate } from "../utils/IsoDate";

const ReportTable = ({ data, total, filters }) => {
  const exportToPDF = () => {
    const input = document.querySelector(".table-responsive");

    html2canvas(input, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth - 20, imgHeight - 20);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          10,
          position,
          imgWidth - 20,
          imgHeight - 20
        );
        heightLeft -= pageHeight;
      }

      pdf.save(`${filters?.report_type}_Advance_Report.pdf`);
    });
  };

  if (data.length === 0) {
    return (
      <div className="bg-white px-4 py-4 my-3">
        <div className="d-flex justify-content-center align-items-center flex-column">
          <img src={filenotfound} width={250} />
          <h5>
            <b>No Data Found !</b>
          </h5>
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
              <th colSpan="7">{filters?.report_type} Advance Report</th>
            </tr>
            <tr className="text-center small fw-medium hover-row">
              <th colSpan="7">
                Financial Year:{" "}
                {format(new Date(filters?.start_date), "dd MMMM yyyy")} -{" "}
                {format(new Date(filters?.end_date), "dd MMMM yyyy")}
              </th>
            </tr>
            <tr className="text-center small fw-medium hover-row">
              <th colSpan="7">Advance Details</th>
            </tr>
            <tr className="small fw-light hover-row">
              <th>Date</th>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th>Advance Type</th>
              <th>Amount</th>
              <th>Report</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item?.id} className="hover-row">
                <td>{isoToDate(item?.created_at)}</td>
                <td>{item?.user?.name}</td>
                <td>{item?.user?.username}</td>
                <td>{item?.user?.department}</td>
                <td>{advance_type[item?.advance_type]}</td>
                <td>
                  {item?.advance_type === "in_country_tour_advance" ||
                  item?.advance_type === "ex_country_tour_advance" ? (
                    <>
                      Nu {item.advance_amount?.Nu ?? 0} INR{" "}
                      {item.advance_amount?.INR ?? 0} USD{" "}
                      {item.advance_amount?.USD ?? 0}
                    </>
                  ) : (
                    `Nu ${item?.amount}`
                  )}
                </td>
                <td
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-warning viewbtn"
                    style={{ borderRadius: "5px" }}
                  >
                    <a
                      href={`/individualReport/${item?.id}/`}
                      target="_blank"
                      style={{ color: "black" }}
                    >
                      <FaEye size={14} />
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
