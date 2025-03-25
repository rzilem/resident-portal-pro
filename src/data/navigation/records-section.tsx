
import React from 'react';
import { FileSpreadsheet, Database, FileText, BarChart } from 'lucide-react';
import { NavItem } from './types';

export const getRecordsSection = (currentPath: string): NavItem => ({
  label: "Records & Reports",
  icon: <FileSpreadsheet className="h-4 w-4" />,
  active: currentPath.startsWith("/database") || 
          currentPath.startsWith("/documents") || 
          currentPath.startsWith("/reports"),
  href: "/database/records", // Default href
  items: [
    {
      label: "Records",
      icon: <Database className="h-4 w-4" />,
      href: "/database/records",
      active: currentPath === "/database/records"
    },
    {
      label: "Documents",
      icon: <FileText className="h-4 w-4" />,
      href: "/documents/association",
      active: currentPath.startsWith("/documents")
    },
    {
      label: "Reports",
      icon: <BarChart className="h-4 w-4" />,
      href: "/reports",
      active: currentPath === "/reports"
    }
  ]
});
