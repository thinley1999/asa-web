import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import headerimage from "../../assets/img/head-img.png";
import { isoToDate } from "../utils/IsoDate";
import { isoToTime } from "../utils/IsoTime";

const DsaClaimForm = (data) => {
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
  console.log("mydata", reportData);

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
        pdf.save("DSAClaimForm.pdf");
      });
    }
  };

  const totalNu =
    (parseInt(reportData?.advance_amount?.Nu, 10) || 0) +
    (parseInt(reportData?.dsa_amount?.Nu, 10) || 0);

  const totalINR =
    (parseInt(reportData?.advance_amount?.INR, 10) || 0) +
    (parseInt(reportData?.dsa_amount?.INR, 10) || 0);

  const totalUSD =
    (parseInt(reportData?.advance_amount?.USD, 10) || 0) +
    (parseInt(reportData?.dsa_amount?.USD, 10) || 0);

  return (
    <div>
      {reportData && (
        <div ref={formRef} className="report-body">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {" "}
            <img src={headerimage} className="headerimage" alt="Header" />
          </div>

          <h6 className="text-center">
            <b>
              <u style={{ textUnderlineOffset: "2px" }}>
                TRAVEL ALLOWANCE CLAIM FORM
              </u>
            </b>
          </h6>

          <p className="formpTag">
            Ref No: <b> {reportData?.dispatched_ref?.dsa_claim_ref}</b>
          </p>

          <div className="row">
            <p className="formpTag col-6">
              Name: <u>{reportData?.user?.name}</u>
            </p>
            <p className="formpTag col-6">
              Date: <u>{isoToDate(reportData?.created_at)}</u>
            </p>
            <p className="formpTag col-6">
              Employee ID: <u>{reportData?.user?.eid}</u>
            </p>
            <p className="formpTag col-6">
              Grade: <u>{reportData?.user?.grade}</u>
            </p>
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
                  <th colSpan={4} className="text-center">
                    Time and Place
                  </th>
                  <th
                    rowSpan={2}
                    colSpan={2}
                    className="text-center"
                    style={{ verticalAlign: "middle" }}
                  >
                    DSA
                  </th>
                  <th
                    rowSpan={2}
                    colSpan={2}
                    className="text-center"
                    style={{ verticalAlign: "middle" }}
                  >
                    Actual Expense
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
                  <th>Time</th>
                  <th>To</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {/* <tr>
                <td colSpan={2}>13/07/2024</td>
                <td>Paro</td>
                <td>12/07/2024</td>
                <td>Bangkok</td>
                <td>12/07/2024</td>
                <td colSpan={2}>Nu.1200</td>
                <td colSpan={2}>Nu.1200</td>
                <td colSpan={2}>Travelling</td>
              </tr> */}

                {reportData?.user?.travel_itineraries.map((itenary, index) => (
                  <tr key={index}>
                    <td colSpan={2}>
                      {isoToDate(itenary?.start_date) || "N/A"}
                    </td>
                    <td>{itenary?.from || "N/A"}</td>
                    <td>{isoToTime(itenary?.start_date) || "N/A"}</td>
                    <td>{itenary?.to || "N/A"}</td>
                    <td>{isoToTime(itenary?.end_date) || "N/A"}</td>
                    <td colSpan={2}>
                      {itenary?.currency} {itenary?.rate}
                    </td>
                    <td colSpan={2}></td>
                    <td colSpan={2}>
                      {itenary?.stop_at ? `Stop at ${itenary?.stop_at}` : ""}
                      {itenary?.halt_at ? `Halt at ${itenary?.halt_at}` : ""}
                    </td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={6} className="text-end">
                    <b>TOTAL</b>
                  </td>
                  <td colSpan={2}>
                    {totalNu ? `Nu ${totalNu}` : "Nu 0.0"}{" "}
                    {totalINR ? `,INR ${totalINR}` : ""}{" "}
                    {totalUSD ? `,USD ${totalUSD}` : ""}
                  </td>
                  <td colSpan={2}></td>
                  <td colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <p className="formpTag">
              Total Claim:
              {totalNu
                ? `Nu. ${
                    totalNu
                      ? parseFloat(totalNu).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : ""
                  } `
                : "Nu 0.00"}
              {totalINR
                ? `INR. ${
                    totalINR
                      ? parseFloat(totalINR).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : ""
                  } `
                : ""}
              {totalUSD ? `,USD ${totalUSD}` : ""}
              {totalUSD
                ? `USD. ${
                    totalUSD
                      ? parseFloat(totalUSD).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : ""
                  } `
                : ""}
            </p>
            <p className="formpTag">
              Advance:
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
                : " Nu: 0.0 "}
              {reportData?.advance_amount?.USD
                ? `USD. ${
                    reportData.advance_amount.USD
                      ? parseFloat(
                          rreportData.advance_amount.USD
                        ).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : ""
                  }, `
                : ""}
              {reportData?.advance_amount?.INR
                ? `INR. ${
                    reportData.advance_amount.INR
                      ? parseFloat(
                          reportData.advance_amount.INR
                        ).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : ""
                  }
              `
                : ""}
            </p>
            <div className="d-flex justify-content-between">
              <p className="formpTag">
                Claim/ Refund:
                {reportData.dsa_amount?.Nu && reportData.dsa_amount.Nu != 0
                  ? `Nu ${reportData.dsa_amount.Nu}`
                  : "Nu 0.0"}
                {reportData.dsa_amount?.INR && reportData.dsa_amount.INR != 0
                  ? `,INR ${reportData.dsa_amount.INR}`
                  : " "}
                {reportData.dsa_amount?.USD && reportData.dsa_amount.USD != 0
                  ? `,USD ${reportData.dsa_amount.USD}`
                  : " "}
              </p>
            </div>
            <div className="d-flex justify-content-between">
              <p className="formpTag">
                Advance Ref No:{" "}
                <b> {reportData?.dispatched_ref?.advance_ref}</b>
              </p>
            </div>
            <br />
            <div className="d-flex justify-content-between">
              <div className="mt-4">
                <p className="formpTag">{reportData?.user?.name}</p>
                <p className="formpTag">
                  <b>Signature of employee</b>
                </p>
              </div>
              <div className="mt-4">
                <p className="formpTag">{reportData?.verified_by?.name}</p>
                <h5>
                  <p className="formpTag">
                    <b>(Finance Section)</b>
                  </p>
                </h5>
              </div>
              <div className="mt-4">
                {" "}
                <p className="formpTag">
                  {reportData?.confirmed_by?.name || "N/A"}
                </p>
                <p className="formpTag">
                  <b>({reportData?.confirmed_by?.role_name})</b>
                </p>
              </div>
            </div>

            <p className="formpTag text-center mt-3">
              <i>
                Certified that the travel was authorized by me for official
                purposes and the claims are genuine
              </i>
            </p>
          </div>
        </div>
      )}

      <div className="text-center">
        <button className="btn btn-primary mb-4" onClick={exportPDF}>
          Export as PDF
        </button>
      </div>
    </div>
  );
};

export default DsaClaimForm;
