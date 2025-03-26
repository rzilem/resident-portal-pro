
import { FileText, ClipboardList, Calendar, DollarSign, FileSpreadsheet } from 'lucide-react';
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
      active: currentPath === "/resale/certificate" || currentPath === "/resale"
    },
    {
      label: "Condo Questionnaire",
      icon: ClipboardList,
      href: "/resale/questionnaire",
      active: currentPath === "/resale/questionnaire"
    },
    {
      label: "Property Inspection",
      icon: Calendar,
      href: "/resale/inspection",
      active: currentPath === "/resale/inspection"
    },
    {
      label: "Account Statements",
      icon: DollarSign,
      href: "/resale/statements",
      active: currentPath === "/resale/statements"
    }
  ]
});
