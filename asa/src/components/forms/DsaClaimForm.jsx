import React, { useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import headerimage from "../../assets/img/head-img.png";

const DsaClaimForm = () => {
  const formRef = useRef(null);

  useEffect(() => {
    document.body.classList.add("white-background");

    return () => {
      document.body.classList.remove("white-background");
    };
  }, []);

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

  return (
    <div>
      <div ref={formRef} className="report-body">
        <img src={headerimage} className="headerimage" />
        <div className="d-flex">
          <p className="myformpTag me-5">Ref No: RMA/2024/1</p>
          <h5 className="text-center ms-5">
            <b>
              <u>TRAVEL ALLOWANCE CLAIM FORM</u>
            </b>
          </h5>
        </div>

        <div className="row">
          <p className="formpTag col-6">
            Name: <u>Thinley Yoezer</u>
          </p>
          <p className="formpTag col-6">
            Date: <u>13/04/2024</u>
          </p>
          <p className="formpTag col-6">
            Employee ID: <u>2023003</u>
          </p>
          <p className="formpTag col-6">
            Grade: <u>PS4</u>
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
              <tr>
                <td colSpan={2}>13/07/2024</td>
                <td>Paro</td>
                <td>12/07/2024</td>
                <td>Bangkok</td>
                <td>12/07/2024</td>
                <td colSpan={2}>Nu.1200</td>
                <td colSpan={2}>Nu.1200</td>
                <td colSpan={2}>Travelling</td>
              </tr>
              <tr>
                <td colSpan={2}>13/07/2024</td>
                <td>Paro</td>
                <td>12/07/2024</td>
                <td>Bangkok</td>
                <td>12/07/2024</td>
                <td colSpan={2}>Nu.1200</td>
                <td colSpan={2}>Nu.1200</td>
                <td colSpan={2}>Travelling</td>
              </tr>
              <tr>
                <td colSpan={2}>13/07/2024</td>
                <td>Paro</td>
                <td>12/07/2024</td>
                <td>Bangkok</td>
                <td>12/07/2024</td>
                <td colSpan={2}>Nu.1200</td>
                <td colSpan={2}>Nu.1200</td>
                <td colSpan={2}>Travelling</td>
              </tr>
              <tr>
                <td colSpan={6} className="text-end">
                  <b>TOTAL (Nu.)</b>
                </td>
                <td colSpan={2}>2500</td>
                <td colSpan={2}>2500</td>
                <td colSpan={2}></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <p className="formpTag">Total Claim:</p>
          <p className="formpTag">Advance:</p>
          <div className="d-flex justify-content-between">
            <p className="formpTag">Claim/ Refund:</p>
            <p className="formpTag">(Signature of employee)</p>
          </div>
          <p className="formpTag text-center my-3">(Director, DAF)</p>
          <p className="formpTag text-center">
            <i>
              Certified that the travel was authorized by me for official
              purposes and the claims are genuine
            </i>
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

export default DsaClaimForm;
