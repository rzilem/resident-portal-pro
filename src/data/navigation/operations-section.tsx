
import React from 'react';
import { ClipboardList, ShieldCheck } from 'lucide-react';
import { NavItem } from './types';

export const getOperationsSection = (currentPath: string): NavItem => ({
  label: "Operations",
  icon: <ClipboardList className="h-4 w-4" />,
  active: currentPath.startsWith("/calendar") || 
          currentPath.startsWith("/communications") ||
          currentPath.startsWith("/workflows") ||
          currentPath.startsWith("/compliance"),
  href: "/calendar", // Default href
  items: [
    {
      label: "Calendar",
      href: "/calendar",
      active: currentPath === "/calendar" || currentPath.startsWith("/calendar/")
    },
    {
      label: "Communications",
      href: "/communications/messaging",
      active: currentPath.startsWith("/communications")
    },
    {
      label: "Compliance",
      href: "/compliance",
      active: currentPath === "/compliance" || currentPath.startsWith("/compliance/")
    },
    {
      label: "Workflows",
      href: "/workflows",
      active: currentPath === "/workflows" || currentPath.startsWith("/workflows/")
    }
  ]
});
