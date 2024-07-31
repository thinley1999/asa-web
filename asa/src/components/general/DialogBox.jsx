import React, { useState, useEffect } from "react";
import { PiWarningDiamondFill } from "react-icons/pi";

const DialogBox = ({
  isOpen,
  onClose,
  onSubmit,
  preFilledMessage,
  actionMessage,
}) => {
  let finalMessage = "";
  if (actionMessage === "Approve" && preFilledMessage == "approved") {
    finalMessage = "Verified for approval.";
  } else if (actionMessage === "Confirm" && preFilledMessage == "approved") {
    finalMessage = "Approved/Confirmed.";
  } else if (
    actionMessage === "Dispatch Fund" &&
    preFilledMessage == "approved"
  ) {
    finalMessage = "Disbursement of payment.";
  } else {
    finalMessage = "Rejected.";
  }

  const [name, setName] = useState(finalMessage);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name);
    setName("");
  };

  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: "block" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content customdialog">
          <div className="modal-header">
            <span>
              <PiWarningDiamondFill fontSize={30} color="#ffc800" />
            </span>{" "}
            <h5 className="modal-title ms-3">Confirmation</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-2">
              <label htmlFor="name" className="form-label">
                Enter Remark!
              </label>
              <textarea
                id="name"
                className="form-control"
                value={name}
                rows={5}
                onChange={(e) => setName(e.target.value)}
              ></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
