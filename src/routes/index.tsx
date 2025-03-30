
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import Index from '../pages/Index';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import AccountingDashboard from '../pages/accounting/AccountingDashboard';
import InvoiceQueue from '../pages/accounting/InvoiceQueue';
import Transactions from '../pages/accounting/Transactions';
import Payments from '../pages/accounting/Payments';
import JournalEntries from '../pages/accounting/JournalEntries';
import GlAccounts from '../pages/accounting/GlAccounts';
import AccountingReports from '../pages/accounting/AccountingReports';
import CommunityMessaging from '../pages/communications/CommunityMessaging';
import Records from '../pages/database/Records';
import AssociationDocuments from '../pages/documents/AssociationDocuments';
import HoaDashboard from '../pages/hoa/Dashboard';
import HoaFinances from '../pages/hoa/Finances';
import Members from '../pages/hoa/Members';
import ResaleDashboard from '../pages/resale/ResaleDashboard';
import ResaleWizard from '../pages/resale/wizard/ResaleWizard';
import BidRequestWizard from '../pages/resale/wizard/BidRequestWizard';
import BidRequests from '../pages/resale/BidRequests';
import BidRequestDetail from '../pages/resale/BidRequestDetail';
import ProjectImagesPage from '../pages/resale/admin/ProjectImages';
import Settings from '../pages/Settings';
import Associations from '../pages/settings/Associations';
import Permissions from '../pages/settings/Permissions';
import EmailWorkflows from '../pages/settings/EmailWorkflows';
import Vendors from '../pages/vendors/Vendors';
import VendorProfile from '../pages/vendors/VendorProfile';
import Residents from '../pages/Residents';
import ResidentProfile from '../pages/ResidentProfile';

// RouterConfig component that uses BrowserRouter instead of RouterProvider
const RouterConfig = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        
        {/* Main Route */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* Accounting Routes */}
        <Route path="/accounting/dashboard" element={<ProtectedRoute><AccountingDashboard /></ProtectedRoute>} />
        <Route path="/accounting/invoice-queue" element={<ProtectedRoute><InvoiceQueue /></ProtectedRoute>} />
        <Route path="/accounting/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/accounting/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
        <Route path="/accounting/journal-entries" element={<ProtectedRoute><JournalEntries /></ProtectedRoute>} />
        <Route path="/accounting/gl-accounts" element={<ProtectedRoute><GlAccounts /></ProtectedRoute>} />
        <Route path="/accounting/reports" element={<ProtectedRoute><AccountingReports /></ProtectedRoute>} />
        
        {/* Communication Routes */}
        <Route path="/communications/messaging" element={<ProtectedRoute><CommunityMessaging /></ProtectedRoute>} />
        <Route path="/communications/announcements" element={<ProtectedRoute><div>Announcements Page</div></ProtectedRoute>} />
        
        {/* Database Routes */}
        <Route path="/database/records" element={<ProtectedRoute><Records /></ProtectedRoute>} />
        
        {/* Document Routes */}
        <Route path="/documents/association" element={<ProtectedRoute><AssociationDocuments /></ProtectedRoute>} />
        
        {/* HOA Routes */}
        <Route path="/hoa/dashboard" element={<ProtectedRoute><HoaDashboard /></ProtectedRoute>} />
        <Route path="/hoa/finances" element={<ProtectedRoute><HoaFinances /></ProtectedRoute>} />
        <Route path="/hoa/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
        
        {/* Resale Routes */}
        <Route path="/resale" element={<ProtectedRoute><ResaleDashboard /></ProtectedRoute>} />
        <Route path="/resale/wizard" element={<ProtectedRoute><ResaleWizard /></ProtectedRoute>} />
        <Route path="/resale/certificate" element={<ProtectedRoute><ResaleDashboard /></ProtectedRoute>} />
        <Route path="/resale/questionnaire" element={<ProtectedRoute><ResaleDashboard /></ProtectedRoute>} />
        <Route path="/resale/inspection" element={<ProtectedRoute><ResaleDashboard /></ProtectedRoute>} />
        <Route path="/resale/statements" element={<ProtectedRoute><ResaleDashboard /></ProtectedRoute>} />
        <Route path="/resale/trec-forms" element={<ProtectedRoute><ResaleDashboard /></ProtectedRoute>} />
        <Route path="/resale/bid-request" element={<ProtectedRoute><BidRequestWizard /></ProtectedRoute>} />
        <Route path="/resale/bid-requests" element={<ProtectedRoute><BidRequests /></ProtectedRoute>} />
        <Route path="/resale/bid-requests/:id" element={<ProtectedRoute><BidRequestDetail /></ProtectedRoute>} />
        <Route path="/resale/admin/project-images" element={<ProtectedRoute><ProjectImagesPage /></ProtectedRoute>} />
        
        {/* Settings Routes */}
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/settings/associations" element={<ProtectedRoute><Associations /></ProtectedRoute>} />
        <Route path="/settings/permissions" element={<ProtectedRoute><Permissions /></ProtectedRoute>} />
        <Route path="/email-workflows" element={<ProtectedRoute><EmailWorkflows /></ProtectedRoute>} />
        
        {/* Vendor Routes */}
        <Route path="/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
        <Route path="/vendors/:id" element={<ProtectedRoute><VendorProfile /></ProtectedRoute>} />
        
        {/* Resident Routes */}
        <Route path="/residents" element={<ProtectedRoute><Residents /></ProtectedRoute>} />
        <Route path="/residents/:id" element={<ProtectedRoute><ResidentProfile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterConfig;
