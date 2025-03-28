
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth/AuthProvider';
import DocumentStorageInitializer from '@/components/documents/DocumentStorageInitializer';
import { useLogout } from '@/hooks/use-logout';

import Index from '@/pages/Index';
import Login from '@/components/Login';
import Dashboard from '@/pages/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import UploadDocument from '@/components/UploadDocument';
import Properties from '@/pages/Properties';
import Residents from '@/pages/Residents';
import ResidentProfile from '@/pages/ResidentProfile';
import HoaDashboard from '@/pages/hoa/Dashboard';
import HoaFinances from '@/pages/hoa/Finances';
import DashboardLayout from '@/components/DashboardLayout';
import Compliance from '@/pages/compliance/Compliance';

// Import accounting pages
import AccountingDashboard from '@/pages/accounting/AccountingDashboard';
import InvoiceQueue from '@/pages/accounting/InvoiceQueue';
import Transactions from '@/pages/accounting/Transactions';
import Payments from '@/pages/accounting/Payments';
import JournalEntries from '@/pages/accounting/JournalEntries';
import GlAccounts from '@/pages/accounting/GlAccounts';
import AccountingReports from '@/pages/accounting/AccountingReports';

const LogoutRedirect = () => {
  const { handleLogout } = useLogout();
  
  React.useEffect(() => {
    handleLogout();
  }, [handleLogout]);
  
  return <Navigate to="/login" />;
};

const App = () => {
  const location = useLocation();
  
  // Log the current path for debugging
  React.useEffect(() => {
    console.log('Current location:', location.pathname);
  }, [location]);

  return (
    <AuthProvider>
      <DocumentStorageInitializer />
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<LogoutRedirect />} />
        
        {/* Protected routes with DashboardLayout */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/simple-dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadDocument />} />
          <Route path="/hoa/dashboard" element={<HoaDashboard />} />
          <Route path="/hoa/finances" element={<HoaFinances />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<Properties />} />
          <Route path="/residents" element={<Residents />} />
          <Route path="/residents/:id" element={<ResidentProfile />} />
          <Route path="/compliance" element={<Compliance />} />
          
          {/* Accounting routes */}
          <Route path="/accounting/dashboard" element={<AccountingDashboard />} />
          <Route path="/accounting/invoice-queue" element={<InvoiceQueue />} />
          <Route path="/accounting/transactions" element={<Transactions />} />
          <Route path="/accounting/payments" element={<Payments />} />
          <Route path="/accounting/journal-entries" element={<JournalEntries />} />
          <Route path="/accounting/gl-accounts" element={<GlAccounts />} />
          <Route path="/accounting/reports" element={<AccountingReports />} />
        </Route>

        <Route path="/" element={<Index />} />
        
        {/* Handle unknown routes by redirecting to Index page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
