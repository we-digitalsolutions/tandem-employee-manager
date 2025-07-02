import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Employee } from '@/types';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase,
  DollarSign,
  FileText,
  AlertTriangle,
  Building,
  Clock,
  Edit
} from 'lucide-react';
import { format } from 'date-fns';

interface ComprehensiveEmployeeProfileProps {
  employee: Employee;
  onClose: () => void;
  onEdit: () => void;
}

const ComprehensiveEmployeeProfile = ({ employee, onClose, onEdit }: ComprehensiveEmployeeProfileProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Employee Profile</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Header Card with Photo and Basic Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
              {employee.avatar ? (
                <img
                  src={employee.avatar}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-hr-navy text-white text-2xl font-medium">
                  {employee.firstName[0]}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h2>
              <p className="text-lg text-gray-600 mb-2">{employee.position}</p>
              <div className="flex items-center gap-4">
                <StatusBadge status={employee.status} />
                <Badge variant="outline">{employee.department}</Badge>
                <Badge variant="outline" className="capitalize">{employee.employmentType || 'Full-time'}</Badge>
              </div>
            </div>
            <div className="text-right">
              {employee.salary && (
                <div>
                  <p className="text-sm text-gray-500">Annual Salary</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(employee.salary, employee.salaryCurrency || 'USD')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <a href={`mailto:${employee.email}`} className="text-blue-600 hover:underline">
                      {employee.email}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{employee.phone}</span>
                  </div>
                </div>
              </div>

              {(employee.address || employee.city) && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <div className="flex items-start gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      {employee.address && <p>{employee.address}</p>}
                      <p>
                        {employee.city && employee.city}
                        {employee.state && `, ${employee.state}`}
                        {employee.postalCode && ` ${employee.postalCode}`}
                      </p>
                      {employee.country && <p>{employee.country}</p>}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Employment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Position</label>
                  <p className="mt-1">{employee.position}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p className="mt-1">{employee.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Employment Type</label>
                  <p className="mt-1 capitalize">{employee.employmentType || 'Full-time'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Hire Date</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{formatDate(employee.hireDate)}</span>
                  </div>
                </div>
                {employee.workSchedule && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Work Schedule</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{employee.workSchedule}</span>
                    </div>
                  </div>
                )}
                {employee.officeLocation && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Office Location</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span>{employee.officeLocation}</span>
                    </div>
                  </div>
                )}
              </div>

              {employee.jobDescription && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Job Description</label>
                  <p className="mt-1 text-gray-700">{employee.jobDescription}</p>
                </div>
              )}

              {employee.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Additional Notes</label>
                  <p className="mt-1 text-gray-700">{employee.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {employee.dateOfBirth && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{formatDate(employee.dateOfBirth)}</span>
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Employee ID</label>
                  <p className="mt-1 font-mono text-sm">{employee.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Emergency Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {employee.emergencyContactName ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Contact Name</label>
                    <p className="mt-1">{employee.emergencyContactName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{employee.emergencyContactPhone}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Relationship</label>
                    <p className="mt-1">{employee.emergencyContactRelationship}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No emergency contact information on file
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Financial information is sensitive and only accessible to authorized HR personnel.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {employee.salary && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Annual Salary</label>
                    <p className="mt-1 text-lg font-medium text-green-600">
                      {formatCurrency(employee.salary, employee.salaryCurrency || 'USD')}
                    </p>
                  </div>
                )}
                {employee.bankName && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Bank Name</label>
                    <p className="mt-1">{employee.bankName}</p>
                  </div>
                )}
                {employee.bankAccountNumber && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Number</label>
                    <p className="mt-1 font-mono">••••••••••••</p>
                  </div>
                )}
                {employee.taxId && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tax ID</label>
                    <p className="mt-1 font-mono">••••••••••</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default ComprehensiveEmployeeProfile;