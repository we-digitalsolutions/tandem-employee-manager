
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { employeesData } from '@/data/mockData';
import { Employee } from '@/types';
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { Search, MoreHorizontal, Eye, EyeOff, Edit, Key, UserRound, Lock, Copy } from 'lucide-react';

import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const UserManagement = () => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<Employee[]>(employeesData.map(emp => ({
    ...emp,
    password: 'password123', // Default password for demo
    role: emp.position.includes('Manager') ? 'manager' : 'employee'
  })));
  
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isViewUserDialogOpen, setIsViewUserDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const filteredUsers = users.filter(user => 
    user.firstName.toLowerCase().includes(search.toLowerCase()) ||
    user.lastName.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase()) ||
    user.department.toLowerCase().includes(search.toLowerCase()) ||
    user.position.toLowerCase().includes(search.toLowerCase())
  );

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const length = 10;
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return password;
  };

  const handleResetPassword = () => {
    if (!selectedUser) return;
    
    const newGeneratedPassword = generatePassword();
    setNewPassword(newGeneratedPassword);
    setShowNewPassword(true);
    
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, password: newGeneratedPassword } 
        : user
    );
    
    setUsers(updatedUsers);
    
    toast.success("Password has been reset successfully");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  // Schema for user role form
  const userRoleSchema = z.object({
    role: z.enum(['admin', 'manager', 'employee'], {
      required_error: "Please select a role",
    }),
  });

  const roleForm = useForm({
    resolver: zodResolver(userRoleSchema),
    defaultValues: {
      role: selectedUser?.role as 'admin' | 'manager' | 'employee' || 'employee',
    },
  });

  React.useEffect(() => {
    if (selectedUser && selectedUser.role) {
      roleForm.reset({
        role: selectedUser.role,
      });
    }
  }, [selectedUser, roleForm]);

  const onRoleSubmit = (data: { role: 'admin' | 'manager' | 'employee' }) => {
    if (!selectedUser) return;
    
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id 
        ? { ...user, role: data.role } 
        : user
    );
    
    setUsers(updatedUsers);
    setIsEditUserDialogOpen(false);
    toast.success(`Role updated for ${selectedUser.firstName} ${selectedUser.lastName}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user access and permissions</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Users</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                id="user-search-field"
                placeholder="Search users..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email (Login)</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-hr-navy text-white font-medium">
                              {user.firstName[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-gray-500">{user.position}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <RoleBadge role={user.role || 'employee'} />
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>
                    <TableCell>
                      <UserActions
                        user={user}
                        onView={() => {
                          setSelectedUser(user);
                          setIsViewUserDialogOpen(true);
                          setShowPassword(false);
                        }}
                        onEdit={() => {
                          setSelectedUser(user);
                          setIsEditUserDialogOpen(true);
                        }}
                        onResetPassword={() => {
                          setSelectedUser(user);
                          setNewPassword(null);
                          setIsResetPasswordDialogOpen(true);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={isViewUserDialogOpen} onOpenChange={setIsViewUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                  {selectedUser.avatar ? (
                    <img
                      src={selectedUser.avatar}
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <UserRound className="h-8 w-8 text-gray-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{selectedUser.firstName} {selectedUser.lastName}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.position}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email (Login)</p>
                  <p className="mt-1">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <RoleBadge role={selectedUser.role || 'employee'} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="mt-1">{selectedUser.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <StatusBadge status={selectedUser.status} />
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Password</p>
                <div className="flex items-center mt-1">
                  <div className="bg-gray-100 p-2 rounded-md flex-1 font-mono">
                    {showPassword ? selectedUser.password : '••••••••••••'}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 mr-1" />
                    ) : (
                      <Eye className="h-4 w-4 mr-1" />
                    )}
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => copyToClipboard(selectedUser.password || '')}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => {
                      setIsViewUserDialogOpen(false);
                      setIsResetPasswordDialogOpen(true);
                    }}
                  >
                    <Key className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsViewUserDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsViewUserDialogOpen(false);
                    setIsEditUserDialogOpen(true);
                  }}
                >
                  Edit User
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change user access role for {selectedUser?.firstName} {selectedUser?.lastName}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <Form {...roleForm}>
              <form onSubmit={roleForm.handleSubmit(onRoleSubmit)}>
                <div className="space-y-4">
                  <FormField
                    control={roleForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel>User Role</FormLabel>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <input
                                type="radio"
                                id="admin"
                                value="admin"
                                checked={field.value === 'admin'}
                                onChange={() => field.onChange('admin')}
                                className="peer sr-only"
                              />
                            </FormControl>
                            <label
                              htmlFor="admin"
                              className={`flex flex-1 cursor-pointer items-center justify-between rounded-md border p-3 ${
                                field.value === 'admin' ? 'border-primary bg-primary/10' : 'border-input'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="rounded-full p-1.5 bg-primary/20 text-primary">
                                  <Lock className="h-4 w-4" />
                                </div>
                                <div className="font-medium">Admin</div>
                              </div>
                              <div className="text-sm text-muted-foreground">Full access</div>
                            </label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <input
                                type="radio"
                                id="manager"
                                value="manager"
                                checked={field.value === 'manager'}
                                onChange={() => field.onChange('manager')}
                                className="peer sr-only"
                              />
                            </FormControl>
                            <label
                              htmlFor="manager"
                              className={`flex flex-1 cursor-pointer items-center justify-between rounded-md border p-3 ${
                                field.value === 'manager' ? 'border-primary bg-primary/10' : 'border-input'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="rounded-full p-1.5 bg-amber-100 text-amber-600">
                                  <UserRound className="h-4 w-4" />
                                </div>
                                <div className="font-medium">Manager</div>
                              </div>
                              <div className="text-sm text-muted-foreground">Team access</div>
                            </label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <input
                                type="radio"
                                id="employee"
                                value="employee"
                                checked={field.value === 'employee'}
                                onChange={() => field.onChange('employee')}
                                className="peer sr-only"
                              />
                            </FormControl>
                            <label
                              htmlFor="employee"
                              className={`flex flex-1 cursor-pointer items-center justify-between rounded-md border p-3 ${
                                field.value === 'employee' ? 'border-primary bg-primary/10' : 'border-input'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="rounded-full p-1.5 bg-blue-100 text-blue-600">
                                  <UserRound className="h-4 w-4" />
                                </div>
                                <div className="font-medium">Employee</div>
                              </div>
                              <div className="text-sm text-muted-foreground">Basic access</div>
                            </label>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditUserDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </div>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <AlertDialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset User Password</AlertDialogTitle>
            <AlertDialogDescription>
              This will generate a new password for {selectedUser?.firstName} {selectedUser?.lastName}.
              The new password will be shown to you once, and you should share it with the user securely.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {newPassword ? (
            <>
              <div className="my-4 p-4 bg-gray-50 rounded-md border">
                <p className="text-sm font-medium text-gray-700 mb-2">New Password:</p>
                <div className="flex items-center">
                  <div className="bg-white p-2 rounded-md flex-1 font-mono border">
                    {showNewPassword ? newPassword : '••••••••••••'}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 mr-1" />
                    ) : (
                      <Eye className="h-4 w-4 mr-1" />
                    )}
                    {showNewPassword ? "Hide" : "Show"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={() => copyToClipboard(newPassword)}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setIsResetPasswordDialogOpen(false)}>
                  Done
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          ) : (
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetPassword}>
                Reset Password
              </AlertDialogAction>
            </AlertDialogFooter>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: Employee['status'] }) => {
  const statusMap = {
    active: { label: 'Active', className: 'bg-green-100 text-green-800' },
    inactive: { label: 'Inactive', className: 'bg-red-100 text-red-800' },
    onLeave: { label: 'On Leave', className: 'bg-amber-100 text-amber-800' },
  };

  const { label, className } = statusMap[status];

  return (
    <Badge className={`${className} hover:${className}`} variant="outline">
      {label}
    </Badge>
  );
};

// Role Badge Component
const RoleBadge = ({ role }: { role: 'admin' | 'manager' | 'employee' }) => {
  const roleMap = {
    admin: { label: 'Admin', className: 'bg-purple-100 text-purple-800' },
    manager: { label: 'Manager', className: 'bg-amber-100 text-amber-800' },
    employee: { label: 'Employee', className: 'bg-blue-100 text-blue-800' },
  };

  const { label, className } = roleMap[role];

  return (
    <Badge className={`${className} hover:${className}`} variant="outline">
      {label}
    </Badge>
  );
};

// User Actions Component
const UserActions = ({ 
  user, 
  onView, 
  onEdit, 
  onResetPassword,
}: { 
  user: Employee;
  onView: () => void;
  onEdit: () => void;
  onResetPassword: () => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onView}>
          <Eye className="mr-2 h-4 w-4" /> View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" /> Edit Role
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onResetPassword}>
          <Key className="mr-2 h-4 w-4" /> Reset Password
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserManagement;
