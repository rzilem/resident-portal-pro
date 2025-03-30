
import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import AccountingDashboard from '../pages/accounting/AccountingDashboard';
import InvoiceQueue from '../pages/accounting/InvoiceQueue';
import Transactions from '../pages/accounting/Transactions';
import Payments from '../pages/accounting/Payments';
import JournalEntries from '../pages/accounting/JournalEntries';
import GlAccounts from '../pages/accounting/GlAccounts';
import AccountingReports from '../pages/accounting/AccountingReports';

export const accountingRoutes = [
  {
    path: '/accounting/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <AccountingDashboard />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/accounting/invoice-queue',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <InvoiceQueue />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/accounting/transactions',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Transactions />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/accounting/payments',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Payments />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/accounting/journal-entries',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <JournalEntries />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/accounting/gl-accounts',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <GlAccounts />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/accounting/reports',
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <AccountingReports />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
];
