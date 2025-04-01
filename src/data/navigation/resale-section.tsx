
import { FileText, ClipboardList, Calendar, DollarSign, FileSpreadsheet, FileCheck, ListOrdered } from 'lucide-react';
import { NavItem } from './types';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export const getResaleSection = (currentPath: string): NavItem => ({
  label: "Resale Management",
  icon: FileText,
  active: currentPath.startsWith("/resale"),
  href: "/resale", // Default href
  tooltip: "Manage all resale-related documentation and processes",
  items: [
    {
      label: "Resale Certificate",
      icon: FileSpreadsheet,
      href: "/resale/certificate",
      active: currentPath === "/resale/certificate",
      tooltip: "Generate and manage certificates for property transfers"
    },
    {
      label: "Condo Questionnaire",
      icon: ClipboardList,
      href: "/resale/questionnaire",
      active: currentPath === "/resale/questionnaire",
      tooltip: "Complete and manage questionnaires for lenders"
    },
    {
      label: "Property Inspection",
      icon: Calendar,
      href: "/resale/inspection",
      active: currentPath === "/resale/inspection",
      tooltip: "Schedule and track property inspections"
    },
    {
      label: "Account Statements",
      icon: DollarSign,
      href: "/resale/statements",
      active: currentPath === "/resale/statements",
      tooltip: "Generate financial statements for closing transactions"
    },
    {
      label: "TREC Forms",
      icon: FileCheck,
      href: "/resale/trec-forms",
      active: currentPath === "/resale/trec-forms",
      tooltip: "Access Texas Real Estate Commission forms"
    },
    {
      label: "Order Queue",
      icon: ListOrdered,
      href: "/resale/queue",
      active: currentPath === "/resale/queue",
      tooltip: "Track and manage pending resale document orders"
    }
  ]
});
