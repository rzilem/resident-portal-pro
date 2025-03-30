
import * as React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: User:', user);
  console.log('ProtectedRoute: Loading:', loading);
  console.log('ProtectedRoute: Current location:', location.pathname);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('ProtectedRoute: Redirecting to /login from:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
