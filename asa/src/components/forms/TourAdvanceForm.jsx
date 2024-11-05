import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import headerimage from "../../assets/img/head-img.png";
import { isoToDate } from "../utils/IsoDate";

const TourAdvanceForm = (data) => {
  const formRef = useRef(null);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    document.body.classList.add("white-background");

    return () => {
      document.body.classList.remove("white-background");
    };
  }, []);

  useEffect(() => {
    if (data) {
      setReportData(data?.data?.report);
    }
  }, [data]);
  console.log(reportData, "data");
  const exportPDF = () => {
    if (formRef.current) {
      const scale = 3; // Increase the scale to capture higher resolution image
      html2canvas(formRef.current, {
        scale: scale,
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgWidth = 210; // Width of A4 in mm
        const pageHeight = 295; // Height of A4 in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, "PNG", 10, 10, imgWidth - 20, imgHeight - 20); // 10mm margins on top and sides
        heightLeft -= pageHeight;

        // Add new page if necessary
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
        pdf.save("TourAdvanceForm.pdf");
      });
    }
  };

  return (
    <div>
      <div ref={formRef} className="report-body">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={headerimage} className="headerimage" alt="Header" />
        </div>
        <h6 className="text-center">
          <b>
            <u style={{ textUnderlineOffset: "2px" }}>
              TRAVEL ADVANCE REQUEST FORM
            </u>
          </b>
        </h6>
        <p className="formpTag">
          Ref No:
          <b> {reportData?.dispatched_ref?.advance_ref}</b>
        </p>

        <div className="row">
          <p className="formpTag col-6">
            Name: <u>{reportData?.user?.name}</u>
          </p>
          <p className="formpTag col-6">
            Employee ID: <u>{reportData?.user?.eid}</u>
          </p>
          <p className="formpTag col-6">
            Designation: <u>{reportData?.user?.designation}</u>
          </p>
          <p className="formpTag col-6">
            Department:
            <u style={{ textUnderlineOffset: "2px" }}>
              {reportData?.user?.department}
            </u>
          </p>
          <p className="formpTag col-6">
            Grade: <u>{reportData?.user?.grade}</u>
          </p>
          <p className="formpTag col-6">
            Date: <u>{isoToDate(reportData?.created_at)}</u>
          </p>
          <p className="formpTag col-6">Travel Advance Amount:</p>
          <p className="formpTag col-6">
            {reportData?.advance_amount?.Nu
              ? `Nu. ${
                  reportData.advance_amount.Nu
                    ? parseFloat(reportData.advance_amount.Nu).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )
                    : ""
                }`
              : "Nu. 0.0, "}
            {reportData?.advance_amount?.USD
              ? `USD. ${
                  reportData.advance_amount.USD
                    ? parseFloat(reportData.advance_amount.USD).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )
                    : ""
                }, `
              : ""}
            {reportData?.advance_amount?.INR
              ? `INR. ${
                  reportData.advance_amount.INR
                    ? parseFloat(reportData.advance_amount.INR).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )
                    : ""
                }
              `
              : ""}
          </p>
          <div className="col-12">
            <p className="formpTag">
              Reason for Travel Advance:<u>{reportData?.remark}</u>
            </p>
            {/* <p className="formpTag">{reportData?.purpose}</p> */}
          </div>
        </div>

        <div className="table-responsive my-3">
          <table
            className="table table-bordered"
            style={{
              borderWidth: "2px",
              borderColor: "black",
              borderStyle: "solid",
            }}
          >
            <thead>
              <tr className="small fw-light hover-row">
                <th
                  rowSpan={2}
                  colSpan={2}
                  className="text-center"
                  style={{ verticalAlign: "middle" }}
                >
                  Date
                </th>
                <th colSpan={2} className="text-center">
                  Place
                </th>
                <th
                  rowSpan={2}
                  colSpan={2}
                  className="text-center"
                  style={{ verticalAlign: "middle" }}
                >
                  Mode of travel
                </th>
                <th
                  rowSpan={2}
                  colSpan={2}
                  className="text-center"
                  style={{ verticalAlign: "middle" }}
                >
                  Remarks
                </th>
              </tr>
              <tr className="small fw-light hover-row">
                <th>From</th>
                <th>To</th>
              </tr>
            </thead>
            <tbody>
              {reportData?.user?.travel_itineraries.map((itenary, index) => (
                <tr key={index}>
                  <td colSpan={2}>{isoToDate(itenary?.start_date) || "N/A"}</td>
                  <td>
                    {itenary.from_place || itenary.from
                      ? `${itenary.from_place || ""}, ${
                          itenary.from || ""
                        }`.replace(/^,\s*|,\s*$/, "")
                      : "N/A"}
                  </td>
                  <td>
                    {" "}
                    {itenary.to_place || itenary.to
                      ? `${itenary.to_place || ""}, ${
                          itenary.to || ""
                        }`.replace(/^,\s*|,\s*$/, "")
                      : "N/A"}
                  </td>
                  <td colSpan={2}>{itenary?.mode || "N/A"}</td>
                  <td colSpan={2}>
                    {itenary?.halt_at
                      ? `Halt at ${itenary.halt_at}`
                      : itenary?.stop_at
                      ? `Stop at ${itenary.stop_at}`
                      : "N/A"}
                  </td>
                  {/* <td colSpan={2} rowSpan={3} style={{ verticalAlign: "middle" }}>
                    Travelling
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <p className="formpTag">
            I hereby authorize RMA to deduct from my salary the entire advance
            if I do not submit a Travel claim{" "}
          </p>
          <div className="d-flex justify-content-between mt-5">
            <div className="mt-5">
              <p className="formpTag">{reportData?.verified_by?.name}</p>
              <h5>
                <p className="formpTag">
                  <b>(Finance Section)</b>
                </p>
              </h5>
            </div>
            <div className="mt-5">
              <p className="formpTag">{reportData?.user?.name}</p>
              <p className="formpTag">
                <b>Signature of employee</b>
              </p>
            </div>
          </div>
        </div>
        <div>
          <p className="formpTag">
            Payment authorization by Department of Administration and Finance.
          </p>
          <p className="formpTag">
            Please pay ………
            {reportData?.advance_amount?.Nu
              ? `Nu. ${
                  reportData.advance_amount.Nu
                    ? parseFloat(reportData.advance_amount.Nu).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )
                    : ""
                }`
              : "Nu 0.00"}
            {reportData?.advance_amount?.USD
              ? `USD. ${
                  reportData.advance_amount.USD
                    ? parseFloat(reportData.advance_amount.USD).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )
                    : ""
                }, `
              : ""}
            {reportData?.advance_amount?.INR
              ? `INR. ${
                  reportData.advance_amount.INR
                    ? parseFloat(reportData.advance_amount.INR).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )
                    : ""
                }
              `
              : ""}
            …………….as per office order No. ....{reportData?.office_order}……
          </p>
          <p className="formpTag mt-5 text-end">
            {" "}
            <p>{reportData?.confirmed_by?.name || "N/A"}</p>{" "}
            <b>({reportData?.confirmed_by?.role_name})</b>
          </p>
        </div>
      </div>
      <div className="text-center">
        <button className="btn btn-primary mb-4" onClick={exportPDF}>
          Export as PDF
        </button>
      </div>
    </div>
  );
};

export default TourAdvanceForm;
