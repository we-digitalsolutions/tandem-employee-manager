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
import { Button } from "@/components/ui/button";
import { Employee, SalaryHistory } from '@/types';
import { 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  Eye, 
  Edit, 
  FileText, 
  DollarSign,
  Upload,
  Download,
  Loader2 
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { useEmployees } from '@/hooks/useEmployees';
import { useDepartments } from '@/hooks/useDepartments';
import EnhancedEmployeeForm from './EnhancedEmployeeForm';
import EmployeeDocumentManager from './EmployeeDocumentManager';
import EmployeeSalaryManager from './EmployeeSalaryManager';
import ComprehensiveEmployeeProfile from './ComprehensiveEmployeeProfile';

const EnhancedEmployeeManagement = () => {
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [isSalaryDialogOpen, setIsSalaryDialogOpen] = useState(false);
  
  const { employees, loading: employeesLoading, addEmployee, updateEmployee } = useEmployees();
  const { departments, loading: departmentsLoading } = useDepartments();

  const filteredEmployees = employees.filter(employee => 
    employee.firstName.toLowerCase().includes(search.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(search.toLowerCase()) ||
    employee.email.toLowerCase().includes(search.toLowerCase()) ||
    employee.department.toLowerCase().includes(search.toLowerCase()) ||
    employee.position.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddEmployee = async (data: any) => {
    try {
      await addEmployee(data);
      setIsAddDialogOpen(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleUpdateEmployee = async (data: any) => {
    if (!selectedEmployee) return;
    
    try {
      await updateEmployee(selectedEmployee.id, data);
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  if (employeesLoading || departmentsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading employees...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600">Comprehensive employee data, documents, and salary management</p>
        </div>
        <Button 
          className="bg-hr-teal hover:bg-hr-teal/90"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <UserPlus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Employee Directory</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                id="enhanced-employee-search-field"
                placeholder="Search employees..."
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
                <TableHead>Employee</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No employees found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                          {employee.avatar ? (
                            <img
                              src={employee.avatar}
                              alt={`${employee.firstName} ${employee.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-hr-navy text-white font-medium">
                              {employee.firstName[0]}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{employee.firstName} {employee.lastName}</p>
                          <p className="text-sm text-gray-500">{employee.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      {employee.salary ? (
                        <span className="text-green-600 font-medium">
                          {employee.salaryCurrency || 'USD'} {employee.salary.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">Not set</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={employee.status} />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {employee.documents?.length || 0} files
                      </span>
                    </TableCell>
                    <TableCell>
                      <EmployeeActions 
                        employee={employee} 
                        onView={() => {
                          setSelectedEmployee(employee);
                          setIsViewDialogOpen(true);
                        }}
                        onEdit={() => {
                          setSelectedEmployee(employee);
                          setIsEditDialogOpen(true);
                        }}
                        onManageDocuments={() => {
                          setSelectedEmployee(employee);
                          setIsDocumentDialogOpen(true);
                        }}
                        onManageSalary={() => {
                          setSelectedEmployee(employee);
                          setIsSalaryDialogOpen(true);
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

      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Enter comprehensive employee information including personal details, salary, and emergency contacts.
            </DialogDescription>
          </DialogHeader>
          <EnhancedEmployeeForm 
            onSubmit={handleAddEmployee}
            departments={departments}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Employee Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Employee Profile</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <ComprehensiveEmployeeProfile 
              employee={selectedEmployee}
              onClose={() => setIsViewDialogOpen(false)}
              onEdit={() => {
                setIsViewDialogOpen(false);
                setIsEditDialogOpen(true);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee information and details.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <EnhancedEmployeeForm 
              employee={selectedEmployee}
              onSubmit={handleUpdateEmployee}
              departments={departments}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Document Management Dialog */}
      <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Employee Documents</DialogTitle>
            <DialogDescription>
              Upload and manage documents for {selectedEmployee?.firstName} {selectedEmployee?.lastName}
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeDocumentManager 
              employeeId={selectedEmployee.id}
              employeeName={`${selectedEmployee.firstName} ${selectedEmployee.lastName}`}
              onClose={() => setIsDocumentDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Salary Management Dialog */}
      <Dialog open={isSalaryDialogOpen} onOpenChange={setIsSalaryDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Employee Salary</DialogTitle>
            <DialogDescription>
              Update salary information for {selectedEmployee?.firstName} {selectedEmployee?.lastName}
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <EmployeeSalaryManager 
              employee={selectedEmployee}
              onClose={() => setIsSalaryDialogOpen(false)}
              onUpdate={(updatedEmployee) => {
                setSelectedEmployee(updatedEmployee);
                // Refresh employee list
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

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

const EmployeeActions = ({ 
  employee, 
  onView, 
  onEdit, 
  onManageDocuments,
  onManageSalary
}: { 
  employee: Employee;
  onView: () => void;
  onEdit: () => void;
  onManageDocuments: () => void;
  onManageSalary: () => void;
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
          <Eye className="mr-2 h-4 w-4" /> View Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" /> Edit Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onManageDocuments}>
          <FileText className="mr-2 h-4 w-4" /> Manage Documents
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onManageSalary}>
          <DollarSign className="mr-2 h-4 w-4" /> Manage Salary
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EnhancedEmployeeManagement;