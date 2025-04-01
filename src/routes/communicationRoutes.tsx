
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import Announcements from '../pages/communications/Announcements';
import HtmlTemplatesPage from '../pages/communications/HtmlTemplatesPage';
import EmailWorkflows from '../pages/settings/EmailWorkflows';
import MessageTemplates from '../pages/communications/MessageTemplates';
import CommunityMessaging from '../pages/communications/CommunityMessaging';

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
    path: '/communications/messaging',
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
        <MessageTemplates />
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
