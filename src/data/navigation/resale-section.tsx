
import { FileText, ClipboardList, Calendar, DollarSign, FileSpreadsheet, FileCheck, ListOrdered } from 'lucide-react';
import { NavItem } from './types';

export const getResaleSection = (currentPath: string): NavItem => ({
  label: "Resale Management",
  icon: FileText,
  active: currentPath.startsWith("/resale"),
  href: "/resale", // Default href
  items: [
    {
      label: "Resale Certificate",
      icon: FileSpreadsheet,
      href: "/resale/certificate",
      active: currentPath === "/resale/certificate",
      tooltip: "Manage property resale certificates"
    },
    {
      label: "Condo Questionnaire",
      icon: ClipboardList,
      href: "/resale/questionnaire",
      active: currentPath === "/resale/questionnaire",
      tooltip: "Process condo questionnaires for lenders"
    },
    {
      label: "Property Inspection",
      icon: Calendar,
      href: "/resale/inspection",
      active: currentPath === "/resale/inspection",
      tooltip: "Schedule and manage property inspections"
    },
    {
      label: "Account Statements",
      icon: DollarSign,
      href: "/resale/statements",
      active: currentPath === "/resale/statements",
      tooltip: "Generate financial statements for closings"
    },
    {
      label: "TREC Forms",
      icon: FileCheck,
      href: "/resale/trec-forms",
      active: currentPath === "/resale/trec-forms",
      tooltip: "Manage Texas Real Estate Commission forms"
    },
    {
      label: "Order Queue",
      icon: ListOrdered,
      href: "/resale/queue",
      active: currentPath === "/resale/queue",
      tooltip: "Track and manage document order processing"
    }
  ]
});
