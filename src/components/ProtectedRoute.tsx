
import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: User:', user);
  console.log('ProtectedRoute: Loading:', isLoading);
  console.log('ProtectedRoute: Current location:', location.pathname);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('ProtectedRoute: Redirecting to /login from:', location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
