
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import Vendors from '../pages/vendors/Vendors';
import VendorProfile from '../pages/vendors/VendorProfile';

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
];
