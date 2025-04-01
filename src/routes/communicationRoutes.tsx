
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import EmailWorkflows from '../pages/communications/EmailWorkflows';
import MessageTemplates from '../pages/communications/MessageTemplates';
import Messaging from '../pages/communications/Messaging';
import Announcements from '../pages/communications/Announcements';
import HtmlTemplatesPage from '../pages/communications/HtmlTemplatesPage';

export const communicationRoutes = [
  {
    path: '/communications',
    element: (
      <ProtectedRoute>
        <Messaging />
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
