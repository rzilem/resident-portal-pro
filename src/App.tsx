
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
import AssociationDocuments from '@/pages/documents/AssociationDocuments';

import AccountingDashboard from '@/pages/accounting/AccountingDashboard';
import InvoiceQueue from '@/pages/accounting/InvoiceQueue';
import Transactions from '@/pages/accounting/Transactions';
import Payments from '@/pages/accounting/Payments';
import JournalEntries from '@/pages/accounting/JournalEntries';
import GlAccounts from '@/pages/accounting/GlAccounts';
import AccountingReports from '@/pages/accounting/AccountingReports';

import Workflows from '@/pages/Workflows';
import PrintQueue from '@/pages/PrintQueue';
import CommunityMessaging from '@/pages/communications/CommunityMessaging';

import Settings from '@/pages/Settings';
import Integrations from '@/pages/Integrations';
import SystemUploads from '@/pages/SystemUploads';
import EmailWorkflows from '@/pages/settings/EmailWorkflows';
import Associations from '@/pages/settings/Associations';
import Permissions from '@/pages/settings/Permissions';
import Records from '@/pages/database/Records';
import Reports from '@/pages/Reports';
import ResaleDashboard from '@/pages/resale/ResaleDashboard';
import ResaleWizard from '@/pages/resale/wizard/ResaleWizard';

const LogoutRedirect = () => {
  const { handleLogout } = useLogout();
  
  React.useEffect(() => {
    handleLogout();
  }, [handleLogout]);
  
  return <Navigate to="/login" />;
};

const App = () => {
  const location = useLocation();
  
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
          
          <Route path="/documents/association" element={<AssociationDocuments />} />
          
          <Route path="/accounting/dashboard" element={<AccountingDashboard />} />
          <Route path="/accounting/invoice-queue" element={<InvoiceQueue />} />
          <Route path="/accounting/transactions" element={<Transactions />} />
          <Route path="/accounting/payments" element={<Payments />} />
          <Route path="/accounting/journal-entries" element={<JournalEntries />} />
          <Route path="/accounting/gl-accounts" element={<GlAccounts />} />
          <Route path="/accounting/reports" element={<AccountingReports />} />
          
          <Route path="/calendar" element={<div>Calendar Page</div>} />
          <Route path="/communications/messaging" element={<CommunityMessaging />} />
          <Route path="/communications/announcements" element={<div>Announcements Page</div>} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/print-queue" element={<PrintQueue />} />
          
          {/* Database Records Page */}
          <Route path="/database/records" element={<Records />} />
          
          {/* Reports Page */}
          <Route path="/reports" element={<Reports />} />
          
          {/* Resale Management Routes */}
          <Route path="/resale" element={<ResaleDashboard />} />
          <Route path="/resale/certificate" element={<ResaleDashboard />} />
          <Route path="/resale/questionnaire" element={<ResaleDashboard />} />
          <Route path="/resale/inspection" element={<ResaleDashboard />} />
          <Route path="/resale/statements" element={<ResaleDashboard />} />
          <Route path="/resale/trec-forms" element={<ResaleDashboard />} />
          <Route path="/resale/wizard" element={<ResaleWizard />} />
          
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/associations" element={<Associations />} />
          <Route path="/settings/permissions" element={<Permissions />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/email-workflows" element={<EmailWorkflows />} />
          <Route path="/system-uploads" element={<SystemUploads />} />
        </Route>

        <Route path="/" element={<Index />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
