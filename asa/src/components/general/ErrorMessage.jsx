import React, { useState, useEffect } from "react";
import { AlertCircle, X, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ErrorMessage = ({ 
  message, 
  onClose, 
  title = "Error", 
  variant = "error",
  autoClose = false, // Default to false for errors
  showClose = true,
  className,
  details
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [autoClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const variants = {
    error: {
      bg: "bg-red-50 border-red-200",
      title: "text-red-800",
      description: "text-red-700",
      icon: AlertCircle,
      iconColor: "text-red-600",
    },
    warning: {
      bg: "bg-amber-50 border-amber-200",
      title: "text-amber-800",
      description: "text-amber-700",
      icon: AlertTriangle,
      iconColor: "text-amber-600",
    },
    info: {
      bg: "bg-blue-50 border-blue-200",
      title: "text-blue-800",
      description: "text-blue-700",
      icon: Info,
      iconColor: "text-blue-600",
    }
  };

  const currentVariant = variants[variant] || variants.error;
  const Icon = currentVariant.icon;

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 w-full max-w-md transition-all duration-300",
      isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full",
      className
    )}>
      <Alert className={cn(
        "relative overflow-hidden border shadow-lg",
        currentVariant.bg
      )}>
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-full flex-shrink-0",
            variant === "error" && "bg-red-100",
            variant === "warning" && "bg-amber-100",
            variant === "info" && "bg-blue-100"
          )}>
            <Icon className={cn("h-5 w-5", currentVariant.iconColor)} />
          </div>
          
          <div className="flex-1 min-w-0">
            <AlertTitle className={cn("font-semibold mb-1", currentVariant.title)}>
              {title}
            </AlertTitle>
            <AlertDescription className={cn("text-sm", currentVariant.description)}>
              {message}
            </AlertDescription>

            {details && (
              <>
                <Button
                  variant="link"
                  size="sm"
                  className={cn(
                    "h-auto p-0 text-xs mt-2 font-medium",
                    variant === "error" && "text-red-700 hover:text-red-800",
                    variant === "warning" && "text-amber-700 hover:text-amber-800",
                    variant === "info" && "text-blue-700 hover:text-blue-800"
                  )}
                  onClick={() => setShowDetails(!showDetails)}
                >
                  {showDetails ? "Hide Details" : "Show Details"}
                </Button>
                
                {showDetails && (
                  <div className={cn(
                    "mt-2 p-3 rounded text-xs font-mono overflow-auto max-h-32",
                    variant === "error" && "bg-red-100/50 text-red-800",
                    variant === "warning" && "bg-amber-100/50 text-amber-800",
                    variant === "info" && "bg-blue-100/50 text-blue-800"
                  )}>
                    {details}
                  </div>
                )}
              </>
            )}
          </div>

          {showClose && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex-shrink-0 h-7 w-7 p-0",
                variant === "error" && "hover:bg-red-100 hover:text-red-800",
                variant === "warning" && "hover:bg-amber-100 hover:text-amber-800",
                variant === "info" && "hover:bg-blue-100 hover:text-blue-800"
              )}
              onClick={handleClose}
              aria-label="Close"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </Alert>
    </div>
  );
};

export default ErrorMessage;
