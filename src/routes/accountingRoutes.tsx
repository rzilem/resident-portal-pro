
import React from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import AccountingDashboard from '../pages/accounting/AccountingDashboard';
import InvoiceQueue from '../pages/accounting/InvoiceQueue';
import InvoiceCoding from '../pages/accounting/InvoiceCoding';
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
        <AccountingDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/accounting/invoice-queue',
    element: (
      <ProtectedRoute>
        <InvoiceQueue />
      </ProtectedRoute>
    ),
  },
  {
    path: '/accounting/invoice-coding',
    element: (
      <ProtectedRoute>
        <InvoiceCoding />
      </ProtectedRoute>
    ),
  },
  {
    path: '/accounting/transactions',
    element: (
      <ProtectedRoute>
        <Transactions />
      </ProtectedRoute>
    ),
  },
  {
    path: '/accounting/payments',
    element: (
      <ProtectedRoute>
        <Payments />
      </ProtectedRoute>
    ),
  },
  {
    path: '/accounting/journal-entries',
    element: (
      <ProtectedRoute>
        <JournalEntries />
      </ProtectedRoute>
    ),
  },
  {
    path: '/accounting/gl-accounts',
    element: (
      <ProtectedRoute>
        <GlAccounts />
      </ProtectedRoute>
    ),
  },
  {
    path: '/accounting/reports',
    element: (
      <ProtectedRoute>
        <AccountingReports />
      </ProtectedRoute>
    ),
  },
];
