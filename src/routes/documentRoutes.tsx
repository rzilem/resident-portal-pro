
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AssociationDocuments from '../pages/documents/AssociationDocuments';
import DocumentsPage from '../pages/documents/DocumentsPage';

export const documentRoutes = [
  {
    path: '/documents',
    element: (
      <ProtectedRoute>
        <DocumentsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/documents/association',
    element: (
      <ProtectedRoute>
        <AssociationDocuments />
      </ProtectedRoute>
    ),
  },
];
