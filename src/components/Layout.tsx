
import React from 'react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { 
  Users, 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Settings,
  User,
  Calendar,
  FileEdit
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
}

export function Layout({ children, activePage }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-hr-gray">
        <AppSidebar activePage={activePage} />
        <main className="flex-1">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <SidebarTrigger className="lg:hidden p-2 rounded-md border border-gray-200 bg-white text-hr-navy" />
              <div className="flex ml-auto space-x-3">
                <div className="bg-white p-2 rounded-full border border-gray-200">
                  <User size={20} className="text-hr-navy" />
                </div>
              </div>
            </div>
            <div className="animate-fade-in">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

function AppSidebar({ activePage }: { activePage: string }) {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, id: 'dashboard' },
    { name: 'Employees', href: '/employees', icon: Users, id: 'employees' },
    { name: 'Departments', href: '/departments', icon: Briefcase, id: 'departments' },
    { name: 'Leave Requests', href: '/leave-requests', icon: Calendar, id: 'leave-requests' },
    { name: 'Remote Requests', href: '/remote-requests', icon: FileEdit, id: 'remote-requests' },
    { name: 'Reports', href: '/reports', icon: FileText, id: 'reports' },
    { name: 'Settings', href: '/settings', icon: Settings, id: 'settings' },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <h1 className="font-bold text-xl text-white">HR Manager</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className={activePage === item.id ? 'bg-sidebar-accent' : ''}
              >
                <a href={item.href} className="flex items-center gap-4 px-3 py-2">
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export default Layout;
