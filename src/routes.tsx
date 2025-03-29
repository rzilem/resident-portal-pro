import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Properties from './pages/Properties';
import Residents from './pages/Residents';
import ResidentProfile from './pages/ResidentProfile';
import Settings from './pages/Settings';
import ResaleWizard from './pages/resale/wizard/ResaleWizard';
import BidRequestWizard from './pages/resale/wizard/BidRequestWizard';
import BidRequests from './pages/resale/BidRequests';
import BidRequestDetail from './pages/resale/BidRequestDetail';
import ProtectedRoute from './components/ProtectedRoute';
import CommunityHub from './pages/CommunityHub';
import ResaleDashboard from './pages/resale/ResaleDashboard';
import ProjectImagesPage from './pages/resale/admin/ProjectImages';
import Index from './pages/Index';
import CommunityMessaging from './pages/communications/CommunityMessaging';
import HoaDashboard from './pages/hoa/Dashboard';
import HoaFinances from './pages/hoa/Finances';
import Compliance from './pages/compliance/Compliance';
import AssociationDocuments from './pages/documents/AssociationDocuments';
import Calendar from './pages/Calendar';
import AccountingDashboard from './pages/accounting/AccountingDashboard';
import InvoiceQueue from './pages/accounting/InvoiceQueue';
import Transactions from './pages/accounting/Transactions';
import Payments from './pages/accounting/Payments';
import JournalEntries from './pages/accounting/JournalEntries';
import GlAccounts from './pages/accounting/GlAccounts';
import AccountingReports from './pages/accounting/AccountingReports';
import Workflows from './pages/Workflows';
import PrintQueue from './pages/PrintQueue';
import Integrations from './pages/Integrations';
import SystemUploads from './pages/SystemUploads';
import EmailWorkflows from './pages/settings/EmailWorkflows';
import Associations from './pages/settings/Associations';
import Permissions from './pages/settings/Permissions';
import Records from './pages/database/Records';
import Reports from './pages/Reports';
import AssociationProfile from './pages/AssociationProfile';
import Vendors from './pages/vendors/Vendors';
import VendorProfile from './pages/vendors/VendorProfile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Index />,
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/simple-dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/properties',
        element: (
          <ProtectedRoute>
            <Properties />
          </ProtectedRoute>
        ),
      },
      {
        path: '/properties/:id',
        element: (
          <ProtectedRoute>
            <Properties />
          </ProtectedRoute>
        ),
      },
      {
        path: '/associations/:id',
        element: (
          <ProtectedRoute>
            <AssociationProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: '/residents',
        element: (
          <ProtectedRoute>
            <Residents />
          </ProtectedRoute>
        ),
      },
      {
        path: '/resident/:id',
        element: (
          <ProtectedRoute>
            <ResidentProfile />
          </ProtectedRoute>
        ),
      },
      // Also add a route for /residents/:id to handle legacy links
      {
        path: '/residents/:id',
        element: (
          <ProtectedRoute>
            <ResidentProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: '/settings',
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: '/settings/associations',
        element: (
          <ProtectedRoute>
            <Associations />
          </ProtectedRoute>
        ),
      },
      {
        path: '/settings/permissions',
        element: (
          <ProtectedRoute>
            <Permissions />
          </ProtectedRoute>
        ),
      },
      {
        path: '/community-hub',
        element: (
          <ProtectedRoute>
            <CommunityHub />
          </ProtectedRoute>
        ),
      },
      {
        path: '/compliance',
        element: (
          <ProtectedRoute>
            <Compliance />
          </ProtectedRoute>
        ),
      },
      {
        path: '/documents/association',
        element: (
          <ProtectedRoute>
            <AssociationDocuments />
          </ProtectedRoute>
        ),
      },
      {
        path: '/calendar',
        element: (
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        ),
      },
      {
        path: '/communications/messaging',
        element: (
          <ProtectedRoute>
            <CommunityMessaging />
          </ProtectedRoute>
        ),
      },
      {
        path: '/communications/announcements',
        element: (
          <ProtectedRoute>
            <div>Announcements Page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: '/workflows',
        element: (
          <ProtectedRoute>
            <Workflows />
          </ProtectedRoute>
        ),
      },
      {
        path: '/print-queue',
        element: (
          <ProtectedRoute>
            <PrintQueue />
          </ProtectedRoute>
        ),
      },
      {
        path: '/database/records',
        element: (
          <ProtectedRoute>
            <Records />
          </ProtectedRoute>
        ),
      },
      {
        path: '/reports',
        element: (
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        ),
      },
      {
        path: '/hoa/dashboard',
        element: (
          <ProtectedRoute>
            <HoaDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/hoa/finances',
        element: (
          <ProtectedRoute>
            <HoaFinances />
          </ProtectedRoute>
        ),
      },
      {
        path: '/accounting/dashboard',
        element: (
          <ProtectedRoute>
            <AccountingDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/accounting/invoice-queue',
        element: (
          <ProtectedRoute>
            <InvoiceQueue />
          </ProtectedRoute>
        ),
      },
      {
        path: '/accounting/transactions',
        element: (
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        ),
      },
      {
        path: '/accounting/payments',
        element: (
          <ProtectedRoute>
            <Payments />
          </ProtectedRoute>
        ),
      },
      {
        path: '/accounting/journal-entries',
        element: (
          <ProtectedRoute>
            <JournalEntries />
          </ProtectedRoute>
        ),
      },
      {
        path: '/accounting/gl-accounts',
        element: (
          <ProtectedRoute>
            <GlAccounts />
          </ProtectedRoute>
        ),
      },
      {
        path: '/accounting/reports',
        element: (
          <ProtectedRoute>
            <AccountingReports />
          </ProtectedRoute>
        ),
      },
      {
        path: '/integrations',
        element: (
          <ProtectedRoute>
            <Integrations />
          </ProtectedRoute>
        ),
      },
      {
        path: '/email-workflows',
        element: (
          <ProtectedRoute>
            <EmailWorkflows />
          </ProtectedRoute>
        ),
      },
      {
        path: '/system-uploads',
        element: (
          <ProtectedRoute>
            <SystemUploads />
          </ProtectedRoute>
        ),
      },
      {
        path: '/resale',
        element: (
          <ProtectedRoute>
            <ResaleDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/resale/wizard',
        element: (
          <ProtectedRoute>
            <ResaleWizard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/resale/certificate',
        element: (
          <ProtectedRoute>
            <ResaleDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/resale/questionnaire',
        element: (
          <ProtectedRoute>
            <ResaleDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/resale/inspection',
        element: (
          <ProtectedRoute>
            <ResaleDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/resale/statements',
        element: (
          <ProtectedRoute>
            <ResaleDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/resale/trec-forms',
        element: (
          <ProtectedRoute>
            <ResaleDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/resale/bid-request',
        element: (
          <ProtectedRoute>
            <BidRequestWizard />
          </ProtectedRoute>
        ),
      },
      {
        path: '/resale/bid-requests',
        element: (
          <ProtectedRoute>
            <BidRequests />
          </ProtectedRoute>
        ),
      },
      {
        path: '/resale/bid-requests/:id',
        element: (
          <ProtectedRoute>
            <BidRequestDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: '/resale/admin/project-images',
        element: (
          <ProtectedRoute>
            <ProjectImagesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/vendors',
        element: (
          <ProtectedRoute>
            <Vendors />
          </ProtectedRoute>
        ),
      },
      {
        path: '/vendors/:id',
        element: (
          <ProtectedRoute>
            <VendorProfile />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
