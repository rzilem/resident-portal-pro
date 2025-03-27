// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext'; // Import AuthProvider
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
import HoaDashboard from '@/pages/HoaDashboard';
import HoaFinances from '@/pages/HoaFinances';

const LogoutRedirect = () => {
  const logout = useLogout();
  React.useEffect(() => {
    logout();
  }, [logout]);
  return <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider> {/* Wrap the app in AuthProvider */}
      <DocumentStorageInitializer />
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<LogoutRedirect />} />

        {/* New simple dashboard and upload routes */}
        <Route
          path="/simple-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <UploadDocument />
            </ProtectedRoute>
          }
        />

        {/* HOA routes with their own layout */}
        <Route path="/hoa/dashboard" element={<HoaDashboard />} />
        <Route path="/hoa/finances" element={<HoaFinances />} />

        {/* Other existing routes */}
        <Route path="/properties" element={<Properties />} />
        <Route path="/residents" element={<Residents />} />
        <Route path="/residents/:id" element={<ResidentProfile />} />
        <Route path="/" element={<Index />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
