
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import Records from '../pages/database/Records';

export const databaseRoutes = [
  {
    path: '/database/records',
    element: (
      <ProtectedRoute>
        <Records />
      </ProtectedRoute>
    ),
  },
];
