
import { FileSpreadsheet, Database, FileText, BarChart } from 'lucide-react';
import { NavItem } from './types';

export const getRecordsSection = (currentPath: string): NavItem => ({
  label: "Records & Reports",
  icon: FileSpreadsheet,
  active: currentPath.startsWith("/database") || 
          currentPath.startsWith("/documents") || 
          currentPath.startsWith("/reports"),
  href: "/database/records", // Default href
  items: [
    {
      label: "Records",
      icon: Database,
      href: "/database/records",
      active: currentPath === "/database/records"
    },
    {
      label: "Documents",
      icon: FileText,
      href: "/documents/association",
      active: currentPath.startsWith("/documents")
    },
    {
      label: "Reports",
      icon: BarChart,
      href: "/reports",
      active: currentPath === "/reports"
    }
  ]
});
