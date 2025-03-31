
import { 
  Receipt, 
  FileText, 
  DollarSign, 
  LineChart, 
  LayoutDashboard, 
  CreditCard, 
  FileInput, 
  BookOpen, 
  BarChart4, 
  Landmark, 
  Inbox,
  PenTool
} from 'lucide-react';
import { NavItem } from './types';

export const getAccountingSection = (currentPath: string): NavItem => ({
  label: "Accounting",
  icon: DollarSign,
  active: currentPath.startsWith("/accounting"),
  href: "/accounting/dashboard", // Default href
  items: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/accounting/dashboard",
      active: currentPath === "/accounting/dashboard"
    },
    {
      label: "Invoice Queue",
      icon: Inbox,
      href: "/accounting/invoice-queue",
      active: currentPath === "/accounting/invoice-queue"
    },
    {
      label: "Invoice Coding",
      icon: PenTool,
      href: "/accounting/invoice-coding",
      active: currentPath === "/accounting/invoice-coding"
    },
    {
      label: "Transactions",
      icon: Receipt,
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
      icon: BookOpen,
      href: "/accounting/journal-entries",
      active: currentPath === "/accounting/journal-entries"
    },
    {
      label: "GL Accounts",
      icon: Landmark,
      href: "/accounting/gl-accounts",
      active: currentPath === "/accounting/gl-accounts"
    },
    {
      label: "Reports",
      icon: BarChart4,
      href: "/accounting/reports",
      active: currentPath === "/accounting/reports"
    }
  ]
});
