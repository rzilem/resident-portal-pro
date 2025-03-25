
import React from 'react';
import { ClipboardList, Calendar, MessageCircle, ShieldCheck, GitBranch } from 'lucide-react';
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
      icon: <Calendar className="h-4 w-4" />,
      href: "/calendar",
      active: currentPath === "/calendar" || currentPath.startsWith("/calendar/")
    },
    {
      label: "Communications",
      icon: <MessageCircle className="h-4 w-4" />,
      href: "/communications/messaging",
      active: currentPath.startsWith("/communications")
    },
    {
      label: "Compliance",
      icon: <ShieldCheck className="h-4 w-4" />,
      href: "/compliance",
      active: currentPath === "/compliance" || currentPath.startsWith("/compliance/")
    },
    {
      label: "Workflows",
      icon: <GitBranch className="h-4 w-4" />,
      href: "/workflows",
      active: currentPath === "/workflows" || currentPath.startsWith("/workflows/")
    }
  ]
});
