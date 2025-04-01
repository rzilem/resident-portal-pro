
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import Announcements from '../pages/communications/Announcements';
import HtmlTemplatesPage from '../pages/communications/HtmlTemplatesPage';
import CommunityMessaging from '../pages/communications/CommunityMessaging';
import EmailWorkflows from '../pages/settings/EmailWorkflows';

export const communicationRoutes = [
  {
    path: '/communications',
    element: (
      <ProtectedRoute>
        <CommunityMessaging />
      </ProtectedRoute>
    ),
  },
  {
    path: '/communications/templates',
    element: (
      <ProtectedRoute>
        <CommunityMessaging initialTab="templates" />
      </ProtectedRoute>
    ),
  },
  {
    path: '/communications/workflows',
    element: (
      <ProtectedRoute>
        <EmailWorkflows />
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
  {
    path: '/communications/html-templates',
    element: (
      <ProtectedRoute>
        <HtmlTemplatesPage />
      </ProtectedRoute>
    ),
  },
];
