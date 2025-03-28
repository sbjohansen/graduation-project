import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // For non-admin routes, allow access if authenticated
  if (!requireAdmin) {
    return <>{children}</>;
  }

  // For admin routes, verify admin status
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Allow access
  return <>{children}</>;
};
