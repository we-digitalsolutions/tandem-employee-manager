
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import EmployeeDirectory from '@/components/EmployeeDirectory';
import EmployeeProfile from '@/components/EmployeeProfile';
import DepartmentManagement from '@/components/DepartmentManagement';
import LeaveRequestManagement from '@/components/LeaveRequestManagement';
import RemoteRequestManagement from '@/components/RemoteRequestManagement';
import Reports from '@/components/Reports';
import Settings from '@/components/Settings';
import EmployeePortal from '@/components/EmployeePortal';
import UserManagement from '@/components/UserManagement';
import FeatureVerificationDashboard from '@/components/FeatureVerificationDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = ({ activePage: initialActivePage }: { activePage?: string }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(initialActivePage || 'dashboard');
  
  // Set active tab based on location path
  useEffect(() => {
    const path = location.pathname.split('/')[1];
    if (path) {
      setActiveTab(path);
    } else if (initialActivePage) {
      setActiveTab(initialActivePage);
    }
  }, [location.pathname, initialActivePage]);

  return (
    <Layout activePage={activeTab}>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 bg-white overflow-x-auto w-full flex flex-nowrap">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="leave-requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="remote-requests">Remote Requests</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="user-management">User Management</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="employee-portal">Employee Portal</TabsTrigger>
          <TabsTrigger value="feature-verification">Feature Test</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-0">
          <Dashboard />
        </TabsContent>
        
        <TabsContent value="employees" className="mt-0">
          <EmployeeDirectory />
        </TabsContent>
        
        <TabsContent value="departments" className="mt-0">
          <DepartmentManagement />
        </TabsContent>
        
        <TabsContent value="leave-requests" className="mt-0">
          <LeaveRequestManagement />
        </TabsContent>
        
        <TabsContent value="remote-requests" className="mt-0">
          <RemoteRequestManagement />
        </TabsContent>
        
        <TabsContent value="reports" className="mt-0">
          <Reports />
        </TabsContent>
        
        <TabsContent value="user-management" className="mt-0">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <Settings />
        </TabsContent>
        
        <TabsContent value="employee-portal" className="mt-0">
          <EmployeePortal />
        </TabsContent>
        
        <TabsContent value="feature-verification" className="mt-0">
          <FeatureVerificationDashboard />
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Index;
