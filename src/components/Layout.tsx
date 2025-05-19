
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from "@/components/ui/sidebar";
import { 
  Users, 
  LayoutDashboard, 
  Briefcase, 
  Settings,
  User,
  Calendar,
  FileText,
  BarChart,
  LogOut,
  Key
} from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
}

export function Layout({ children, activePage }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-hr-gray">
        <AppSidebar activePage={activePage} />
        <main className="flex-1">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <SidebarTrigger className="lg:hidden p-2 rounded-md border border-gray-200 bg-white text-hr-navy" />
              <div className="flex ml-auto space-x-3 items-center">
                {user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-hr-navy text-white">
                          {user.name ? user.name.charAt(0) : 'U'}
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/settings')}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, id: 'dashboard', showFor: ['admin', 'manager'] },
    { name: 'Employees', href: '/employees', icon: Users, id: 'employees', showFor: ['admin', 'manager'] },
    { name: 'Departments', href: '/departments', icon: Briefcase, id: 'departments', showFor: ['admin', 'manager'] },
    { name: 'Leave Requests', href: '/leave-requests', icon: Calendar, id: 'leave-requests', showFor: ['admin', 'manager'] },
    { name: 'Remote Requests', href: '/remote-requests', icon: FileText, id: 'remote-requests', showFor: ['admin', 'manager'] },
    { name: 'Reports', href: '/reports', icon: BarChart, id: 'reports', showFor: ['admin', 'manager'] },
    { name: 'User Management', href: '/user-management', icon: Key, id: 'user-management', showFor: ['admin'] },
    { name: 'Settings', href: '/settings', icon: Settings, id: 'settings', showFor: ['admin', 'manager'] },
    { name: 'Employee Portal', href: '/employee-portal', icon: User, id: 'employee-portal', showFor: ['employee'] },
  ];

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(item => {
    if (!user || !user.role) return false;
    return item.showFor.includes(user.role);
  });

  const handleNavigate = (href: string) => {
    navigate(href);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <h1 className="font-bold text-xl text-white">HR Manager</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {filteredNavigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className={activePage === item.id ? 'bg-sidebar-accent' : ''}
                onClick={() => handleNavigate(item.href)}
              >
                <button className="flex items-center gap-4 px-3 py-2 w-full text-left">
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border mt-auto">
        <div className="flex items-center gap-3 text-gray-300">
          <div className="rounded-full bg-gray-700 h-8 w-8 flex items-center justify-center">
            {user?.name ? user.name.charAt(0) : 'U'}
          </div>
          <div className="text-sm">
            <p className="font-medium">{user?.name}</p>
            <p className="text-gray-400 text-xs">{user?.email}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default Layout;
