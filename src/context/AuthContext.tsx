
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContextType, User } from '@/types';
import { toast } from '@/components/ui/sonner';

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: 'admin1',
    name: 'HR Admin',
    email: 'admin@hrmanager.com',
    role: 'admin',
    department: 'HR',
    permissions: ['all'],
    password: 'admin123'
  },
  {
    id: 'manager1',
    name: 'Department Manager',
    email: 'manager@hrmanager.com',
    role: 'manager',
    department: 'Operations',
    permissions: ['manage-team'],
    password: 'manager123'
  },
  {
    id: 'emp1',
    name: 'John Employee',
    email: 'john@example.com',
    role: 'employee',
    department: 'Engineering',
    permissions: ['view-own'],
    password: 'password123'
  },
  {
    id: 'emp2',
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    role: 'employee',
    department: 'Marketing',
    permissions: ['view-own'],
    password: 'password123'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('hrm_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('hrm_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Store user in state
      setUser(user);
      
      // Store in localStorage for persistence (not secure for production)
      localStorage.setItem('hrm_user', JSON.stringify(user));
      
      toast.success(`Welcome back, ${user.name}!`);
      return true;
    } else {
      toast.error('Invalid email or password');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hrm_user');
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
