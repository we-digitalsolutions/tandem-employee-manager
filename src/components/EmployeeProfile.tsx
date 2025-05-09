
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { employeesData } from '@/data/mockData';
import { Badge } from "@/components/ui/badge";
import { FileText, Mail, Phone, Calendar, MapPin } from "lucide-react";

const EmployeeProfile = ({ employeeId = '1' }: { employeeId?: string }) => {
  // In a real app, we'd fetch this data from an API based on the ID
  const employee = employeesData.find(emp => emp.id === employeeId) || employeesData[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Profile</h1>
          <p className="text-gray-600">View and manage employee information</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Export Profile</Button>
          <Button variant="default" className="bg-hr-teal hover:bg-hr-teal/90">Edit Profile</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden">
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
              <h2 className="text-xl font-bold">{employee.firstName} {employee.lastName}</h2>
              <p className="text-gray-600 mb-2">{employee.position}</p>
              
              <Badge className={getStatusClass(employee.status)} variant="outline">
                {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
              </Badge>
              
              <div className="w-full mt-6 space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <a href={`mailto:${employee.email}`} className="text-sm text-blue-600 hover:underline">{employee.email}</a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm">{employee.phone}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm">Joined {formatDate(employee.hireDate)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Employee Information</CardTitle>
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard title="Department" value={employee.department} />
                  <InfoCard title="Position" value={employee.position} />
                  <InfoCard title="Employment Type" value="Full-time" />
                  <InfoCard title="Manager" value="Jane Smith" />
                  <InfoCard title="Office Location" value="San Francisco HQ" />
                  <InfoCard title="Work Schedule" value="Mon-Fri, 9AM-5PM" />
                </div>
                
                <div className="mt-6">
                  <h3 className="text-md font-medium mb-3">Employee Notes</h3>
                  <p className="text-sm text-gray-600">
                    {employee.firstName} joined the company in {new Date(employee.hireDate).getFullYear()} and has been a valuable member of the {employee.department} team. They have consistently demonstrated strong skills in teamwork, problem-solving, and customer service.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="documents" className="mt-0">
                <div className="space-y-4">
                  {['Employment Contract', 'Performance Review 2023', 'Training Certificates', 'Onboarding Documents'].map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-gray-500" />
                        <span>{doc}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="hover:bg-gray-100">View</Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="mt-0">
                <div className="space-y-4">
                  <h3 className="text-md font-medium mb-3">Performance Summary</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <ScoreCard title="Communication" score={4} />
                    <ScoreCard title="Teamwork" score={5} />
                    <ScoreCard title="Technical Skills" score={4} />
                    <ScoreCard title="Productivity" score={3} />
                  </div>
                  
                  <h3 className="text-md font-medium mt-6 mb-3">Recent Feedback</h3>
                  <div className="space-y-3">
                    <FeedbackItem
                      title="Q2 Performance Review"
                      date="Jun 15, 2023"
                      content="Exceeds expectations in most areas. Great team player and consistently delivers quality work."
                    />
                    <FeedbackItem
                      title="Project Feedback - Website Redesign"
                      date="Mar 22, 2023"
                      content="Showed excellent initiative and creative problem-solving during the website redesign project."
                    />
                  </div>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

const InfoCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
};

const ScoreCard = ({ title, score }: { title: string; score: number }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md text-center">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <div className="flex justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-5 w-5 ${star <= score ? 'text-amber-400' : 'text-gray-300'}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  );
};

const FeedbackItem = ({ title, date, content }: { title: string; date: string; content: string }) => {
  return (
    <div className="border-l-4 border-hr-teal pl-4 py-2">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-medium">{title}</h4>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
      <p className="text-sm text-gray-600">{content}</p>
    </div>
  );
};

function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function getStatusClass(status: string) {
  const statusMap: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    onLeave: 'bg-amber-100 text-amber-800',
  };

  return statusMap[status] || 'bg-gray-100 text-gray-800';
}

export default EmployeeProfile;
