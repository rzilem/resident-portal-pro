
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import CommunityMessaging from '../pages/communications/CommunityMessaging';
import Announcements from '../pages/communications/Announcements';

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
        <Announcements />
      </ProtectedRoute>
    ),
  },
];
