
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import Vendors from '../pages/vendors/Vendors';
import VendorProfile from '../pages/vendors/VendorProfile';
import SystemUploads from '../pages/SystemUploads';

export const vendorRoutes = [
  {
    path: '/vendors',
    element: (
      <ProtectedRoute>
        <Vendors />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendors/:id',
    element: (
      <ProtectedRoute>
        <VendorProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vendors/import',
    element: (
      <ProtectedRoute>
        <SystemUploads />
      </ProtectedRoute>
    ),
  },
];
