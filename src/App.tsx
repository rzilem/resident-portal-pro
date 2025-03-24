
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Residents from "./pages/Residents";
import ResidentProfile from "./pages/ResidentProfile";
import Transactions from "./pages/accounting/Transactions";
import Reports from "./pages/accounting/Reports";
import Payments from "./pages/accounting/Payments";
import AccountingDashboard from "./pages/accounting/AccountingDashboard";
import Announcements from "./pages/communications/Announcements";
import Records from "./pages/database/Records";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";

// Import settings subpages
import CompanyInfo from "./components/settings/company/CompanyInfo";
import GlAccounts from "./components/settings/financial/GlAccounts";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, title }: { children: React.ReactNode, title?: string }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <DashboardLayout title={title}>
      {children}
    </DashboardLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute title="Dashboard">
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/properties" element={
            <ProtectedRoute title="Properties">
              <Properties />
            </ProtectedRoute>
          } />
          <Route path="/residents" element={
            <ProtectedRoute title="Residents">
              <Residents />
            </ProtectedRoute>
          } />
          <Route path="/residents/:id" element={
            <ProtectedRoute title="Resident Profile">
              <ResidentProfile />
            </ProtectedRoute>
          } />
          
          <Route path="/accounting" element={
            <ProtectedRoute title="Accounting Dashboard">
              <AccountingDashboard />
            </ProtectedRoute>
          } />
          <Route path="/accounting/transactions" element={
            <ProtectedRoute title="Transactions">
              <Transactions />
            </ProtectedRoute>
          } />
          <Route path="/accounting/reports" element={
            <ProtectedRoute title="Reports">
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/accounting/payments" element={
            <ProtectedRoute title="Payments">
              <Payments />
            </ProtectedRoute>
          } />
          
          <Route path="/communications/announcements" element={
            <ProtectedRoute title="Announcements">
              <Announcements />
            </ProtectedRoute>
          } />
          
          <Route path="/database/records" element={
            <ProtectedRoute title="Records">
              <Records />
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute title="Settings">
              <Settings />
            </ProtectedRoute>
          } />
          
          {/* Settings subpages */}
          <Route path="/settings/associations/company-info" element={
            <ProtectedRoute title="Company Information">
              <CompanyInfo />
            </ProtectedRoute>
          } />
          
          <Route path="/settings/associations/gl-accounts" element={
            <ProtectedRoute title="GL Accounts">
              <GlAccounts />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
