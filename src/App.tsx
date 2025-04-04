
import * as React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import AssociationProfile from '@/pages/AssociationProfile';
import Calendar from '@/pages/Calendar';
import LetterTemplates from '@/pages/letter-templates/LetterTemplates';
import OperationsDashboard from '@/pages/operations/Dashboard';

// Lead Management Pages
import LeadsManagement from '@/pages/leads/LeadsManagement';
import ProposalCreator from '@/pages/leads/ProposalCreator';
import ProposalViewer from '@/pages/leads/ProposalViewer';
import OnboardingWizard from '@/pages/leads/OnboardingWizard';

import AccountingDashboard from '@/pages/accounting/AccountingDashboard';
import InvoiceQueue from '@/pages/accounting/InvoiceQueue';
import InvoiceCoding from '@/pages/accounting/InvoiceCoding';
import Transactions from '@/pages/accounting/Transactions';
import Payments from '@/pages/accounting/Payments';
import JournalEntries from '@/pages/accounting/JournalEntries';
import GlAccounts from '@/pages/accounting/GlAccounts';
import AccountingReports from '@/pages/accounting/AccountingReports';
import BudgetPlanning from '@/pages/accounting/BudgetPlanning';

import Workflows from '@/pages/Workflows';
import PrintQueue from '@/pages/PrintQueue';
import CommunityMessaging from '@/pages/communications/CommunityMessaging';
import Announcements from '@/pages/communications/Announcements';

import Settings from '@/pages/Settings';
import Integrations from '@/pages/Integrations';
import SystemUploads from '@/pages/SystemUploads';
import EmailWorkflows from '@/pages/settings/EmailWorkflows';
import Associations from '@/pages/settings/Associations';
import Permissions from '@/pages/settings/Permissions';
import ProcessScheduler from '@/pages/system/ProcessScheduler';
import Records from '@/pages/database/Records';
import Reports from '@/pages/Reports';
import ResaleDashboard from '@/pages/resale/ResaleDashboard';
import ResaleWizard from '@/pages/resale/wizard/ResaleWizard';
import BidRequestWizard from '@/pages/resale/wizard/BidRequestWizard';
import BidRequests from '@/pages/resale/BidRequests';
import BidRequestDetail from '@/pages/resale/BidRequestDetail';
import Vendors from '@/pages/vendors/Vendors';
import VendorProfile from '@/pages/vendors/VendorProfile';

import { accountingRoutes } from './routes/accountingRoutes';
import { communicationRoutes } from './routes/communicationRoutes';
import { reportsRoutes } from './routes/reportsRoutes';

const LogoutRedirect = () => {
  const { handleLogout } = useLogout();
  
  React.useEffect(() => {
    handleLogout();
  }, [handleLogout]);
  
  return <Navigate to="/login" />;
};

function ScrollToTop() {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

const App = () => {
  const AppRoutes = () => {
    const location = useLocation();
    
    React.useEffect(() => {
      console.log('Current location:', location.pathname);
    }, [location]);

    return (
      <Routes>
        <Route path="/" element={<Index />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<LogoutRedirect />} />
        
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/simple-dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadDocument />} />
          <Route path="/hoa/dashboard" element={<HoaDashboard />} />
          <Route path="/hoa/finances" element={<HoaFinances />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<Properties />} />
          <Route path="/associations/:id" element={<AssociationProfile />} />
          <Route path="/residents" element={<Residents />} />
          <Route path="/resident/:id" element={<ResidentProfile />} />
          <Route path="/compliance" element={<Compliance />} />
          
          <Route path="/documents/association" element={<AssociationDocuments />} />
          
          {accountingRoutes.map((route, index) => (
            <Route key={`accounting-route-${index}`} path={route.path} element={route.element} />
          ))}
          
          <Route path="/calendar" element={<Calendar />} />
          
          {communicationRoutes.map((route, index) => (
            <Route key={`communication-route-${index}`} path={route.path} element={route.element} />
          ))}

          {/* Lead Management Routes */}
          <Route path="/leads" element={<LeadsManagement />} />
          <Route path="/leads/onboarding" element={<OnboardingWizard />} />
          <Route path="/leads/onboarding/:projectId" element={<OnboardingWizard />} />
          <Route path="/leads/proposal-creator" element={<ProposalCreator />} />
          <Route path="/proposal/:id" element={<ProposalViewer />} />
          
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/print-queue" element={<PrintQueue />} />
          
          <Route path="/letter-templates" element={<LetterTemplates />} />
          
          {/* Operations Routes */}
          <Route path="/operations/dashboard" element={<OperationsDashboard />} />
          
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/:id" element={<VendorProfile />} />
          
          <Route path="/database/records" element={<Records />} />
          
          {/* Reports Routes */}
          {reportsRoutes.map((route, index) => (
            <Route key={`report-route-${index}`} path={route.path} element={route.element} />
          ))}
          
          <Route path="/resale" element={<ResaleDashboard />} />
          <Route path="/resale/certificate" element={<ResaleDashboard />} />
          <Route path="/resale/questionnaire" element={<ResaleDashboard />} />
          <Route path="/resale/inspection" element={<ResaleDashboard />} />
          <Route path="/resale/statements" element={<ResaleDashboard />} />
          <Route path="/resale/trec-forms" element={<ResaleDashboard />} />
          <Route path="/resale/queue" element={<ResaleDashboard />} />
          <Route path="/resale/wizard" element={<ResaleWizard />} />
          
          <Route path="/resale/bid-request" element={<BidRequestWizard />} />
          <Route path="/resale/bid-requests" element={<BidRequests />} />
          <Route path="/resale/bid-requests/:id" element={<BidRequestDetail />} />
          <Route path="/resale/admin/project-images" element={<div>Project Images Page</div>} />
          
          <Route path="/system/processes" element={<ProcessScheduler />} />
          
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/associations" element={<Associations />} />
          <Route path="/settings/permissions" element={<Permissions />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/email-workflows" element={<EmailWorkflows />} />
          <Route path="/system-uploads" element={<SystemUploads />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <DocumentStorageInitializer />
        <ScrollToTop />
        <Toaster />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
