
import React from 'react';
import { Receipt, FileText, DollarSign, LineChart, Book } from 'lucide-react';
import { NavItem } from './types';

export const getAccountingSection = (currentPath: string): NavItem => ({
  label: "Accounting",
  icon: <DollarSign className="h-4 w-4" />,
  active: currentPath.startsWith("/accounting"),
  href: "/accounting/dashboard", // Default href
  items: [
    {
      label: "Dashboard",
      href: "/accounting/dashboard",
      active: currentPath === "/accounting/dashboard"
    },
    {
      label: "Transactions",
      href: "/accounting/transactions",
      active: currentPath === "/accounting/transactions"
    },
    {
      label: "Payments",
      href: "/accounting/payments",
      active: currentPath === "/accounting/payments"
    },
    {
      label: "Journal Entries",
      href: "/accounting/journal-entries",
      active: currentPath === "/accounting/journal-entries"
    },
    {
      label: "Reports",
      href: "/accounting/reports",
      active: currentPath === "/accounting/reports"
    }
  ]
});
