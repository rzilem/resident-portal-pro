
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import Settings from '../pages/Settings';
import Associations from '../pages/settings/Associations';
import Permissions from '../pages/settings/Permissions';
import EmailWorkflows from '../pages/settings/EmailWorkflows';

export const settingsRoutes = [
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings/associations',
    element: (
      <ProtectedRoute>
        <Associations />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings/permissions',
    element: (
      <ProtectedRoute>
        <Permissions />
      </ProtectedRoute>
    ),
  },
  {
    path: '/email-workflows',
    element: (
      <ProtectedRoute>
        <EmailWorkflows />
      </ProtectedRoute>
    ),
  },
];
