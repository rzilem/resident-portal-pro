
import React from 'react';
import Dashboard from '../pages/Dashboard';
import DashboardLayout from '../components/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';

export const mainRoutes = [
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
];
