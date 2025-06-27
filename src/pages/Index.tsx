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
import HolidayCalendar from '@/components/HolidayCalendar';
import DocumentTemplateManager from '@/components/DocumentTemplateManager';
import EnhancedDocumentRequestSystem from '@/components/EnhancedDocumentRequestSystem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar, 
  MapPin, 
  BarChart, 
  Key, 
  Settings as SettingsIcon, 
  User,
  FileText,
  CheckCircle
} from "lucide-react";

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

  const tabs = [
    { value: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { value: 'employees', label: 'Employees', icon: Users },
    { value: 'departments', label: 'Departments', icon: Briefcase },
    { value: 'leave-requests', label: 'Leave Requests', icon: Calendar },
    { value: 'remote-requests', label: 'Remote Work', icon: MapPin },
    { value: 'reports', label: 'Reports', icon: BarChart },
    { value: 'user-management', label: 'Users', icon: Key },
    { value: 'settings', label: 'Settings', icon: SettingsIcon },
    { value: 'employee-portal', label: 'Portal', icon: User },
    { value: 'holidays', label: 'Holidays', icon: Calendar },
    { value: 'templates', label: 'Templates', icon: FileText },
    { value: 'document-requests', label: 'Docs', icon: FileText },
    { value: 'feature-verification', label: 'Test', icon: CheckCircle },
  ];

  return (
    <Layout activePage={activeTab}>
      <div className="max-w-full overflow-x-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          {/* Modern Horizontal Tabs */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-border p-2">
            <div className="tab-scroll-container">
              <TabsList className="bg-transparent w-full min-w-max justify-start flex-nowrap gap-1 h-auto p-0">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={`
                      horizontal-tab flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg
                      transition-all duration-200 whitespace-nowrap flex-shrink-0 border border-transparent
                      ${activeTab === tab.value 
                        ? 'bg-primary text-primary-foreground shadow-lg border-primary/20' 
                        : 'hover:bg-accent text-muted-foreground hover:text-accent-foreground'
                      }
                    `}
                  >
                    <tab.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 max-w-full overflow-x-hidden">
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
            
            <TabsContent value="holidays" className="mt-0">
              <HolidayCalendar />
            </TabsContent>
            
            <TabsContent value="templates" className="mt-0">
              <DocumentTemplateManager />
            </TabsContent>
            
            <TabsContent value="document-requests" className="mt-0">
              <EnhancedDocumentRequestSystem />
            </TabsContent>
            
            <TabsContent value="feature-verification" className="mt-0">
              <FeatureVerificationDashboard />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;
