
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
import { departmentsData } from '@/data/mockData';
import { Department } from '@/types';
import { Search, MoreHorizontal, Briefcase, Plus, Edit, Trash2, Eye, DollarSign } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";
import DepartmentForm from './DepartmentForm';

const DepartmentManagement = () => {
  const [search, setSearch] = useState('');
  const [departments, setDepartments] = useState<Department[]>(departmentsData);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState("");
  
  const filteredDepartments = departments.filter(department => 
    department.name.toLowerCase().includes(search.toLowerCase()) ||
    department.manager.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddDepartment = (data: any) => {
    const newDepartment = {
      ...data,
      id: `dept-${Date.now()}`,
      employeeCount: 0,
    };
    
    setDepartments([...departments, newDepartment as Department]);
    setIsAddDialogOpen(false);
    toast.success("Department added successfully");
  };

  const handleUpdateDepartment = (data: any) => {
    if (!selectedDepartment) return;
    
    const updatedDepartments = departments.map(dept => 
      dept.id === selectedDepartment.id ? { ...dept, ...data } : dept
    );
    
    setDepartments(updatedDepartments);
    setIsEditDialogOpen(false);
    toast.success("Department updated successfully");
  };

  const handleDeleteDepartment = () => {
    if (!selectedDepartment) return;
    
    const updatedDepartments = departments.filter(dept => 
      dept.id !== selectedDepartment.id
    );
    
    setDepartments(updatedDepartments);
    setIsDeleteDialogOpen(false);
    toast.success("Department deleted successfully");
  };

  const handleUpdateBudget = () => {
    if (!selectedDepartment || !budgetAmount) return;
    
    const budget = parseFloat(budgetAmount);
    if (isNaN(budget)) return;
    
    const updatedDepartments = departments.map(dept => 
      dept.id === selectedDepartment.id ? { ...dept, budget } : dept
    );
    
    setDepartments(updatedDepartments);
    setIsBudgetDialogOpen(false);
    setBudgetAmount("");
    toast.success("Department budget updated successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600">Manage your company departments</p>
        </div>
        <Button 
          className="bg-hr-teal hover:bg-hr-teal/90"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Department
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Department Directory</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search departments..."
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
                <TableHead>Department</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Budget Utilization</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No departments found
                  </TableCell>
                </TableRow>
              ) : (
                filteredDepartments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-hr-lightblue flex items-center justify-center">
                          <Briefcase className="h-4 w-4 text-hr-navy" />
                        </div>
                        <span>{department.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{department.manager}</TableCell>
                    <TableCell>{department.employeeCount}</TableCell>
                    <TableCell>${formatCurrency(department.budget)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={getRandomValue(60, 95)} className="h-2" />
                        <span className="text-xs text-gray-500">{getRandomValue(60, 95)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DepartmentActions 
                        department={department}
                        onView={() => {
                          setSelectedDepartment(department);
                          setIsViewDialogOpen(true);
                        }}
                        onEdit={() => {
                          setSelectedDepartment(department);
                          setIsEditDialogOpen(true);
                        }}
                        onManageBudget={() => {
                          setSelectedDepartment(department);
                          setBudgetAmount(department.budget.toString());
                          setIsBudgetDialogOpen(true);
                        }}
                        onDelete={() => {
                          setSelectedDepartment(department);
                          setIsDeleteDialogOpen(true);
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.slice(0, 3).map((department) => (
          <DepartmentCard
            key={department.id}
            name={department.name}
            employeeCount={department.employeeCount}
            managerName={department.manager}
            budgetUtilization={getRandomValue(60, 95)}
            onViewDetails={() => {
              setSelectedDepartment(department);
              setIsViewDialogOpen(true);
            }}
          />
        ))}
      </div>

      {/* Add Department Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>
              Enter the details for the new department.
            </DialogDescription>
          </DialogHeader>
          <DepartmentForm onSubmit={handleAddDepartment} />
        </DialogContent>
      </Dialog>

      {/* View Department Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Department Details</DialogTitle>
          </DialogHeader>
          {selectedDepartment && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-hr-lightblue flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-hr-navy" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{selectedDepartment.name}</h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Manager</p>
                  <p>{selectedDepartment.manager}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Employees</p>
                  <p>{selectedDepartment.employeeCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p>${formatCurrency(selectedDepartment.budget)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Budget Utilization</p>
                  <div className="flex items-center gap-2">
                    <Progress value={getRandomValue(60, 95)} className="h-2" />
                    <span className="text-xs text-gray-500">{getRandomValue(60, 95)}%</span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    setIsEditDialogOpen(true);
                  }}
                >
                  Edit Department
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update the department information.
            </DialogDescription>
          </DialogHeader>
          {selectedDepartment && (
            <DepartmentForm 
              department={selectedDepartment} 
              onSubmit={handleUpdateDepartment}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Manage Budget Dialog */}
      <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Manage Department Budget</DialogTitle>
            <DialogDescription>
              Update the budget for {selectedDepartment?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <Input
                type="number"
                placeholder="Budget amount"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBudgetDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateBudget}>Update Budget</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Department Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Department</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this department? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDepartment}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const DepartmentCard = ({ 
  name, 
  employeeCount, 
  managerName, 
  budgetUtilization,
  onViewDetails
}: { 
  name: string; 
  employeeCount: number; 
  managerName: string; 
  budgetUtilization: number; 
  onViewDetails: () => void;
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg">{name}</h3>
            <p className="text-sm text-gray-500">Manager: {managerName}</p>
          </div>
          <div className="bg-hr-lightblue p-2 rounded-md">
            <Briefcase className="h-5 w-5 text-hr-navy" />
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Employees</span>
              <span className="font-medium">{employeeCount}</span>
            </div>
            <Progress value={employeeCount / 0.3} className="h-1" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Budget Utilization</span>
              <span className="font-medium">{budgetUtilization}%</span>
            </div>
            <Progress 
              value={budgetUtilization} 
              className={`h-1 ${budgetUtilization > 90 ? 'bg-red-500' : budgetUtilization > 75 ? 'bg-amber-500' : 'bg-green-500'}`} 
            />
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onViewDetails}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const DepartmentActions = ({ 
  department,
  onView,
  onEdit,
  onManageBudget,
  onDelete
}: { 
  department: Department;
  onView: () => void;
  onEdit: () => void;
  onManageBudget: () => void;
  onDelete: () => void;
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
          <Edit className="mr-2 h-4 w-4" /> Edit Department
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onManageBudget}>
          <DollarSign className="mr-2 h-4 w-4" /> Manage Budget
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-600"
          onClick={onDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete Department
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function formatCurrency(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getRandomValue(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default DepartmentManagement;
