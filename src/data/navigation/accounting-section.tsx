
import React from 'react';
import { DollarSign, FileText, CreditCard, PiggyBank, Book, Receipt, BarChart, Calculator } from 'lucide-react';
import { NavItem } from './types';

export const getAccountingSection = (currentPath: string): NavItem => ({
  label: "Accounting",
  icon: DollarSign,
  active: currentPath.startsWith("/accounting"),
  href: "/accounting/dashboard", // Default href
  items: [
    {
      label: "Dashboard",
      icon: BarChart,
      href: "/accounting/dashboard",
      active: currentPath === "/accounting/dashboard"
    },
    {
      label: "Invoice Queue",
      icon: Receipt,
      href: "/accounting/invoice-queue",
      active: currentPath === "/accounting/invoice-queue" || currentPath === "/accounting/invoice-coding"
    },
    {
      label: "Transactions",
      icon: FileText,
      href: "/accounting/transactions",
      active: currentPath === "/accounting/transactions"
    },
    {
      label: "Payments",
      icon: CreditCard,
      href: "/accounting/payments",
      active: currentPath === "/accounting/payments"
    },
    {
      label: "Journal Entries",
      icon: Book,
      href: "/accounting/journal-entries",
      active: currentPath === "/accounting/journal-entries"
    },
    {
      label: "GL Accounts",
      icon: Calculator,
      href: "/accounting/gl-accounts",
      active: currentPath === "/accounting/gl-accounts"
    },
    {
      label: "Budget Planning",
      icon: PiggyBank,
      href: "/accounting/budget",
      active: currentPath === "/accounting/budget"
    },
    {
      label: "Reports",
      icon: BarChart,
      href: "/accounting/reports",
      active: currentPath === "/accounting/reports"
    }
  ]
});
