
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserProvider } from '@/contexts/UserContext';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/settings/Settings';
import Login from '@/pages/Login';
import UserProfile from '@/pages/UserProfile';
import Transactions from '@/pages/accounting/Transactions';
import Payments from '@/pages/accounting/Payments';
import Compliance from '@/pages/compliance/Compliance';
import Finances from '@/pages/hoa/Finances';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="settings/*" element={<Settings />} />
              <Route path="profile" element={<UserProfile />} />
              
              {/* Financial Management Routes */}
              <Route path="financial">
                <Route path="transactions" element={<Transactions />} />
                <Route path="payments" element={<Payments />} />
                <Route path="finances" element={<Finances />} />
              </Route>
              
              {/* Compliance Management Routes - now under Community Management */}
              <Route path="compliance" element={<Compliance />} />
              
              <Route path="*" element={<div>Not Found</div>} />
            </Route>
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
