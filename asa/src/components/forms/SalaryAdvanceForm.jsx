import React, { useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import headerimage from "../../assets/img/head-img.png";

const SalaryAdvanceForm = () => {
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
        pdf.save("SalaryAdvanceForm.pdf");
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
              <u>APPLICATION FOR ADVANCE AGAINST SALARY</u>
            </b>
          </h5>
        </div>

        <div className="d-flex justify-content-between">
          <p className="formpTag">
            EID: <u>2023003</u>
          </p>
          <p className="formpTag">
            Date: <u>12/07/2024</u>
          </p>
        </div>
        <div>
          <p className="formpTag">
            Name: <u>Thinley Yoezer</u>
          </p>
          <p className="formpTag">
            Designation: <u>Asst. ICT Officer</u>
          </p>
          <p className="formpTag">
            Department: <u>Technology & Innovation</u>
          </p>
          <p className="formpTag">
            Amount of Advance Required: <u>12000</u>
          </p>
          <p className="formpTag">
            Purpose for which Advance is required: <u>Personal</u>
          </p>
        </div>
        <div className="mt-5">
          <h5>
            <b>Signature of employee</b>
          </h5>
        </div>

        <h5 className="text-center mt-4">
          <b>
            <u>TO BE COMPLETED BY FINANCE SECTION, DAF</u>
          </b>
        </h5>
        <div>
          {" "}
          <p className="formpTag">1. Balance of previous advance if any:</p>
          <ol type="a">
            <li>
              Salary advance: <ul></ul>
            </li>
            <li>
              Other advance: <ul></ul>
            </li>
            <li>
              Tour Advance: : <ul></ul>
            </li>
          </ol>
          <p className="formpTag">
            2. <b>NET PAY: </b> <u></u>
          </p>
          <p className="formpTag">
            3. Amount recommended: <u></u>
          </p>
          <p className="formpTag">
            4. Deduction per month: <u></u>
          </p>
          <p className="formpTag">
            {" "}
            (to be repaid in _______ installments): <u></u>
          </p>
        </div>
        <div className="d-flex justify-content-end">
          <div className="form-check me-3">
            <input
              className="form-check-input customcheckbox"
              type="checkbox"
              value=""
            />
            <label>
              <b>APPROVED</b>
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input customcheckbox"
              type="checkbox"
              value=""
            />
            <label>
              <b>DISAPPROVED</b>
            </label>
          </div>
        </div>
        <div className="d-flex justify-content-between mt-5">
          <p className="formpTag">
            <b>(Finance Section)</b>
          </p>
          <p className="formpTag">
            <b>(Director, DAF)</b>
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

export default SalaryAdvanceForm;
