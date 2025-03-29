
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import Residents from '../pages/Residents';
import ResidentProfile from '../pages/ResidentProfile';

export const residentRoutes = [
  {
    path: '/residents',
    element: (
      <ProtectedRoute>
        <Residents />
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
];
