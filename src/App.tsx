
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import DocumentStorageInitializer from '@/components/documents/DocumentStorageInitializer';
import { useLogout } from '@/hooks/use-logout';

import Index from '@/pages/Index';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import UploadDocument from '@/components/UploadDocument';
import Properties from '@/pages/Properties';
import Residents from '@/pages/Residents';
import ResidentProfile from '@/pages/ResidentProfile';
import HoaDashboard from '@/pages/hoa/Dashboard';
import HoaFinances from '@/pages/hoa/Finances';

const LogoutRedirect = () => {
  const { handleLogout } = useLogout();
  
  React.useEffect(() => {
    handleLogout();
  }, [handleLogout]);
  
  return <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <DocumentStorageInitializer />
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<LogoutRedirect />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        {/* Make /simple-dashboard redirect to /dashboard for consistency */}
        <Route
          path="/simple-dashboard"
          element={<Navigate to="/dashboard" replace />}
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadDocument />
            </ProtectedRoute>
          }
        />

        <Route path="/hoa/dashboard" element={
          <ProtectedRoute>
            <HoaDashboard />
          </ProtectedRoute>
        } />
        <Route path="/hoa/finances" element={
          <ProtectedRoute>
            <HoaFinances />
          </ProtectedRoute>
        } />

        <Route path="/properties" element={
          <ProtectedRoute>
            <Properties />
          </ProtectedRoute>
        } />
        <Route path="/residents" element={
          <ProtectedRoute>
            <Residents />
          </ProtectedRoute>
        } />
        <Route path="/residents/:id" element={
          <ProtectedRoute>
            <ResidentProfile />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Index />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
