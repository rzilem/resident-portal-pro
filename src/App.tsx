
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
import Transactions from "./pages/accounting/Transactions";
import Reports from "./pages/accounting/Reports";
import Announcements from "./pages/communications/Announcements";
import Records from "./pages/database/Records";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";

const queryClient = new QueryClient();

// Protection wrapper for authenticated routes
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
          
          {/* Protected Routes */}
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
          
          {/* Accounting Routes */}
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
          
          {/* Communications Routes */}
          <Route path="/communications/announcements" element={
            <ProtectedRoute title="Announcements">
              <Announcements />
            </ProtectedRoute>
          } />
          
          {/* Database Routes */}
          <Route path="/database/records" element={
            <ProtectedRoute title="Records">
              <Records />
            </ProtectedRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
