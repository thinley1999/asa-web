import React, { useState, useEffect } from "react";
import zxcvbn from "zxcvbn";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Lock, Shield, Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import UserServices from "../services/UserServices";
import { useToast } from "@/hooks/use-toast";

const UserForm = ({ user, roles, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    role_id: "",
    department: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        password: "",
        password_confirmation: "",
        role_id: user.role?.id?.toString() || "",
        department: user.department || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Check password strength when password changes
    if (name === "password") {
      setPasswordStrength(zxcvbn(value).score);
    }
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = "Username is required";
    }
    
    if (!formData.role_id) {
      newErrors.role_id = "Role is required";
    }
    
    if (!user) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      } else if (passwordStrength < 3) {
        newErrors.password = "Please choose a stronger password (Good or Strong)";
      }
      
      if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = "Passwords do not match";
      }
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
      const submitData = { ...formData };
      
      // Remove password fields if editing and not changing password
      if (user && !submitData.password) {
        delete submitData.password;
        delete submitData.password_confirmation;
      }
      
      if (user) {
        await UserServices.updateUser(user.id, submitData);
      } else {
        await UserServices.createUser(submitData);
      }
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.errors?.join(", ") || "Failed to save user",
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
    return formData.password.length >= 6 && passwordStrength >= 3;
  };

  const passwordRequirements = [
    { label: "At least 6 characters", met: formData.password.length >= 6 },
    { label: "Contains lowercase letter", met: /[a-z]/.test(formData.password) },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
    { label: "Contains number", met: /\d/.test(formData.password) },
    { label: "Contains special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) },
  ];

  const metRequirements = passwordRequirements.filter((req) => req.met).length;

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="p-0">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {!user && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={errors.password ? "border-red-500 pr-10" : "pr-10"}
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
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
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
                  
                  {errors.password && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password_confirmation">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password_confirmation"
                      name="password_confirmation"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={errors.password_confirmation ? "border-red-500 pr-10" : "pr-10"}
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
                  {errors.password_confirmation && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.password_confirmation}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Strength Warning */}
              {formData.password && !isPasswordValid() && (
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-700 text-sm">
                    Please create a stronger password (Good or Strong) before submitting.
                  </AlertDescription>
                </Alert>
              )}

              {/* Success Message when password is valid */}
              {formData.password && isPasswordValid() && (
                <Alert className="bg-green-50 border-green-200">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700 text-sm">
                    Password meets security requirements.
                  </AlertDescription>
                </Alert>
              )}

              {/* Security Tips */}
              <Alert className="bg-blue-50 border-blue-200">
                <Lock className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700 text-sm">
                  <strong>Security Tips:</strong> Use a mix of letters, numbers, and
                  symbols. Avoid common words and personal information.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role_id" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Role <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.role_id}
                onValueChange={(value) => handleSelectChange("role_id", value)}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.role_id ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                      {role.role_type && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({role.role_type})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role_id && (
                <p className="text-sm text-red-500">{errors.role_id}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                placeholder="Enter department"
                value={formData.department}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>
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
          disabled={isLoading || (!user && !isPasswordValid())}
          className="gap-2"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Saving...
            </>
          ) : (
            user ? "Update User" : "Create User"
          )}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
