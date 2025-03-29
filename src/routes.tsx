
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
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
      {
        path: '/settings',
        element: (
          <ProtectedRoute>
            <Settings />
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
    ],
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
