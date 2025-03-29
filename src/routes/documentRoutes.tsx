
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AssociationDocuments from '../pages/documents/AssociationDocuments';

export const documentRoutes = [
  {
    path: '/documents/association',
    element: (
      <ProtectedRoute>
        <AssociationDocuments />
      </ProtectedRoute>
    ),
  },
];
