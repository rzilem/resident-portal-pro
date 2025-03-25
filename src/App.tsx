
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Properties from '@/pages/Properties';
import Residents from '@/pages/Residents';
import ResidentProfile from '@/pages/ResidentProfile';
import Calendar from '@/pages/Calendar';
import Integrations from '@/pages/Integrations';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import Workflows from '@/pages/Workflows';
import CommunityHub from '@/pages/CommunityHub';
import NotFound from '@/pages/NotFound';

// Accounting pages
import AccountingDashboard from '@/pages/accounting/AccountingDashboard';
import Transactions from '@/pages/accounting/Transactions';
import Payments from '@/pages/accounting/Payments';
import AccountingReports from '@/pages/accounting/AccountingReports';
import JournalEntries from '@/pages/accounting/JournalEntries';

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

const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/residents" element={<Residents />} />
        <Route path="/resident/:id" element={<ResidentProfile />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/workflows" element={<Workflows />} />
        <Route path="/community-hub" element={<CommunityHub />} />
        
        {/* Accounting routes */}
        <Route path="/accounting/dashboard" element={<AccountingDashboard />} />
        <Route path="/accounting/transactions" element={<Transactions />} />
        <Route path="/accounting/payments" element={<Payments />} />
        <Route path="/accounting/reports" element={<AccountingReports />} />
        <Route path="/accounting/journal-entries" element={<JournalEntries />} />
        
        {/* Communications routes */}
        <Route path="/communications/messaging" element={<CommunityMessaging />} />
        <Route path="/communications/announcements" element={<Announcements />} />
        
        {/* Database routes */}
        <Route path="/database/records" element={<Records />} />
        
        {/* Document routes */}
        <Route path="/documents/association" element={<AssociationDocuments />} />
        <Route path="/documents/templates" element={<DocumentTemplates />} />
        
        {/* Settings routes */}
        <Route path="/settings/permissions" element={<Permissions />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
