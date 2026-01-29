import React, { useState, useEffect } from "react";
import vectorImage from "../assets/img/vector.jpg";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/img/rma-logo-white.png";
import "../assets/css/main.css";
import AuthServices from "./services/AuthServices";
import LoginoutMessage from "./general/LoginoutMessage";
import ErrorMessageToast from "./general/ErrorMessageToast";

// Import shadcn/ui components
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Loader2, Lock, User } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";

const Login = () => {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmployeeId, setForgotEmployeeId] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedOut = localStorage.getItem("isLoggedOut");
    if (isLoggedOut) {
      setIsLoggedOut(true);
      localStorage.removeItem("isLoggedOut");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await AuthServices.login(username, password);

      if (response && response.status === 200) {
        const token = response.headers.authorization;
        const user = response.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("id", user.id);
        navigate("/dashboard");
      } else {
        setError("Internal Server Issue");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmployeeId.trim()) {
      setForgotPasswordMessage("Please enter your Employee ID");
      return;
    }

    setIsForgotPasswordLoading(true);
    setForgotPasswordMessage("");

    try {
      const response = await AuthServices.forgotPassword(forgotEmployeeId);
      if (response.status === 200) {
        setForgotPasswordMessage("Password reset instructions sent to your email.");
        setTimeout(() => closeModal(), 2000);
      } else {
        setForgotPasswordMessage("Unable to send reset instructions.");
      }
    } catch (err) {
      setForgotPasswordMessage(
        err.response?.data?.error || "Error occurred while requesting password reset."
      );
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  const closeModal = () => {
    setShowForgotPassword(false);
    setForgotEmployeeId("");
    setForgotPasswordMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {isLoggedOut && <LoginoutMessage message="Logout Successful!!!" />}
      {error && <ErrorMessageToast message={error} />}

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogDescription>
              Enter your Employee ID to receive password reset instructions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                placeholder="Enter your Employee ID"
                value={forgotEmployeeId}
                onChange={(e) => setForgotEmployeeId(e.target.value)}
                disabled={isForgotPasswordLoading}
              />
            </div>
            
            {forgotPasswordMessage && (
              <Alert variant={forgotPasswordMessage.includes("sent") ? "default" : "destructive"}>
                <AlertDescription>
                  {forgotPasswordMessage}
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeModal}
              disabled={isForgotPasswordLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleForgotPassword}
              disabled={isForgotPasswordLoading || !forgotEmployeeId.trim()}
            >
              {isForgotPasswordLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isForgotPasswordLoading ? "Sending..." : "Send Instructions"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-4rem)]">
          {/* Image Section */}
          <div className="hidden lg:block rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={vectorImage}
              alt="Login"
              className="w-full h-[85vh] object-cover"
            />
          </div>

          {/* Login Form Section */}
          <div className="flex flex-col items-center justify-center">
            <Card className="w-full max-w-md shadow-xl border-0">
              <CardHeader className="space-y-1 text-center">
                <div className="flex justify-center mb-4">
                  <img
                    src={logoImage}
                    alt="Company Logo"
                    className="h-16"
                  />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-gray-500 dark:text-gray-400">
                  Login to your account
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-4">
                    {/* Employee ID Input */}
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium">
                        Employee ID
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="username"
                          type="text"
                          placeholder="Enter your Employee ID"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          disabled={isLoading}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => setShowForgotPassword(true)}
                      disabled={isLoading}
                    >
                      Forgot your password?
                    </Button>
                  </div>

                  {/* Login Button */}
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading || !username.trim() || !password.trim()}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

                {/* Error Message Display */}
                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-gray-500">
                      Secure Login
                    </span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="text-center text-sm text-gray-500">
                  <p>
                    Contact IT support if you encounter any issues
                    <br />
                    logging into your account.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Footer Note */}
            <p className="mt-8 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Full-page Loader */}
      {(isLoading || isForgotPasswordLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
            <p className="text-white font-medium">
              {isForgotPasswordLoading ? "Processing your request..." : "Signing in..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
