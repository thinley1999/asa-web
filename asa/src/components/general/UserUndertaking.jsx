import React from "react"
import { CgLoadbarDoc } from "react-icons/cg";

const UserUndertaking = ({user, onClose}) => {
  console.log("user.....", user)
  return (
    <div className="modal fade show" tabIndex="-10" style={{ display: "block" }}>
      <div className="modal-dialog modal-xl modal-dialog-centered">
        <div className="modal-content p-3" style={{ borderTop: "8px solid #0d6efd" }}>
          <div className="modal-header">
            <div className="d-flex align-items-center gap-2">
               <CgLoadbarDoc fontSize={38} color="#0d6efd"/>
               <h5 className="modal-title">Undertaking of Responsibilities for Online System User</h5>
            </div>
          </div>
          <div className="modal-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
            <p>
            I, <strong>{user?.first_name} {user?.middle_name} {user?.last_name}</strong> hereby acknowledge and agree to the following terms and conditions regarding my use of an <strong>Advance Submission and Approval System:</strong>
            </p>
            <ol className="ms-3 ps-3">
              <li className="mb-3"><strong>Confidentiality:</strong> I will keep my login credentials confidential and will not share them with anyone. I understand that sharing my credentials may lead to unauthorized access to my account.</li>
              <li className="mb-3"><strong>Compliance:</strong> I will adhere to all organizational policies and procedures related to the use of the System, including travel and expense guidelines.</li>
              <li className="mb-3"><strong>Accurate Information:</strong> I will ensure that all information I provide in the System is accurate and complete to the best of my knowledge.</li>
              <li className="mb-3"><strong>Responsibility:</strong> I understand that I am responsible for any actions taken under my account and will promptly report any unauthorized use or security breaches to the appropriate authority.</li>
              <li className="mb-3"><strong>Training and Support:</strong> I will participate in any training sessions provided for the System and will seek help when needed to ensure effective usage.</li>
              <li className="mb-3"><strong>Feedback:</strong> I agree to provide constructive feedback regarding my experience with the System to help improve its functionality and user experience.</li>
              <li className="mb-3"><strong>Data Protection:</strong> I understand the importance of protecting sensitive information and will ensure that I follow data protection guidelines while using the System.</li>
            </ol>

            <p className="mt-3">
              By accepting below, I acknowledge that I have read, understood, and agree to abide by the terms outlined in this undertaking.
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Accept & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserUndertaking
