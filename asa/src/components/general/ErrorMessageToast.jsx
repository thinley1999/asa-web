import React, { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const ErrorMessageToast = ({ message, onClose, autoDismiss = true }) => {
  const [show, setShow] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        handleClose();
      }, 7000); // Error messages stay longer (7 seconds)

      return () => clearTimeout(timer);
    }
  }, [autoDismiss]);

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
      className={`fixed top-20 right-4 z-50 w-full max-w-md transition-all duration-300 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <Alert variant="destructive" className="shadow-lg bg-red-500 text-white border-red-500">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <AlertTitle className="font-semibold">Error</AlertTitle>
            <AlertDescription className="text-sm">
              {message}
            </AlertDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0 h-6 w-6 p-0 hover:bg-red-100 hover:text-red-900"
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default ErrorMessageToast;
