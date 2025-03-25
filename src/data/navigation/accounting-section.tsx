
import React from 'react';
import { Receipt, FileText, DollarSign, LineChart, LayoutDashboard, CreditCard, FileInput, BookOpen, BarChart4, Landmark } from 'lucide-react';
import { NavItem } from './types';

export const getAccountingSection = (currentPath: string): NavItem => ({
  label: "Accounting",
  icon: <DollarSign className="h-4 w-4" />,
  active: currentPath.startsWith("/accounting"),
  href: "/accounting/dashboard", // Default href
  items: [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      href: "/accounting/dashboard",
      active: currentPath === "/accounting/dashboard"
    },
    {
      label: "Transactions",
      icon: <Receipt className="h-4 w-4" />,
      href: "/accounting/transactions",
      active: currentPath === "/accounting/transactions"
    },
    {
      label: "Payments",
      icon: <CreditCard className="h-4 w-4" />,
      href: "/accounting/payments",
      active: currentPath === "/accounting/payments"
    },
    {
      label: "Journal Entries",
      icon: <BookOpen className="h-4 w-4" />,
      href: "/accounting/journal-entries",
      active: currentPath === "/accounting/journal-entries"
    },
    {
      label: "GL Accounts",
      icon: <Landmark className="h-4 w-4" />,
      href: "/accounting/gl-accounts",
      active: currentPath === "/accounting/gl-accounts"
    },
    {
      label: "Reports",
      icon: <BarChart4 className="h-4 w-4" />,
      href: "/accounting/reports",
      active: currentPath === "/accounting/reports"
    }
  ]
});
