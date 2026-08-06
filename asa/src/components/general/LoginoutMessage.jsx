import React, { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const LoginSuccess = ({ message, onClose }) => {
  const [show, setShow] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto dismiss after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setShow(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 w-full max-w-md transition-all duration-300 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <Alert className="border-green-200 bg-green-50 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <AlertTitle className="text-green-800 font-semibold">
              Success
            </AlertTitle>
            <AlertDescription className="text-green-700">
              {message}
            </AlertDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 h-6 w-6 p-0 hover:bg-green-100"
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="h-3 w-3 text-green-600" />
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default LoginSuccess;
