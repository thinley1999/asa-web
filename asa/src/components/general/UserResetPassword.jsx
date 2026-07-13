import React, { useState } from "react";
import zxcvbn from "zxcvbn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Key, Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import UserServices from "../services/UserServices";
import { useToast } from "@/hooks/use-toast";

const UserResetPassword = ({ user, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    new_password: "",
    new_password_confirmation: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "new_password") {
      setPasswordStrength(zxcvbn(value).score);
    }
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.new_password) {
      newErrors.new_password = "Password is required";
    } else if (formData.new_password.length < 6) {
      newErrors.new_password = "Password must be at least 6 characters";
    } else if (passwordStrength < 3) {
      newErrors.new_password = "Please choose a stronger password (Good or Strong)";
    }
    
    if (!formData.new_password_confirmation) {
      newErrors.new_password_confirmation = "Please confirm your password";
    } else if (formData.new_password !== formData.new_password_confirmation) {
      newErrors.new_password_confirmation = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await UserServices.updateUser(user.id, {
        password: formData.new_password,
        password_confirmation: formData.new_password_confirmation,
        reset_password: true,
      });
      
      toast({
        title: "Success",
        description: "Password reset successfully. User will be prompted to change password on next login.",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.errors?.join(", ") || "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    const colors = {
      0: "#ef4444", // Very Weak
      1: "#f97316", // Weak
      2: "#eab308", // Fair
      3: "#22c55e", // Good
      4: "#15803d", // Strong
    };
    return colors[passwordStrength];
  };

  const getStrengthLabel = () => {
    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    return labels[passwordStrength];
  };

  const getStrengthMessage = () => {
    const messages = {
      0: "Too weak - Add more characters, numbers, and symbols",
      1: "Weak - Consider adding more complexity",
      2: "Fair - Could be stronger",
      3: "Good - Strong password",
      4: "Strong - Excellent password security",
    };
    return messages[passwordStrength];
  };

  const isPasswordValid = () => {
    return formData.new_password.length >= 6 && passwordStrength >= 3;
  };

  const passwordRequirements = [
    { label: "At least 6 characters", met: formData.new_password.length >= 6 },
    { label: "Contains lowercase letter", met: /[a-z]/.test(formData.new_password) },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(formData.new_password) },
    { label: "Contains number", met: /\d/.test(formData.new_password) },
    { label: "Contains special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.new_password) },
  ];

  const metRequirements = passwordRequirements.filter((req) => req.met).length;

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="p-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new_password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              New Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="new_password"
                name="new_password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={formData.new_password}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.new_password ? "border-red-500 pr-10" : "pr-10"}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {formData && (
              <div className="space-y-2 mt-2">
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
            
            {errors.new_password && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.new_password}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new_password_confirmation" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Confirm New Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="new_password_confirmation"
                name="new_password_confirmation"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={formData.new_password_confirmation}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.new_password_confirmation ? "border-red-500 pr-10" : "pr-10"}
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
            {errors.new_password_confirmation && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.new_password_confirmation}
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

          {formData.new_password && !isPasswordValid() && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700 text-sm">
                Please create a stronger password (Good or Strong) before submitting.
              </AlertDescription>
            </Alert>
          )}

          {formData.new_password && isPasswordValid() && (
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700 text-sm">
                Password meets security requirements. You can proceed with reset.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !isPasswordValid()}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Resetting...
            </>
          ) : (
            <>
              <Key className="h-4 w-4" />
              Reset Password
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default UserResetPassword;
