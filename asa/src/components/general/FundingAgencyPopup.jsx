// src/components/FundingAgencyPopup.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FundingAgencyServices from "../services/FundingAgencyServices";

const FundingAgencyPopup = ({ isOpen, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    is_active: true,
  });
  const [errors, setErrors] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        code: "",
        is_active: true,
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Agency name is required";
    }
    if (!formData.code.trim()) {
      newErrors.code = "Agency code is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await FundingAgencyServices.createFundingAgency(formData);
      if (response && response.success) {
        toast({
          title: "Success",
          description: "Funding agency created successfully",
          variant: "default",
        });
        onSave(response.data);
        onClose();
      } else {
        throw new Error("Failed to create funding agency");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create funding agency",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add External Funding Agency</DialogTitle>
          <DialogDescription>
            Enter the details of the new funding agency
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Agency Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-1">
              Agency Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter agency name"
              className={errors.name ? "border-red-500" : ""}
              disabled={loading}
            />
            {errors.name && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Agency Code */}
          <div className="space-y-2">
            <Label htmlFor="code" className="flex items-center gap-1">
              Agency Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter agency code (e.g., WB, UNDP)"
              className={errors.code ? "border-red-500" : ""}
              disabled={loading}
            />
            {errors.code && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.code}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Add Agency
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FundingAgencyPopup;
