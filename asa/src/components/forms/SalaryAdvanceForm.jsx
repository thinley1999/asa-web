import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import headerimage from "../../assets/img/head-img.png";
import { isoToDate } from "../utils/IsoDate";

const SalaryAdvanceForm = ({ data, type }) => {
  const formRef = useRef(null);
  const [reportData, setReportData] = useState("");
  useEffect(() => {
    if (data) {
      setReportData(data?.report);
    }
  }, [data]);

  const exportPDF = () => {
    if (formRef.current) {
      const scale = 3;
      html2canvas(formRef.current, {
        scale: scale,
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, "PNG", 10, 10, imgWidth - 20, imgHeight - 20); // 10mm margins on top and sides
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
        pdf.save("SalaryAdvanceForm.pdf");
      });
    }
  };

  useEffect(() => {
    document.body.classList.add("white-background");

    return () => {
      document.body.classList.remove("white-background");
    };
  }, []);

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
          <img
            src={headerimage}
            className="headerimage"
            alt="Header"
            style={{ opacity: "40%" }}
          />
        </div>
        <h6 className="text-center">
          <b>
            <u style={{ textUnderlineOffset: "2px" }}>
              {type === "salary_advance"
                ? "APPLICATION FOR ADVANCE AGAINST SALARY"
                : "APPLICATION FOR OTHER ADVANCE"}
            </u>
          </b>
        </h6>
        <div className="d-flex"></div>

        <div className="d-flex justify-content-between">
          <p className="formpTag">
            Ref No:
            <b>{reportData?.dispatched_ref?.advance_ref}</b>
          </p>
          <p className="formpTag">
            Date:{" "}
            <u style={{ textUnderlineOffset: "2px" }}>
              {isoToDate(reportData?.created_at)}
            </u>
          </p>
        </div>
        <div>
          <p className="formpTag">
            EID:{" "}
            <u style={{ textUnderlineOffset: "2px" }}>
              {reportData?.user?.eid}
            </u>
          </p>
          <p className="formpTag">
            Name:{" "}
            <u style={{ textUnderlineOffset: "2px" }}>
              {reportData?.user?.name}
            </u>
          </p>
          <p className="formpTag">
            Designation:{" "}
            <u style={{ textUnderlineOffset: "2px" }}>
              {reportData?.user?.designation}
            </u>
          </p>
          <p className="formpTag">
            Department:{" "}
            <u style={{ textUnderlineOffset: "2px" }}>
              {reportData?.user?.department}
            </u>
          </p>
          <p className="formpTag">
            Amount of Advance Required:{" "}
            <u style={{ textUnderlineOffset: "2px" }}>{reportData?.amount}</u>
          </p>
          <p className="formpTag">
            Purpose for which Advance is required:{" "}
            <u style={{ textUnderlineOffset: "2px" }}>{reportData?.purpose}</u>
          </p>
        </div>
        <div className="mt-5">
          <p className="formpTag">{reportData?.user?.name}</p>
          <h5>
            <b>Signature of employee</b>
          </h5>
        </div>

        <h6 className="text-center mt-4">
          <b>
            <u style={{ textUnderlineOffset: "2px" }}>
              TO BE COMPLETED BY FINANCE SECTION, DAF
            </u>
          </b>
        </h6>
        <div>
          <p className="formpTag">1. Balance of previous advance if any:</p>
          <ol type="a">
            {type === "salary_advance" ? (
              <li>
                Salary advance:{" "}
                <u style={{ textUnderlineOffset: "2px" }}>
                  {reportData?.previous_advance?.salary_advance || "N/A"}
                </u>
              </li>
            ) : (
              ""
            )}

            <li>
              Other advance:{" "}
              <u style={{ textUnderlineOffset: "2px" }}>
                {reportData?.previous_advance?.other_advance || "N/A"}
              </u>
            </li>

            {type === "salary_advance" ? (
              <li>
                Tour Advance:{" "}
                <u style={{ textUnderlineOffset: "2px" }}>
                  {reportData?.previous_advance?.tour_advance || "N/A"}
                </u>
              </li>
            ) : (
              ""
            )}
          </ol>
          {type === "salary_advance" ? (
            <p className="formpTag">
              2. <b>NET PAY: </b>{" "}
              <u style={{ textUnderlineOffset: "2px" }}>
                {reportData?.net_pay}
              </u>
            </p>
          ) : (
            ""
          )}

          <p className="formpTag">
            {type === "salary_advance"
              ? "3. Amount recommended:"
              : "2.Amount recommended:"}{" "}
            <u style={{ textUnderlineOffset: "2px" }}>{reportData?.amount}</u>
          </p>

          {type === "salary_advance" ? (
            <p className="formpTag">
              4. Deduction per month:{" "}
              <u style={{ textUnderlineOffset: "2px" }}>
                {reportData?.detail?.deduction}
              </u>
            </p>
          ) : (
            ""
          )}

          {type === "salary_advance" ? (
            <p className="formpTag">
              {" "}
              {`to be repaid in ${reportData?.detail?.duration} installments`}:{" "}
              <u style={{ textUnderlineOffset: "2px" }}>
                {reportData?.detail?.completion_month}
              </u>
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="d-flex justify-content-end">
          <div className="form-check me-3">
            <input
              checked={reportData?.status === "dispatched" ? "checked" : ""}
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
              checked={reportData?.status === "rejected" ? "checked" : ""}
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
            <p>{reportData?.verified_by?.name}</p>
            <b>(Finance Section)</b>
          </p>
          <p className="formpTag">
            <p>{reportData?.confirmed_by?.name}</p>
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
