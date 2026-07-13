import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Building,
  CheckCircle,
  XCircle,
  Key,
  Users,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

const UserView = ({ user, onClose }) => {
  if (!user) return null;

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch (error) {
      return "Invalid date";
    }
  };

  const getStatusBadge = () => {
    if (user.accepted_terms) {
      return (
        <Badge className="bg-green-100 text-green-800 border-0 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Active
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-0 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    }
  };

  const getResetPasswordBadge = () => {
    if (user.reset_password) {
      return (
        <Badge className="bg-red-100 text-red-800 border-0 flex items-center gap-1">
          <Key className="h-3 w-3" />
          Requires Reset
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-100 text-green-800 border-0 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Not Required
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* User Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{user.username}</h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="outline" className="gap-1">
                    <Shield className="h-3 w-3" />
                    {user.role?.name || "No Role"}
                  </Badge>
                  {getStatusBadge()}
                  {getResetPasswordBadge()}
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
                  {user.email || "No email provided"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Department</p>
                <p className="text-sm text-muted-foreground">
                  {user.department || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Created At</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(user.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(user.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Role & Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Role Details</h4>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.role?.name || "No Role"}</p>
                    {user.role?.role_type && (
                      <p className="text-sm text-muted-foreground">
                        Type: {user.role.role_type}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline">
                    {user.role?.users_count || 0} users
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="text-sm font-medium mb-2">Permissions</h4>
              {user.permissions && user.permissions.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {user.permissions.map((permission, index) => (
                    <div
                      key={index}
                      className="bg-muted/50 rounded-lg p-3"
                    >
                      <p className="text-sm font-medium capitalize">
                        {permission.resource}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(permission.actions || {}).map(([action, enabled]) => (
                          enabled && (
                            <Badge key={action} variant="outline" className="text-xs">
                              {action}
                            </Badge>
                          )
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No permissions assigned
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserView;
