
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  FileText, 
  User, 
  Clock,
  Target,
  UserCheck,
  TrendingUp,
  Award,
  Bell
} from 'lucide-react';
import LeaveRequestManagement from './LeaveRequestManagement';
import RemoteRequestManagement from './RemoteRequestManagement';
import DocumentManagementDashboard from './DocumentManagementDashboard';
import AttendanceTracking from './AttendanceTracking';
import PerformanceManagement from './PerformanceManagement';
import OnboardingWorkflow from './OnboardingWorkflow';

const EmployeePortal = () => {
  const { user } = useAuth();
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

  const tabs = [
    { value: 'overview', label: 'Overview', icon: User },
    { value: 'attendance', label: 'Attendance', icon: Clock },
    { value: 'leave', label: 'Leave', icon: Calendar },
    { value: 'remote', label: 'Remote', icon: MapPin },
    { value: 'documents', label: 'Documents', icon: FileText },
    { value: 'performance', label: 'Performance', icon: Target },
    { value: 'onboarding', label: 'Onboarding', icon: UserCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
              {employeeData.firstName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Welcome back, {employeeData.firstName}!
              </h1>
              <p className="text-slate-600 flex items-center gap-2 mt-1">
                <Award className="h-4 w-4" />
                {employeeData.position} • {employeeData.department}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Active
            </Badge>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        {/* Modern Tab Navigation */}
        <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-sm">
          <TabsList className="bg-transparent w-full justify-start overflow-x-auto flex-nowrap gap-1 h-auto p-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="
                  flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg
                  data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600
                  data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25
                  hover:bg-slate-50 text-slate-600 hover:text-slate-900
                  transition-all duration-200 whitespace-nowrap flex-shrink-0
                "
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Stats Cards */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Time at Company
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">
                  {Math.floor((new Date().getTime() - new Date(employeeData.hireDate).getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
                <p className="text-blue-600 text-sm mt-1">Since {employeeData.hireDate}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Leave Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">15 days</div>
                <p className="text-green-600 text-sm mt-1">Available this year</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-800 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">160 hrs</div>
                <p className="text-purple-600 text-sm mt-1">Working hours</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: Calendar, text: 'Leave request approved', time: '2 days ago', color: 'text-green-600' },
                  { icon: Clock, text: 'Clocked in at 9:00 AM', time: 'Today', color: 'text-blue-600' },
                  { icon: FileText, text: 'Document request submitted', time: '1 week ago', color: 'text-purple-600' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${activity.color} bg-opacity-10`}>
                      <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{activity.text}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  Upcoming
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: Target, text: 'Performance review', time: 'Next month', color: 'text-orange-600' },
                  { icon: Calendar, text: 'Team meeting', time: 'Tomorrow', color: 'text-blue-600' },
                  { icon: Award, text: 'Training session', time: 'Next week', color: 'text-purple-600' }
                ].map((event, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${event.color} bg-opacity-10`}>
                      <event.icon className={`h-4 w-4 ${event.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{event.text}</p>
                      <p className="text-xs text-slate-500 mt-1">{event.time}</p>
                    </div>
                  </div>
                ))}
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
