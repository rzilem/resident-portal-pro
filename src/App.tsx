
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import DashboardLayout from '@/components/DashboardLayout';

import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Properties from '@/pages/Properties';
import Residents from '@/pages/Residents';
import ResidentProfile from '@/pages/ResidentProfile';
import AssociationProfile from '@/pages/AssociationProfile'; 
import Calendar from '@/pages/Calendar';
import Integrations from '@/pages/Integrations';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import Workflows from '@/pages/Workflows';
import CommunityHub from '@/pages/CommunityHub';
import NotFound from '@/pages/NotFound';
import Compliance from '@/pages/compliance/Compliance';
import SystemUploads from '@/pages/SystemUploads';

// Vendor pages
import Vendors from '@/pages/vendors/Vendors';
import VendorProfile from '@/pages/vendors/VendorProfile';

// Accounting pages
import AccountingDashboard from '@/pages/accounting/AccountingDashboard';
import Transactions from '@/pages/accounting/Transactions';
import Payments from '@/pages/accounting/Payments';
import AccountingReports from '@/pages/accounting/AccountingReports';
import JournalEntries from '@/pages/accounting/JournalEntries';
import GlAccounts from '@/pages/accounting/GlAccounts';
import InvoiceCoding from './pages/accounting/InvoiceCoding';
import InvoiceQueue from './pages/accounting/InvoiceQueue';

// Communications pages
import CommunityMessaging from '@/pages/communications/CommunityMessaging';
import Announcements from '@/pages/communications/Announcements';

// Database pages
import Records from '@/pages/database/Records';

// Documents pages
import AssociationDocuments from '@/pages/documents/AssociationDocuments';
import DocumentTemplates from '@/pages/documents/DocumentTemplates';

// Settings pages
import Permissions from '@/pages/settings/Permissions';
import CalendarSettings from '@/components/settings/CalendarSettings'; 
import Associations from '@/pages/settings/Associations';

// HOA pages
import HoaDashboard from '@/pages/hoa/Dashboard';
import HoaFinances from '@/pages/hoa/Finances';
import HoaMaintenance from '@/pages/hoa/Maintenance';
import HoaMembers from '@/pages/hoa/Members';
import HoaEvents from '@/pages/hoa/Events';

// Add import for UserProfile component
import UserProfile from "./pages/profile/UserProfile";

// Add import for EmailWorkflows component
import EmailWorkflows from "./pages/settings/EmailWorkflows";

// Add import for PrintQueue component
import PrintQueue from "./pages/PrintQueue";

// Add import for Resale module
import ResaleDashboard from "@/pages/resale/ResaleDashboard";
import ResaleWizard from "@/pages/resale/wizard/ResaleWizard";

const App = () => {
  return (
    <>
      <Routes>
        {/* Public routes without dashboard layout */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        
        {/* HOA routes with their own layout */}
        <Route path="/hoa/dashboard" element={<HoaDashboard />} />
        <Route path="/hoa/finances" element={<HoaFinances />} />
        <Route path="/hoa/maintenance" element={<HoaMaintenance />} />
        <Route path="/hoa/members" element={<HoaMembers />} />
        <Route path="/hoa/events" element={<HoaEvents />} />
        
        {/* Dashboard layout for authenticated pages */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/residents" element={<Residents />} />
          <Route path="/residents/:id" element={<ResidentProfile />} />
          <Route path="/associations/:id" element={<AssociationProfile />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/calendar" element={<CalendarSettings />} />
          <Route path="/settings/permissions" element={<Permissions />} />
          <Route path="/settings/associations" element={<Associations />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/community-hub" element={<CommunityHub />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/system-uploads" element={<SystemUploads />} />
          <Route path="/print-queue" element={<PrintQueue />} />
          
          {/* Resale Module Routes */}
          <Route path="/resale" element={<ResaleDashboard />} />
          <Route path="/resale/wizard" element={<ResaleWizard />} />
          <Route path="/resale/certificate" element={<ResaleDashboard />} />
          <Route path="/resale/questionnaire" element={<ResaleDashboard />} />
          <Route path="/resale/inspection" element={<ResaleDashboard />} />
          <Route path="/resale/statements" element={<ResaleDashboard />} />
          <Route path="/resale/trec-forms" element={<ResaleDashboard />} />
          
          {/* Vendor routes */}
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/vendors/:id" element={<VendorProfile />} />
          
          {/* Accounting routes */}
          <Route path="/accounting/dashboard" element={<AccountingDashboard />} />
          <Route path="/accounting/transactions" element={<Transactions />} />
          <Route path="/accounting/payments" element={<Payments />} />
          <Route path="/accounting/reports" element={<AccountingReports />} />
          <Route path="/accounting/journal-entries" element={<JournalEntries />} />
          <Route path="/accounting/gl-accounts" element={<GlAccounts />} />
          <Route path="/accounting/invoice-coding" element={<InvoiceCoding />} />
          <Route path="/accounting/invoice-queue" element={<InvoiceQueue />} />
          
          {/* Communications routes */}
          <Route path="/communications/messaging" element={<CommunityMessaging />} />
          <Route path="/communications/announcements" element={<Announcements />} />
          
          {/* Database routes */}
          <Route path="/database/records" element={<Records />} />
          
          {/* Document routes */}
          <Route path="/documents/association" element={<AssociationDocuments />} />
          <Route path="/documents/templates" element={<DocumentTemplates />} />
          
          {/* Email workflows route */}
          <Route path="/email-workflows" element={<EmailWorkflows />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;
