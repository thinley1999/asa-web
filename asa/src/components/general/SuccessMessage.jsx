import React, { useState, useEffect } from "react";
import { CheckCircle, X, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SuccessMessage = ({ 
  message, 
  onClose, 
  title = "Success", 
  variant = "success",
  showClose = true,
  className 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000); // Auto close after 500ms

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const variants = {
    success: {
      bg: "bg-green-50 border-green-200",
      title: "text-green-800",
      description: "text-green-700",
      icon: CheckCircle,
      iconColor: "text-green-600",
    },
    info: {
      bg: "bg-blue-50 border-blue-200",
      title: "text-blue-800",
      description: "text-blue-700",
      icon: Info,
      iconColor: "text-blue-600",
    },
    warning: {
      bg: "bg-amber-50 border-amber-200",
      title: "text-amber-800",
      description: "text-amber-700",
      icon: AlertCircle,
      iconColor: "text-amber-600",
    }
  };

  const currentVariant = variants[variant] || variants.success;
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
            variant === "success" && "bg-green-100",
            variant === "info" && "bg-blue-100",
            variant === "warning" && "bg-amber-100"
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
          </div>

          {showClose && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex-shrink-0 h-7 w-7 p-0",
                variant === "success" && "hover:bg-green-100 hover:text-green-800",
                variant === "info" && "hover:bg-blue-100 hover:text-blue-800",
                variant === "warning" && "hover:bg-amber-100 hover:text-amber-800"
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

export default SuccessMessage;
