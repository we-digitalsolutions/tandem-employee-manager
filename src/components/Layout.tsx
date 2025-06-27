
import React, { useState } from 'react';
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
  Key,
  Home,
  MapPin,
  Clock,
  UserCheck,
  Menu,
  X
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
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
}

export function Layout({ children, activePage }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <AppSidebar activePage={activePage} />
        
        {/* Mobile Overlay */}
        {isMobile && mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="flex-1 flex flex-col min-h-screen">
          {/* Modern Header */}
          <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 lg:px-6 h-16">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm" />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    HR Manager Pro
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {user && (
                  <>
                    <Badge variant="outline" className="hidden sm:flex bg-blue-50 text-blue-700 border-blue-200">
                      {user.role}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-blue-200 transition-all">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium shadow-md">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md shadow-xl border-slate-200">
                        <div className="flex items-center justify-start gap-3 p-3 border-b border-slate-100">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="flex flex-col space-y-1 leading-none">
                            <p className="font-medium text-slate-900">{user.name}</p>
                            <p className="text-sm text-slate-600">{user.email}</p>
                          </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Logout</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 p-4 lg:p-6">
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
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, id: 'dashboard', showFor: ['admin', 'manager'], color: 'text-blue-500' },
    { name: 'Employees', href: '/employees', icon: Users, id: 'employees', showFor: ['admin', 'manager'], color: 'text-green-500' },
    { name: 'Departments', href: '/departments', icon: Briefcase, id: 'departments', showFor: ['admin', 'manager'], color: 'text-purple-500' },
    { name: 'Leave Requests', href: '/leave-requests', icon: Calendar, id: 'leave-requests', showFor: ['admin', 'manager'], color: 'text-orange-500' },
    { name: 'Remote Work', href: '/remote-requests', icon: MapPin, id: 'remote-requests', showFor: ['admin', 'manager'], color: 'text-teal-500' },
    { name: 'Reports', href: '/reports', icon: BarChart, id: 'reports', showFor: ['admin', 'manager'], color: 'text-indigo-500' },
    { name: 'User Management', href: '/user-management', icon: Key, id: 'user-management', showFor: ['admin'], color: 'text-red-500' },
    { name: 'Settings', href: '/settings', icon: Settings, id: 'settings', showFor: ['admin', 'manager'], color: 'text-gray-500' },
    { name: 'Employee Portal', href: '/employee-portal', icon: User, id: 'employee-portal', showFor: ['employee'], color: 'text-blue-500' },
    { name: 'Holidays', href: '/holidays', icon: Calendar, id: 'holidays', showFor: ['admin', 'manager', 'employee'], color: 'text-pink-500' },
    { name: 'Templates', href: '/templates', icon: FileText, id: 'templates', showFor: ['admin', 'manager'], color: 'text-yellow-600' },
    { name: 'Doc Requests', href: '/document-requests', icon: FileText, id: 'document-requests', showFor: ['admin', 'manager', 'employee'], color: 'text-cyan-500' },
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
    <Sidebar className="border-r border-slate-200/60 bg-white/95 backdrop-blur-md shadow-lg">
      <SidebarHeader className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
            <Home className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              HR Manager
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Professional Edition</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarMenu className="space-y-1">
          {filteredNavigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className={`
                  group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:shadow-md
                  ${activePage === item.id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                    : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                  }
                `}
                onClick={() => handleNavigate(item.href)}
              >
                <button className="flex items-center gap-3 w-full text-left">
                  <item.icon 
                    size={20} 
                    className={activePage === item.id ? 'text-white' : item.color}
                  />
                  <span className="font-medium text-sm">{item.name}</span>
                  {activePage === item.id && (
                    <div className="absolute inset-y-0 right-2 flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white opacity-75"></div>
                    </div>
                  )}
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-100 mt-auto">
        <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-slate-50">
          <div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 h-9 w-9 flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-medium">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          <div className="text-sm flex-1 min-w-0">
            <p className="font-medium text-slate-900 truncate">{user?.name}</p>
            <p className="text-slate-500 text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default Layout;
