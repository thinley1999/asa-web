import React, { useState } from "react";
import zxcvbn from "zxcvbn";

const ResetPassword = ({ isOpen, onClose, onSubmit }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  if (!isOpen) return null;

  const validateForm = () => {
    let errors = {};

    if (!oldPassword.trim()) {
      errors.oldPassword = "Old Password is required.";
    }

    if (!newPassword.trim()) {
      errors.newPassword = "New Password is required.";
    } else if (newPassword.length <= 5) {
      errors.newPassword = "New Password must be greater than 5 characters.";
    } else if (passwordStrength < 3) {
      errors.newPassword = "Password is not strong enough.";
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Confirm Password is required.";
    }

    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        current_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setFormErrors({});
      setPasswordStrength(0);
    }
  };

  const handleChange = (field, value) => {
    const newErrors = { ...formErrors };
    if (value.trim()) {
      delete newErrors[field];
    }
    setFormErrors(newErrors);

    if (field === "oldPassword") {
      setOldPassword(value);
    } else if (field === "newPassword") {
      setNewPassword(value);
      setPasswordStrength(zxcvbn(value).score);
    } else if (field === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const getStrengthColor = () => {
    const colors = ["#d9534f", "#f0ad4e", "#5bc0de", "#5cb85c", "#0275d8"];
    return colors[passwordStrength] || "#d9534f";
  };

  const getPasswordStrengthMessage = () => {
    const messages = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    return messages[passwordStrength] || "";
  };

  return (
    <div className="modal fade show" tabIndex="-1" style={{ display: "block" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Reset Password</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label">Old Password</label>
                <input
                  className="form-control"
                  type="password"
                  name="oldPassword"
                  value={oldPassword}
                  onChange={(e) => handleChange("oldPassword", e.target.value)}
                />
                {formErrors.oldPassword && (
                  <div className="text-danger">{formErrors.oldPassword}</div>
                )}
              </div>
              <div className="mt-3">
                <label className="form-label">New Password</label>
                <input
                  className="form-control"
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => handleChange("newPassword", e.target.value)}
                />
                {formErrors.newPassword && (
                  <div className="text-danger">{formErrors.newPassword}</div>
                )}

                {newPassword.length > 0 && (
                  <>
                    <div
                      className="d-flex justify-content-between mt-2"
                      style={{ fontSize: "0.9rem" }}
                    >
                      <span>Password Strength</span>
                      <span
                        className={`text-${
                          passwordStrength >= 3 ? "success" : "danger"
                        }`}
                      >
                        {getPasswordStrengthMessage()}
                      </span>
                    </div>

                    <div className="progress mt-2" style={{ height: "8px" }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${(passwordStrength + 1) * 20}%`,
                          backgroundColor: getStrengthColor(),
                        }}
                      ></div>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-3">
                <label className="form-label">Confirm Password</label>
                <input
                  className="form-control"
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                />
                {formErrors.confirmPassword && (
                  <div className="text-danger">
                    {formErrors.confirmPassword}
                  </div>
                )}
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
                  type="submit"
                  className="btn btn-primary"
                  disabled={passwordStrength < 3}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
