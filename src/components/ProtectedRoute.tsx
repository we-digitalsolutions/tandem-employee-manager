
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to={`/login`} state={{ from: location }} replace />;
  }

  // For admin/manager dashboard access control
  if (location.pathname !== '/employee-portal' && user?.role === 'employee') {
    // Employees should only access employee portal
    return <Navigate to="/employee-portal" replace />;
  }

  // For employee portal access control
  if (location.pathname === '/employee-portal' && user?.role !== 'employee') {
    // Admin/managers should access the main dashboard
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
