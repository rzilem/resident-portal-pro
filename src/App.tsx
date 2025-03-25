import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider';

// Import pages
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Calendar from '@/pages/Calendar';
import Index from '@/pages/Index';
import DashboardLayout from '@/components/DashboardLayout';
import CalendarSettings from '@/components/settings/CalendarSettings';
import Properties from '@/pages/Properties';
import Residents from '@/pages/Residents';
import AccountingDashboard from '@/pages/accounting/AccountingDashboard';
import Transactions from '@/pages/accounting/Transactions';
import AccountingReports from '@/pages/accounting/Reports';
import Payments from '@/pages/accounting/Payments';
import Announcements from '@/pages/communications/Announcements';
import CommunityMessaging from '@/pages/communications/CommunityMessaging';
import Workflows from '@/pages/Workflows';
import CommunityHub from '@/pages/CommunityHub';
import Reports from '@/pages/Reports';

// Configure react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Main navigation routes */}
            <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
            <Route path="/properties" element={<DashboardLayout><Properties /></DashboardLayout>} />
            <Route path="/residents" element={<DashboardLayout><Residents /></DashboardLayout>} />
            <Route path="/calendar" element={<DashboardLayout><Calendar /></DashboardLayout>} />
            <Route path="/reports" element={<DashboardLayout><Reports /></DashboardLayout>} />
            
            {/* Accounting routes */}
            <Route path="/accounting" element={<DashboardLayout><AccountingDashboard /></DashboardLayout>} />
            <Route path="/accounting/transactions" element={<DashboardLayout><Transactions /></DashboardLayout>} />
            <Route path="/accounting/reports" element={<DashboardLayout><AccountingReports /></DashboardLayout>} />
            <Route path="/accounting/payments" element={<DashboardLayout><Payments /></DashboardLayout>} />
            
            {/* Communications routes */}
            <Route path="/communications/announcements" element={<DashboardLayout><Announcements /></DashboardLayout>} />
            <Route path="/communications/messaging" element={<DashboardLayout><CommunityMessaging /></DashboardLayout>} />
            
            {/* Database/Records routes */}
            <Route path="/database/records" element={<DashboardLayout><NotFound /></DashboardLayout>} />
            <Route path="/database/templates" element={<DashboardLayout><NotFound /></DashboardLayout>} />
            
            {/* Other routes */}
            <Route path="/workflows" element={<DashboardLayout><Workflows /></DashboardLayout>} />
            <Route path="/chatbot" element={<DashboardLayout><CommunityHub /></DashboardLayout>} />
            
            {/* Settings routes */}
            <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
            <Route path="/settings/calendar" element={<DashboardLayout><CalendarSettings /></DashboardLayout>} />
            <Route path="/settings/permissions" element={<DashboardLayout><NotFound /></DashboardLayout>} />
            <Route path="/settings/integrations" element={<DashboardLayout><NotFound /></DashboardLayout>} />
            
            {/* Fallback routes */}
            <Route path="/home" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
