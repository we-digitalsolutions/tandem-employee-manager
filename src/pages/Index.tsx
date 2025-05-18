
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import EmployeeDirectory from '@/components/EmployeeDirectory';
import EmployeeProfile from '@/components/EmployeeProfile';
import DepartmentManagement from '@/components/DepartmentManagement';
import LeaveRequestManagement from '@/components/LeaveRequestManagement';
import RemoteRequestManagement from '@/components/RemoteRequestManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Layout activePage={activeTab}>
      <Tabs
        defaultValue="dashboard"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-6 bg-white overflow-x-auto w-full flex flex-nowrap">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="employee-profile">Employee Profile</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="leave-requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="remote-requests">Remote Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-0">
          <Dashboard />
        </TabsContent>
        
        <TabsContent value="employees" className="mt-0">
          <EmployeeDirectory />
        </TabsContent>
        
        <TabsContent value="employee-profile" className="mt-0">
          <EmployeeProfile />
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
      </Tabs>
    </Layout>
  );
};

export default Index;
