import React, { useState } from "react";
import zxcvbn from "zxcvbn";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, Eye, EyeOff, Lock, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import UserServices from "../services/UserServices";

const ResetPassword = ({ onClose, onSuccess, onError }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const errors = {};

    if (!oldPassword.trim()) {
      errors.oldPassword = "Current password is required";
    }

    if (!newPassword.trim()) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    } else if (passwordStrength < 3) {
      errors.newPassword = "Please choose a stronger password";
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const passwords = {
        current_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      };

      const response = await UserServices.resetpassword(passwords);

      if (response?.status === 200) {
        const message = response.data.message || "Password reset successfully!";
        onSuccess(message);
        resetForm();
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.message ||
        "Failed to reset password. Please try again.";
      onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setFormErrors({});
    setPasswordStrength(0);
  };

  const handleNewPasswordChange = (value) => {
    setNewPassword(value);
    setPasswordStrength(zxcvbn(value).score);
    if (formErrors.newPassword) {
      setFormErrors((prev) => ({ ...prev, newPassword: "" }));
    }
  };

  const getStrengthColor = () => {
    const colors = {
      0: "#ef4444", // Very Weak - red
      1: "#f97316", // Weak - orange
      2: "#eab308", // Fair - yellow
      3: "#22c55e", // Good - green
      4: "#15803d", // Strong - dark green
    };
    return colors[passwordStrength];
  };

  const getStrengthMessage = () => {
    const messages = {
      0: "Very Weak - Add more characters, numbers, and symbols",
      1: "Weak - Consider adding more complexity",
      2: "Fair - Could be stronger",
      3: "Good - Strong password",
      4: "Strong - Excellent password security",
    };
    return messages[passwordStrength];
  };

  const getStrengthLabel = () => {
    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    return labels[passwordStrength];
  };

  const passwordRequirements = [
    { label: "At least 6 characters", met: newPassword.length >= 6 },
    { label: "Contains lowercase letter", met: /[a-z]/.test(newPassword) },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(newPassword) },
    { label: "Contains number", met: /\d/.test(newPassword) },
    {
      label: "Contains special character",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    },
  ];

  const metRequirements = passwordRequirements.filter((req) => req.met).length;

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Reset Your Password
        </DialogTitle>
        <DialogDescription>
          Ensure your new password is strong and secure.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div className="space-y-2">
          <Label htmlFor="oldPassword">Current Password</Label>
          <div className="relative">
            <Input
              id="oldPassword"
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={`pr-10 ${formErrors.oldPassword ? "border-red-500" : ""}`}
              placeholder="Enter current password"
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {formErrors.oldPassword && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {formErrors.oldPassword}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-3">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => handleNewPasswordChange(e.target.value)}
              className={`pr-10 ${formErrors.newPassword ? "border-red-500" : ""}`}
              placeholder="Create new password"
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Password Requirements */}
          {newPassword && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Password Strength</span>
                <span
                  className="font-semibold"
                  style={{ color: getStrengthColor() }}
                >
                  {getStrengthLabel()}
                </span>
              </div>
              <Progress
                value={(passwordStrength + 1) * 20}
                className="h-2"
                style={{
                  backgroundColor: "hsl(var(--muted))",
                  "--progress-background": getStrengthColor(),
                }}
              />
              <p className="text-xs text-muted-foreground">
                {getStrengthMessage()}
              </p>

              {/* Requirements Checklist */}
              <div className="space-y-1 mt-3">
                <p className="text-xs font-medium">
                  Requirements ({metRequirements}/5)
                </p>
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div
                      className={`h-2 w-2 rounded-full ${req.met ? "bg-green-500" : "bg-gray-300"}`}
                    />
                    <span
                      className={
                        req.met ? "text-green-700" : "text-muted-foreground"
                      }
                    >
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formErrors.newPassword && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {formErrors.newPassword}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`pr-10 ${formErrors.confirmPassword ? "border-red-500" : ""}`}
              placeholder="Confirm new password"
              disabled={loading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {formErrors.confirmPassword && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {formErrors.confirmPassword}
            </p>
          )}
        </div>

        {/* Security Tips */}
        <Alert className="bg-blue-50 border-blue-200">
          <Lock className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700 text-sm">
            <strong>Security Tips:</strong> Use a mix of letters, numbers, and
            symbols. Avoid common words and personal information.
          </AlertDescription>
        </Alert>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetForm();
              onClose();
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || passwordStrength < 3}
            className="gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Updating...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Update Password
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ResetPassword;
