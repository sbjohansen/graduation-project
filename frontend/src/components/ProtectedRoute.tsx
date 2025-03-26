import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ReactNode, useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requireAdmin = false 
}: ProtectedRouteProps) => {
  const { isAuthenticated, checkAdminStatus } = useAuth();
  const [loading, setLoading] = useState<boolean>(requireAdmin);
  const [hasAdminAccess, setHasAdminAccess] = useState<boolean>(false);
  
  useEffect(() => {
    const verifyAdmin = async () => {
      if (requireAdmin && isAuthenticated) {
        setLoading(true);
        try {
          const adminVerified = await checkAdminStatus();
          setHasAdminAccess(adminVerified);
        } catch (error) {
          console.error("Error verifying admin status:", error);
          setHasAdminAccess(false);
        } finally {
          setLoading(false);
        }
      }
    };
    
    verifyAdmin();
  }, [requireAdmin, isAuthenticated, checkAdminStatus]);
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  // For non-admin routes, allow access if authenticated
  if (!requireAdmin) {
    return <>{children}</>;
  }
  
  // If loading admin check, show loading indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Verifying admin access...</p>
      </div>
    );
  }
  
  // For admin routes, verify server-side admin status
  if (requireAdmin && !hasAdminAccess) {
    return <Navigate to="/" replace />;
  }
  
  // Allow access
  return <>{children}</>;
}; 