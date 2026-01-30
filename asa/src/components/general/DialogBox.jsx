import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DialogBox = ({
  isOpen,
  onClose,
  onSubmit,
  preFilledMessage,
  actionMessage,
}) => {
  const getDefaultMessage = () => {
    if (actionMessage === "Approve" && preFilledMessage === "approved") {
      return "Verified for approval.";
    } else if (actionMessage === "Confirm" && preFilledMessage === "approved") {
      return "Approved/Confirmed.";
    } else if (actionMessage === "Dispatch Fund" && preFilledMessage === "approved") {
      return "Disbursement of payment.";
    } else {
      return "Rejected.";
    }
  };

  const [remark, setRemark] = useState(getDefaultMessage());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset remark when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setRemark(getDefaultMessage());
      setIsSubmitting(false);
    }
  }, [isOpen, preFilledMessage, actionMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!remark.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(remark);
      setRemark("");
    } catch (error) {
      // Error handling is done in the parent component via toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  const getDialogTitle = () => {
    if (preFilledMessage === "approved") {
      return `Confirm ${actionMessage}`;
    } else {
      return "Confirm Rejection";
    }
  };

  const getDialogDescription = () => {
    if (preFilledMessage === "approved") {
      return `You are about to ${actionMessage.toLowerCase()} this advance request. Please add a remark below.`;
    } else {
      return "You are about to reject this advance request. Please add a remark explaining the reason.";
    }
  };

  const getButtonVariant = () => {
    if (preFilledMessage === "approved") {
      return "default";
    } else {
      return "destructive";
    }
  };

  const getButtonText = () => {
    if (isSubmitting) {
      return "Processing...";
    }
    return preFilledMessage === "approved" ? actionMessage : "Reject";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <DialogTitle className="text-lg">{getDialogTitle()}</DialogTitle>
          </div>
          <DialogDescription>
            {getDialogDescription()}
          </DialogDescription>
        </DialogHeader>

        <Alert variant={preFilledMessage === "approved" ? "default" : "destructive"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {preFilledMessage === "approved" 
              ? "This action will update the advance status and notify the applicant."
              : "This action cannot be undone. The applicant will be notified of the rejection."
            }
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="remark">
              Remark {preFilledMessage === "approved" ? "(Optional)" : "(Required)"}
            </Label>
            <Textarea
              id="remark"
              placeholder="Enter your remark here..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[100px] resize-y"
              required={preFilledMessage !== "approved"}
            />
            <p className="text-xs text-muted-foreground">
              Press Ctrl/Cmd + Enter to submit
            </p>
          </div>

          <DialogFooter className="mt-6 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={getButtonVariant()}
              onClick={handleSubmit}
              disabled={isSubmitting || (preFilledMessage !== "approved" && !remark.trim())}
            >
              {getButtonText()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogBox;
