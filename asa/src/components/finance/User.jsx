import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import {
  Search,
  Filter,
  Eye,
  Edit,
  MoreHorizontal,
  User,
  UserPlus,
  Mail,
  Calendar,
  Shield,
  RefreshCw,
  Key,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import UserServices from "../services/UserServices";
import UserForm from "../general/UserForm";
import UserView from "../general/UserView";
import UserResetPassword from "../general/UserResetPassword";
import { usePermissions } from "@/contexts/PermissionsContext";
import Unauthorized from "@/components/general/Unauthorized";

const Users = () => {
  const [users, setUsers] = useState([]);
  const { permissions, isLoading: permissionsLoading } = usePermissions();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [roles, setRoles] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { toast } = useToast();

  const usersPerm = permissions?.find(
    (permission) => permission.resource === "users"
  );

  const canViewUsers = usersPerm?.actions?.view === true;

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await UserServices.getUsers({
        search_query: searchQuery,
        role_id: selectedRole,
        department: selectedDepartment,
        page: page,
        per_page: rowsPerPage,
      });
      setUsers(response.data.users);
      setTotalPages(response.data.pagy.pages);
      setTotalRecords(response.data.pagy.count);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage, searchQuery, selectedRole, selectedDepartment, toast]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await UserServices.getRoles();
      setRoles(response.data.roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      setSearchQuery(searchTerm);
      setPage(1);
    }
  };

  const handleSearchButtonClick = () => {
    setSearchQuery(searchTerm);
    setPage(1);
  };

  const handleRoleFilter = (value) => {
    setSelectedRole(value);
    setPage(1);
  };

  const handleDepartmentFilter = (value) => {
    setSelectedDepartment(value);
    setPage(1);
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setPage(1);
  };

  const resetFilters = () => {
    setSelectedRole("");
    setSelectedDepartment("");
    setSearchTerm("");
    setSearchQuery("");
    setPage(1);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewDialog(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handleResetPassword = (user) => {
    setSelectedUser(user);
    setShowResetPasswordDialog(true);
  };

  const handleUserCreated = () => {
    setShowCreateDialog(false);
    fetchUsers();
    toast({
      title: "Success",
      description: "User created successfully.",
    });
  };

  const handleUserUpdated = () => {
    setShowEditDialog(false);
    fetchUsers();
    toast({
      title: "Success",
      description: "User updated successfully.",
    });
  };

  const handlePasswordReset = () => {
    setShowResetPasswordDialog(false);
    fetchUsers();
    toast({
      title: "Success",
      description: "Password reset successfully.",
    });
  };

  const getStatusBadge = (user) => {
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
          <XCircle className="h-3 w-3" />
          Pending
        </Badge>
      );
    }
  };

  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!canViewUsers && !permissionsLoading) {
    return <Unauthorized />;
  }

  const SkeletonRow = () => (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-28" />
      </TableCell>
      <TableCell>
        <div className="flex justify-end gap-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-8" />
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6 p-2">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage all users, their roles and permissions
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="gap-2"
                onClick={() => setShowCreateDialog(true)}
              >
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
              <div className="relative w-full sm:w-64">
                <Input
                  placeholder="Search by username or email"
                  className="pl-9 pr-8"
                  value={searchTerm}
                  onChange={handleSearchInput}
                  onKeyDown={handleSearchSubmit}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                  onClick={handleSearchButtonClick}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" className="gap-2">
      <Filter className="h-4 w-4" />
      Filters
      {selectedRole && (
        <Badge variant="secondary" className="ml-1">
          1
        </Badge>
      )}
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-80 p-4">
    <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
    <DropdownMenuSeparator />

    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Role</h4>
        <Select
          value={selectedRole || "all"}
          onValueChange={(value) => handleRoleFilter(value === "all" ? "" : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id.toString()}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={resetFilters}
        >
          <RefreshCw className="h-3 w-3 mr-2" />
          Reset Filters
        </Button>
      </div>
    </div>
  </DropdownMenuContent>
</DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[250px]">User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <SkeletonRow key={index} />
                  ))
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <User className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">No users found</h3>
                        <p className="text-sm text-muted-foreground">
                          {searchQuery || selectedRole || selectedDepartment
                            ? "Try adjusting your search or filters"
                            : "No users have been created yet"}
                        </p>
                        {(searchQuery || selectedRole || selectedDepartment) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-4"
                            onClick={resetFilters}
                          >
                            Reset Filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <Shield className="h-3 w-3" />
                          {user.role?.name || "No Role"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {user.department || "N/A"}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(user)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(user.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => handleViewUser(user)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                                  <Key className="mr-2 h-4 w-4" />
                                  Reset Password
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {users.length > 0 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Rows per page:
                  </span>
                  <Select
                    value={rowsPerPage.toString()}
                    onValueChange={handleRowsPerPageChange}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={rowsPerPage} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[10, 20, 30, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={pageSize.toString()}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-sm text-muted-foreground">
                  {totalRecords} total users
                </span>
              </div>

              <Pagination>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center gap-1 px-4 text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system. Fill in all required fields.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            roles={roles}
            onSuccess={handleUserCreated}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and role assignment.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            user={selectedUser}
            roles={roles}
            onSuccess={handleUserUpdated}
            onCancel={() => setShowEditDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View User Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete user information and permissions.
            </DialogDescription>
          </DialogHeader>
          <UserView user={selectedUser} onClose={() => setShowViewDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={showResetPasswordDialog} onOpenChange={setShowResetPasswordDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset User Password</DialogTitle>
            <DialogDescription>
              Reset password for user <strong>{selectedUser?.username}</strong>
            </DialogDescription>
          </DialogHeader>
          <UserResetPassword
            user={selectedUser}
            onSuccess={handlePasswordReset}
            onCancel={() => setShowResetPasswordDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
