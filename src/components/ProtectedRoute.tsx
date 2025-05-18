
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

  // For employee portal access control
  if (location.pathname === '/employee-portal' && user?.role === 'admin') {
    return <Navigate to="/" replace />;
  }

  // For admin dashboard access control
  if (location.pathname !== '/employee-portal' && user?.role === 'employee') {
    return <Navigate to="/employee-portal" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
