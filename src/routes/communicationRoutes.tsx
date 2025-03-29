
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import CommunityMessaging from '../pages/communications/CommunityMessaging';

export const communicationRoutes = [
  {
    path: '/communications/messaging',
    element: (
      <ProtectedRoute>
        <CommunityMessaging />
      </ProtectedRoute>
    ),
  },
  {
    path: '/communications/announcements',
    element: (
      <ProtectedRoute>
        <div>Announcements Page</div>
      </ProtectedRoute>
    ),
  },
];
