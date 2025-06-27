
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
      <div className="min-h-screen flex w-full bg-background overflow-x-hidden">
        <AppSidebar activePage={activePage} />
        
        {/* Mobile Overlay */}
        {isMobile && mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <main className="flex-1 flex flex-col min-h-screen min-w-0">
          {/* Modern Header */}
          <header className="bg-white/95 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 lg:px-6 h-16 max-w-full">
              <div className="flex items-center gap-4 min-w-0">
                <SidebarTrigger className="lg:hidden p-2 rounded-lg border border-border bg-white hover:bg-accent text-foreground shadow-sm flex-shrink-0" />
                <div className="hidden sm:block truncate">
                  <h1 className="text-xl font-bold text-primary truncate">
                    HR Manager Pro
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {user && (
                  <>
                    <Badge variant="outline" className="hidden sm:flex bg-secondary/10 text-secondary border-secondary/20">
                      {user.role}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all flex-shrink-0">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium shadow-md">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md shadow-xl border-border z-50">
                        <div className="flex items-center justify-start gap-3 p-3 border-b border-border">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="flex flex-col space-y-1 leading-none min-w-0">
                            <p className="font-medium text-foreground truncate">{user.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
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
          <div className="flex-1 p-4 lg:p-6 min-w-0 overflow-x-hidden">
            <div className="animate-fade-in max-w-full">
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
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, id: 'dashboard', showFor: ['admin', 'manager'], color: 'text-primary' },
    { name: 'Employees', href: '/employees', icon: Users, id: 'employees', showFor: ['admin', 'manager'], color: 'text-secondary' },
    { name: 'Departments', href: '/departments', icon: Briefcase, id: 'departments', showFor: ['admin', 'manager'], color: 'text-purple-500' },
    { name: 'Leave Requests', href: '/leave-requests', icon: Calendar, id: 'leave-requests', showFor: ['admin', 'manager'], color: 'text-orange-500' },
    { name: 'Remote Work', href: '/remote-requests', icon: MapPin, id: 'remote-requests', showFor: ['admin', 'manager'], color: 'text-secondary' },
    { name: 'Reports', href: '/reports', icon: BarChart, id: 'reports', showFor: ['admin', 'manager'], color: 'text-primary' },
    { name: 'User Management', href: '/user-management', icon: Key, id: 'user-management', showFor: ['admin'], color: 'text-destructive' },
    { name: 'Settings', href: '/settings', icon: Settings, id: 'settings', showFor: ['admin', 'manager'], color: 'text-muted-foreground' },
    { name: 'Employee Portal', href: '/employee-portal', icon: User, id: 'employee-portal', showFor: ['employee'], color: 'text-primary' },
    { name: 'Holidays', href: '/holidays', icon: Calendar, id: 'holidays', showFor: ['admin', 'manager', 'employee'], color: 'text-secondary' },
    { name: 'Templates', href: '/templates', icon: FileText, id: 'templates', showFor: ['admin', 'manager'], color: 'text-amber-600' },
    { name: 'Doc Requests', href: '/document-requests', icon: FileText, id: 'document-requests', showFor: ['admin', 'manager', 'employee'], color: 'text-secondary' },
  ];

  // Filter navigation items based on user role
  const filteredNavigation = navigation.filter(item => {
    if (!user || !user.role) return false;
    return item.showFor.includes(user.role);
  });

  const handleNavigate = (href: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    navigate(href);
  };

  return (
    <Sidebar className="border-r border-border bg-white/95 backdrop-blur-md shadow-lg">
      <SidebarHeader className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-xl text-primary truncate">
              HR Manager
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">Professional Edition</p>
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
                  group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:shadow-md cursor-pointer
                  ${activePage === item.id 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'hover:bg-accent text-foreground hover:text-accent-foreground'
                  }
                `}
              >
                <button 
                  onClick={(e) => handleNavigate(item.href, e)}
                  className="flex items-center gap-3 w-full text-left"
                >
                  <item.icon 
                    size={20} 
                    className={activePage === item.id ? 'text-primary-foreground' : item.color}
                  />
                  <span className="font-medium text-sm truncate">{item.name}</span>
                  {activePage === item.id && (
                    <div className="absolute inset-y-0 right-2 flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground opacity-75"></div>
                    </div>
                  )}
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-accent">
          <div className="rounded-full bg-primary h-9 w-9 flex items-center justify-center shadow-md flex-shrink-0">
            <span className="text-primary-foreground text-sm font-medium">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          <div className="text-sm flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{user?.name}</p>
            <p className="text-muted-foreground text-xs truncate">{user?.email}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
