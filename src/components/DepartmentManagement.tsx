
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
import { Button } from "@/components/ui/button";
import { departmentsData } from '@/data/mockData';
import { Search, MoreHorizontal, Briefcase, Plus } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const DepartmentManagement = () => {
  const [search, setSearch] = useState('');
  
  const filteredDepartments = departmentsData.filter(department => 
    department.name.toLowerCase().includes(search.toLowerCase()) ||
    department.manager.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600">Manage your company departments</p>
        </div>
        <Button className="bg-hr-teal hover:bg-hr-teal/90">
          <Plus className="mr-2 h-4 w-4" /> Add Department
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Department Directory</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search departments..."
                className="pl-8"
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
                      <DepartmentActions department={department} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DepartmentCard
          name="Engineering"
          employeeCount={24}
          managerName="John Doe"
          budgetUtilization={85}
        />
        <DepartmentCard
          name="Marketing"
          employeeCount={12}
          managerName="Jane Smith"
          budgetUtilization={72}
        />
        <DepartmentCard
          name="Finance"
          employeeCount={8}
          managerName="Robert Johnson"
          budgetUtilization={91}
        />
      </div>
    </div>
  );
};

const DepartmentCard = ({ 
  name, 
  employeeCount, 
  managerName, 
  budgetUtilization 
}: { 
  name: string; 
  employeeCount: number; 
  managerName: string; 
  budgetUtilization: number; 
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
          <Button variant="outline" className="w-full">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const DepartmentActions = ({ department }: any) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>View Details</DropdownMenuItem>
        <DropdownMenuItem>Edit Department</DropdownMenuItem>
        <DropdownMenuItem>Manage Budget</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600">Delete Department</DropdownMenuItem>
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
