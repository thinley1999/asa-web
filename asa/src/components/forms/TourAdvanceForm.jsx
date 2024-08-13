import React, { useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import headerimage from "../../assets/img/head-img.png";

const TourAdvanceForm = () => {
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
        pdf.save("TourAdvanceForm.pdf");
      });
    }
  };

  return (
    <div>
      <div ref={formRef} className="report-body">
        <img src={headerimage} className="headerimage" />
        <div className="d-flex">
          <p className="myformpTag me-3">Ref No: RMA/2024/1</p>
          <h5 className="text-center">
            <b>
              <u>TRAVEL ADVANCE REQUEST FORM</u>
            </b>
          </h5>
        </div>

        <div className="row">
          <p className="formpTag col-6">
            Name: <u>Thinley Yoezer</u>
          </p>
          <p className="formpTag col-6">
            Employee ID: <u>2023003</u>
          </p>
          <p className="formpTag col-6">
            Designation: <u>Asst. ICT Officer</u>
          </p>
          <p className="formpTag col-6">
            Department: <u>Technology and Innovation</u>
          </p>
          <p className="formpTag col-6">
            Grade: <u>PS4</u>
          </p>
          <p className="formpTag col-6">
            Date: <u>13/04/2024</u>
          </p>
          <p className="formpTag col-6">Travel Advance Amount:</p>
          <p className="formpTag col-6">Nu.2000, USD. 1400</p>
          <div className="col-12">
            <p className="formpTag">Reason for Travel Advance:</p>
            <p className="formpTag">Traveling for trainning at philipinese</p>
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
              <tr>
                <td colSpan={2}>13/07/2024</td>
                <td>Paro</td>
                <td>Bangkok</td>
                <td colSpan={2}>Areoplane</td>
                <td colSpan={2} rowSpan={3} style={{ verticalAlign: "middle" }}>
                  Travelling
                </td>
              </tr>
              <tr>
                <td colSpan={2}>13/07/2024</td>
                <td>Paro</td>
                <td>Bangkok</td>
                <td colSpan={2}>Areoplane</td>
              </tr>
              <tr>
                <td colSpan={2}>13/07/2024</td>
                <td>Paro</td>
                <td>Bangkok</td>
                <td colSpan={2}>Areoplane</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <p className="formpTag">
            I hereby authorize RMA to deduct from my salary the entire advance
            if I do not submit a Travel claim{" "}
          </p>
          <div className="d-flex justify-content-between mt-5">
            <p className="formpTag">Signature Director</p>
            <p className="formpTag">Employee Signature</p>
          </div>
        </div>
        <div>
          <p className="formpTag">
            Payment authorization by Department of Administration and Finance.
          </p>
          <p className="formpTag">
            Please pay Nu…………………….as per office order No. ………………………
          </p>
          <p className="formpTag mt-5 text-end"> Signature of Director, DAF</p>
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
