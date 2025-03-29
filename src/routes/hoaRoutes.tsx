
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import HoaDashboard from '../pages/hoa/Dashboard';
import HoaFinances from '../pages/hoa/Finances';
import Members from '../pages/hoa/Members';

export const hoaRoutes = [
  {
    path: '/hoa/dashboard',
    element: (
      <ProtectedRoute>
        <HoaDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/hoa/finances',
    element: (
      <ProtectedRoute>
        <HoaFinances />
      </ProtectedRoute>
    ),
  },
  {
    path: '/hoa/members',
    element: (
      <ProtectedRoute>
        <Members />
      </ProtectedRoute>
    ),
  },
];
