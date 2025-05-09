
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
import { employeesData } from '@/data/mockData';
import { Employee } from '@/types';
import { Search, MoreHorizontal, UserPlus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const EmployeeDirectory = () => {
  const [search, setSearch] = useState('');
  
  const filteredEmployees = employeesData.filter(employee => 
    employee.firstName.toLowerCase().includes(search.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(search.toLowerCase()) ||
    employee.email.toLowerCase().includes(search.toLowerCase()) ||
    employee.department.toLowerCase().includes(search.toLowerCase()) ||
    employee.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-600">Manage your employee directory</p>
        </div>
        <Button className="bg-hr-teal hover:bg-hr-teal/90">
          <UserPlus className="mr-2 h-4 w-4" /> Add Employee
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Employee Directory</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search employees..."
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
                <TableHead>Employee</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
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
                      <StatusBadge status={employee.status} />
                    </TableCell>
                    <TableCell>{formatDate(employee.hireDate)}</TableCell>
                    <TableCell>
                      <EmployeeActions employee={employee} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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

const EmployeeActions = ({ employee }: { employee: Employee }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>View Profile</DropdownMenuItem>
        <DropdownMenuItem>Edit Employee</DropdownMenuItem>
        <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export default EmployeeDirectory;
