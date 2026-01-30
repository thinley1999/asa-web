import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  XCircle, 
  Lock, 
  Mail, 
  Phone, 
  User as UserIcon,
  Shield,
  AlertCircle,
  Check
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import UserServices from "../services/UserServices";
import ResetPassword from "../general/ResetPassword";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [userResponse, permissionResponse] = await Promise.all([
        UserServices.showDetail(),
        UserServices.getUserPermission()
      ]);

      if (userResponse?.status === 200) {
        setUser(userResponse.data);
      }

      if (permissionResponse?.status === 200) {
        setUserPermissions(permissionResponse.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setErrorMessage("Failed to load profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getResourceDisplayName = (resource) => {
    const resourceMap = {
      "salary_advance": "Salary Advance",
      "tour_advance": "Tour Advance",
      "other_advance": "Other Advance",
      "dashboard": "Dashboard",
      "requested_advance": "Requested Advance",
      "report": "Reports",
      "profile": "Profile",
      "settings": "Settings"
    };
    return resourceMap[resource] || resource.replace(/_/g, ' ');
  };

  const getInitials = (user) => {
    if (!user) return "U";
    const { first_name, last_name } = user;
    const firstInitial = first_name ? first_name.charAt(0) : '';
    const lastInitial = last_name ? last_name.charAt(0) : '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const handleResetSuccess = (message) => {
    setSuccessMessage(message);
    setResetOpen(false);
  };

  const handleResetError = (error) => {
    setErrorMessage(error);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <Skeleton className="h-8 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-32 w-32 rounded-full" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Separator />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-8 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Alerts */}
      {successMessage && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 border shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage 
                    src={user?.profile_pic?.url} 
                    alt={`${user?.first_name} ${user?.last_name}`}
                  />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {getInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1">
                  {user?.grade?.position_title || "Employee"}
                </Badge>
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold">
                  {user?.first_name} {user?.middle_name} {user?.last_name}
                </h2>
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <span className="font-mono bg-muted px-2 py-1 rounded text-sm">
                    EID: {user?.username}
                  </span>
                  {user?.role && (
                    <Badge variant="secondary">
                      {user.role.name}
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-4 w-full">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Mobile Number</p>
                    <p className="text-sm text-muted-foreground">
                      +975 {user?.mobile_number}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Full Name</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.first_name} {user?.middle_name} {user?.last_name}
                    </p>
                  </div>
                </div>
              </div>

              <Dialog open={resetOpen} onOpenChange={setResetOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full gap-2">
                    <Lock className="h-4 w-4" />
                    Reset Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and set a new one. Make sure it's strong and secure.
                    </DialogDescription>
                  </DialogHeader>
                  <ResetPassword 
                    onClose={() => setResetOpen(false)}
                    onSuccess={handleResetSuccess}
                    onError={handleResetError}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Permissions Card */}
        <Card className="lg:col-span-2 border shadow-sm">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Permissions</CardTitle>
                <CardDescription>
                  Your access permissions and privileges
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {userPermissions.length === 0 ? (
              <div className="text-center py-12">
                <div className="rounded-full bg-muted p-4 inline-block mb-4">
                  <Shield className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Permissions Found</h3>
                <p className="text-muted-foreground">
                  You don't have any specific permissions assigned yet.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {userPermissions.map((permission, index) => (
                  <div key={index} className="space-y-3">
                    <h3 className="text-lg font-semibold text-primary">
                      {getResourceDisplayName(permission.resource)}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(permission.actions).map(([action, value], idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            {value ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-medium capitalize">
                              {action.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <Badge 
                            variant={value ? "default" : "secondary"}
                            className={value ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                          >
                            {value ? "Allowed" : "Denied"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    {index < userPermissions.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            )}

            {/* Summary Badges */}
            {userPermissions.length > 0 && (
              <div className="mt-8 pt-6 border-t">
                <h4 className="text-sm font-medium mb-3">Summary</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {Object.values(userPermissions).flatMap(p => 
                      Object.values(p.actions).filter(v => v)
                    ).length} Allowed
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <XCircle className="h-3 w-3" />
                    {Object.values(userPermissions).flatMap(p => 
                      Object.values(p.actions).filter(v => !v)
                    ).length} Denied
                  </Badge>
                  <Badge variant="outline">
                    {userPermissions.length} Resource(s)
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
