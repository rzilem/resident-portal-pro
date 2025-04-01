import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import Properties from '../pages/Properties';
import Residents from '../pages/Residents';
import ResidentProfile from '../pages/ResidentProfile';
import CommunityHub from '../pages/CommunityHub';
import Compliance from '../pages/compliance/Compliance';
import Calendar from '../pages/Calendar';
import Workflows from '../pages/Workflows';
import PrintQueue from '../pages/PrintQueue';
import Reports from '../pages/Reports';
import Integrations from '../pages/Integrations';
import SystemUploads from '../pages/SystemUploads';
import AssociationProfile from '../pages/AssociationProfile';
import LeadsManagement from '../pages/leads/LeadsManagement';

export const mainRoutes = [
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
  {
    path: '/residents/:id',
    element: (
      <ProtectedRoute>
        <ResidentProfile />
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
    path: '/calendar',
    element: (
      <ProtectedRoute>
        <Calendar />
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
    path: '/reports',
    element: (
      <ProtectedRoute>
        <Reports />
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
    path: '/system-uploads',
    element: (
      <ProtectedRoute>
        <SystemUploads />
      </ProtectedRoute>
    ),
  },
  {
    path: '/leads',
    element: (
      <ProtectedRoute>
        <LeadsManagement />
      </ProtectedRoute>
    ),
  },
];
