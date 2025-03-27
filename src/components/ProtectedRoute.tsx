// src/components/ProtectedRoute.tsx
import React, { useContext, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('AuthContext must be used within an AuthProvider');
  }

  const { user, loading } = context;
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
