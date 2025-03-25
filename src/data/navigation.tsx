
import React from 'react';
import {
  BarChart3,
  Building2,
  Calendar,
  CircleDollarSign,
  Cog,
  FileSpreadsheet,
  Home,
  LayoutDashboard,
  MessageSquare,
  Network,
  Settings2,
  Users,
  FolderClosed,
  Database,
  Workflow,
  LayoutGrid,
  UserCircle,
  PanelsTopLeft,
  ClipboardList
} from 'lucide-react';

// Define the NavItem type with proper structure
export type NavItem = {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  href?: string; // Make href optional
  items?: {
    label: string;
    href: string;
    active: boolean;
  }[];
};

export const getNavItems = (currentPath: string): (NavItem | "separator")[] => [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    href: "/dashboard",
    active: currentPath === "/dashboard"
  },
  "separator",
  // Community Management Section
  {
    label: "Community Management",
    icon: <PanelsTopLeft className="h-4 w-4" />,
    active: currentPath.startsWith("/properties") || 
            currentPath.startsWith("/residents") || 
            currentPath.startsWith("/community-hub"),
    href: "/properties", // Default href
    items: [
      {
        label: "Properties",
        href: "/properties",
        active: currentPath === "/properties"
      },
      {
        label: "Residents",
        href: "/residents",
        active: currentPath === "/residents"
      },
      {
        label: "Community Hub",
        href: "/community-hub",
        active: currentPath === "/community-hub"
      }
    ]
  },
  // Operations Section
  {
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
  },
  // Records & Reports Section
  {
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
  },
  "separator",
  // System Section
  {
    label: "System",
    icon: <Cog className="h-4 w-4" />,
    active: currentPath.startsWith("/integrations") || 
            currentPath.startsWith("/settings"),
    href: "/integrations", // Default href
    items: [
      {
        label: "Integrations",
        href: "/integrations",
        active: currentPath === "/integrations"
      },
      {
        label: "Settings",
        href: "/settings",
        active: currentPath.startsWith("/settings")
      }
    ]
  }
];
