
import React from 'react';
import { ClipboardList, Calendar, MessageCircle, ShieldCheck, GitBranch, Printer, Building2 } from 'lucide-react';
import { NavItem } from './types';

export const getOperationsSection = (currentPath: string): NavItem => ({
  label: "Operations",
  icon: <ClipboardList className="h-4 w-4" />,
  active: currentPath.startsWith("/calendar") || 
          currentPath.startsWith("/communications") ||
          currentPath.startsWith("/workflows") ||
          currentPath.startsWith("/compliance") ||
          currentPath.startsWith("/print-queue") ||
          currentPath.startsWith("/vendors"),
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
      label: "Print Queue",
      icon: <Printer className="h-4 w-4" />,
      href: "/print-queue",
      active: currentPath === "/print-queue" || currentPath.startsWith("/print-queue/")
    },
    {
      label: "Vendors",
      icon: <Building2 className="h-4 w-4" />,
      href: "/vendors",
      active: currentPath === "/vendors" || currentPath.startsWith("/vendors/")
    },
    {
      label: "Workflows",
      icon: <GitBranch className="h-4 w-4" />,
      href: "/workflows",
      active: currentPath === "/workflows" || currentPath.startsWith("/workflows/")
    }
  ]
});
