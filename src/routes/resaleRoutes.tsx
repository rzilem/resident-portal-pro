
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import ResaleDashboard from '../pages/resale/ResaleDashboard';
import ResaleWizard from '../pages/resale/wizard/ResaleWizard';
import BidRequestWizard from '../pages/resale/wizard/BidRequestWizard';
import BidRequests from '../pages/resale/BidRequests';
import BidRequestDetail from '../pages/resale/BidRequestDetail';
import ProjectImagesPage from '../pages/resale/admin/ProjectImages';
import Reports from '../pages/Reports';

export const resaleRoutes = [
  {
    path: '/resale',
    element: (
      <ProtectedRoute>
        <ResaleDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/resale/wizard',
    element: (
      <ProtectedRoute>
        <ResaleWizard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/resale/certificate',
    element: (
      <ProtectedRoute>
        <ResaleDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/resale/questionnaire',
    element: (
      <ProtectedRoute>
        <ResaleDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/resale/inspection',
    element: (
      <ProtectedRoute>
        <ResaleDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/resale/statements',
    element: (
      <ProtectedRoute>
        <ResaleDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/resale/trec-forms',
    element: (
      <ProtectedRoute>
        <ResaleDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/resale/queue',
    element: (
      <ProtectedRoute>
        <ResaleDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/resale/reports',
    element: (
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    ),
  },
  {
    path: '/resale/bid-request',
    element: (
      <ProtectedRoute>
        <BidRequestWizard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/resale/bid-requests',
    element: (
      <ProtectedRoute>
        <BidRequests />
      </ProtectedRoute>
    ),
  },
  {
    path: '/resale/bid-requests/:id',
    element: (
      <ProtectedRoute>
        <BidRequestDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: '/resale/admin/project-images',
    element: (
      <ProtectedRoute>
        <ProjectImagesPage />
      </ProtectedRoute>
    ),
  },
];
