
import React from 'react';
import { ClipboardList } from 'lucide-react';
import { NavItem } from './types';

export const getOperationsSection = (currentPath: string): NavItem => ({
  label: "Operations",
  icon: <ClipboardList className="h-4 w-4" />,
  active: currentPath.startsWith("/calendar") || 
          currentPath.startsWith("/accounting") || 
          currentPath.startsWith("/communications") ||
          currentPath.startsWith("/workflows"),
  href: "/calendar", // Default href
  items: [
    {
      label: "Calendar",
      href: "/calendar",
      active: currentPath === "/calendar"
    },
    {
      label: "Accounting",
      href: "/accounting/dashboard",
      active: currentPath.startsWith("/accounting")
    },
    {
      label: "Communications",
      href: "/communications/messaging",
      active: currentPath.startsWith("/communications")
    },
    {
      label: "Workflows",
      href: "/workflows",
      active: currentPath === "/workflows"
    }
  ]
});
