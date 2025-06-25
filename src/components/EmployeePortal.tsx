
import React, { useState, useContext } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AuthContext } from '@/context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  FileText, 
  User, 
  Clock,
  Target,
  UserCheck
} from 'lucide-react';
import LeaveRequestManagement from './LeaveRequestManagement';
import RemoteRequestManagement from './RemoteRequestManagement';
import DocumentManagementDashboard from './DocumentManagementDashboard';
import AttendanceTracking from './AttendanceTracking';
import PerformanceManagement from './PerformanceManagement';
import OnboardingWorkflow from './OnboardingWorkflow';

const EmployeePortal = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) {
    return <div>Please log in to access the employee portal.</div>;
  }

  // Mock employee data - in real app, fetch from API
  const employeeData = {
    id: user.id,
    firstName: 'John',
    lastName: 'Doe',
    email: user.email,
    department: user.department,
    position: 'Software Engineer',
    hireDate: '2022-03-15',
    avatar: '/placeholder.svg'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Portal</h1>
          <p className="text-gray-600">Welcome back, {employeeData.firstName}!</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">{employeeData.position}</p>
          <p className="text-sm text-gray-600">{employeeData.department}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="leave" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Leave
          </TabsTrigger>
          <TabsTrigger value="remote" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Remote Work
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="onboarding" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Onboarding
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Days at Company</span>
                  <Badge variant="outline">
                    {Math.floor((new Date().getTime() - new Date(employeeData.hireDate).getTime()) / (1000 * 60 * 60 * 24))} days
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Leave Balance</span>
                  <Badge variant="outline">15 days</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Month Hours</span>
                  <Badge variant="outline">160 hrs</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span>Leave request approved</span>
                  </div>
                  <div className="text-xs text-gray-500 ml-5">2 days ago</div>
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-3 w-3" />
                    <span>Clocked in at 9:00 AM</span>
                  </div>
                  <div className="text-xs text-gray-500 ml-5">Today</div>
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="h-3 w-3" />
                    <span>Document request submitted</span>
                  </div>
                  <div className="text-xs text-gray-500 ml-5">1 week ago</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Target className="h-3 w-3" />
                    <span>Performance review</span>
                  </div>
                  <div className="text-xs text-gray-500 ml-5">Next month</div>
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span>Team meeting</span>
                  </div>
                  <div className="text-xs text-gray-500 ml-5">Tomorrow</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <AttendanceTracking employeeId={employeeData.id} />
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          <LeaveRequestManagement />
        </TabsContent>

        <TabsContent value="remote" className="space-y-4">
          <RemoteRequestManagement />
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <DocumentManagementDashboard
            employeeId={employeeData.id}
            isHR={user.role === 'admin'}
            isAdmin={user.role === 'admin'}
          />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceManagement employeeId={employeeData.id} />
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-4">
          <OnboardingWorkflow employeeId={employeeData.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeePortal;
