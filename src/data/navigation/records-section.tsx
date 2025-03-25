
import React from 'react';
import { FileSpreadsheet } from 'lucide-react';
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
      href: "/database/records",
      active: currentPath === "/database/records"
    },
    {
      label: "Documents",
      href: "/documents/association",
      active: currentPath.startsWith("/documents")
    },
    {
      label: "Reports",
      href: "/reports",
      active: currentPath === "/reports"
    }
  ]
});
