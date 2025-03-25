import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider';

// Import pages
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Profile from '@/pages/Profile';
import Association from '@/pages/Association';
import Directory from '@/pages/Directory';
import Documents from '@/pages/Documents';
import Financials from '@/pages/Financials';
import Communications from '@/pages/Communications';
import Notices from '@/pages/Notices';
import Meetings from '@/pages/Meetings';
import Tasks from '@/pages/Tasks';
import Calendar from '@/pages/Calendar';
import Chat from '@/pages/Chat';
import Support from '@/pages/Support';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import AssociationDashboard from '@/pages/AssociationDashboard';
import PublicPage from '@/pages/PublicPage';

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
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/association" element={<Association />} />
            <Route path="/association/:associationId" element={<AssociationDashboard />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/financials" element={<Financials />} />
            <Route path="/communications" element={<Communications />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/support" element={<Support />} />
            <Route path="/public" element={<PublicPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
