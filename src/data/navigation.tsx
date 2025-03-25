
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
  LayoutGrid
} from 'lucide-react';

// Define the NavItem type to avoid TypeScript errors
export type NavItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
  active: boolean;
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
  {
    label: "Properties",
    icon: <Building2 className="h-4 w-4" />,
    href: "/properties",
    active: currentPath === "/properties"
  },
  {
    label: "Residents",
    icon: <Users className="h-4 w-4" />,
    href: "/residents",
    active: currentPath === "/residents"
  },
  {
    label: "Calendar",
    icon: <Calendar className="h-4 w-4" />,
    href: "/calendar",
    active: currentPath === "/calendar",
    items: [
      {
        label: "Calendar View",
        href: "/calendar",
        active: currentPath === "/calendar"
      },
      {
        label: "Calendar Settings",
        href: "/settings/calendar",
        active: currentPath === "/settings/calendar"
      }
    ]
  },
  {
    label: "Accounting",
    icon: <CircleDollarSign className="h-4 w-4" />,
    active: currentPath.startsWith("/accounting"),
    items: [
      {
        label: "Dashboard",
        href: "/accounting/dashboard",
        active: currentPath === "/accounting/dashboard"
      },
      {
        label: "Transactions",
        href: "/accounting/transactions",
        active: currentPath === "/accounting/transactions"
      },
      {
        label: "Payments",
        href: "/accounting/payments",
        active: currentPath === "/accounting/payments"
      },
      {
        label: "Journal Entries",
        href: "/accounting/journal-entries",
        active: currentPath === "/accounting/journal-entries"
      },
      {
        label: "Reports",
        href: "/accounting/reports",
        active: currentPath === "/accounting/reports"
      }
    ]
  },
  {
    label: "Communications",
    icon: <MessageSquare className="h-4 w-4" />,
    active: currentPath.startsWith("/communications"),
    items: [
      {
        label: "Community Messaging",
        href: "/communications/messaging",
        active: currentPath === "/communications/messaging"
      },
      {
        label: "Announcements",
        href: "/communications/announcements",
        active: currentPath === "/communications/announcements"
      }
    ]
  },
  {
    label: "Records",
    icon: <Database className="h-4 w-4" />,
    active: currentPath.startsWith("/database"),
    items: [
      {
        label: "Association Records",
        href: "/database/records",
        active: currentPath === "/database/records"
      }
    ]
  },
  "separator",
  {
    label: "Documents",
    icon: <FolderClosed className="h-4 w-4" />,
    active: currentPath.startsWith("/documents"),
    items: [
      {
        label: "Association Documents",
        href: "/documents/association",
        active: currentPath === "/documents/association"
      },
      {
        label: "Document Templates",
        href: "/documents/templates",
        active: currentPath === "/documents/templates"
      }
    ]
  },
  {
    label: "Reports",
    icon: <BarChart3 className="h-4 w-4" />,
    href: "/reports",
    active: currentPath === "/reports"
  },
  {
    label: "Workflows",
    icon: <Workflow className="h-4 w-4" />,
    href: "/workflows",
    active: currentPath === "/workflows",
  },
  {
    label: "Community Hub",
    icon: <LayoutGrid className="h-4 w-4" />,
    href: "/community-hub",
    active: currentPath === "/community-hub",
  },
  "separator",
  {
    label: "Integrations",
    icon: <Network className="h-4 w-4" />,
    href: "/integrations",
    active: currentPath === "/integrations"
  },
  {
    label: "Settings",
    icon: <Cog className="h-4 w-4" />,
    active: currentPath.startsWith("/settings"),
    items: [
      {
        label: "General Settings",
        href: "/settings",
        active: currentPath === "/settings"
      },
      {
        label: "Calendar Settings",
        href: "/settings/calendar",
        active: currentPath === "/settings/calendar"
      },
      {
        label: "User Permissions",
        href: "/settings/permissions",
        active: currentPath === "/settings/permissions"
      }
    ]
  }
];
