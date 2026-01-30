import React from "react";
import { FileText, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const UserUndertaking = ({ user, open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-hidden border-t-4 border-t-primary">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">
                System Usage Agreement
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Please review and accept the terms below
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info Header */}
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {user?.first_name} {user?.middle_name} {user?.last_name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="font-mono">
                    EID: {user?.username}
                  </Badge>
                  <Badge variant="outline">
                    {user?.grade?.position_title || "Employee"}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Agreement Content */}
          <ScrollArea className="h-[350px] pr-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-lg text-primary">
                  Undertaking of Responsibilities for Online System User
                </h4>
                <p className="text-muted-foreground">
                  I,{" "}
                  <span className="font-bold text-foreground">
                    {user?.first_name} {user?.middle_name} {user?.last_name}
                  </span>{" "}
                  hereby acknowledge and agree to the following terms and
                  conditions regarding my use of the{" "}
                  <span className="font-bold text-foreground">
                    Advance Submission and Approval System:
                  </span>
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Confidentiality",
                    description:
                      "I will keep my login credentials confidential and will not share them with anyone. I understand that sharing my credentials may lead to unauthorized access to my account.",
                  },
                  {
                    title: "Compliance",
                    description:
                      "I will adhere to all organizational policies and procedures related to the use of the System, including travel and expense guidelines.",
                  },
                  {
                    title: "Accurate Information",
                    description:
                      "I will ensure that all information I provide in the System is accurate and complete to the best of my knowledge.",
                  },
                  {
                    title: "Responsibility",
                    description:
                      "I understand that I am responsible for any actions taken under my account and will promptly report any unauthorized use or security breaches to the appropriate authority.",
                  },
                  {
                    title: "Training and Support",
                    description:
                      "I will participate in any training sessions provided for the System and will seek help when needed to ensure effective usage.",
                  },
                  {
                    title: "Feedback",
                    description:
                      "I agree to provide constructive feedback regarding my experience with the System to help improve its functionality and user experience.",
                  },
                  {
                    title: "Data Protection",
                    description:
                      "I understand the importance of protecting sensitive information and will ensure that I follow data protection guidelines while using the System.",
                  },
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-base flex items-center gap-2">
                          {item.title}
                        </h5>
                        <p className="text-muted-foreground text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Confirmation Section */}
              <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-base mb-1">
                      Acknowledgement
                    </h5>
                    <p className="text-sm">
                      By accepting below, I acknowledge that I have read,
                      understood, and agree to abide by the terms outlined in
                      this undertaking.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Agreement Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">7</div>
              <div className="text-xs text-muted-foreground">Clauses</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">✓</div>
              <div className="text-xs text-muted-foreground">Read</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">!</div>
              <div className="text-xs text-muted-foreground">Required</div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Last Updated:</span>{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onClose} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Accept & Continue
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserUndertaking;