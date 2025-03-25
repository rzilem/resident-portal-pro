
import {
  LayoutDashboard,
  ImageIcon,
  Users,
  Calendar,
  ListChecks,
  Mail,
  Settings,
  BarChart,
  MessageSquare,
  FileText,
  LucideIcon,
  Activity,
  Wallet,
  Building2,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
  items?: NavItem[];
  active?: boolean;
};

type Route = {
  title: string;
  href: string;
  description?: string;
  items?: Route[];
};

export const dashboardNavItems: Route[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Properties",
    href: "/properties",
  },
  {
    title: "Residents",
    href: "/residents",
  },
  {
    title: "Calendar",
    href: "/calendar",
  },
  {
    title: "Workflows",
    href: "/workflows",
  },
];

export const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    description: "Overview of your community",
    icon: LayoutDashboard,
  },
  {
    title: "Properties",
    href: "/properties",
    description: "Manage properties and units",
    icon: Building2,
  },
  {
    title: "Residents",
    href: "/residents",
    description: "Manage residents and homeowners",
    icon: Users,
  },
  {
    title: "Accounting",
    href: "/accounting/dashboard",
    description: "Manage finances and payments",
    icon: Wallet,
    items: [
      {
        title: "Accounting Dashboard",
        href: "/accounting/dashboard",
        description: "Overview of your community finances",
      },
      {
        title: "Transactions",
        href: "/accounting/transactions",
        description: "Manage transactions",
      },
      {
        title: "Journal Entries",
        href: "/accounting/journal-entries",
        description: "Create and manage journal entries",
      },
      {
        title: "Payments",
        href: "/accounting/payments",
        description: "Manage payments",
      },
      {
        title: "Reports",
        href: "/accounting/reports",
        description: "View financial reports",
      },
    ],
  },
  {
    title: "Communications",
    href: "/communications/messaging",
    description: "Communicate with residents",
    icon: MessageSquare,
    items: [
      {
        title: "Community Messaging",
        href: "/communications/messaging",
        description: "Send messages to residents",
      },
      {
        title: "Announcements",
        href: "/communications/announcements",
        description: "Manage announcements",
      },
    ],
  },
  {
    title: "Documents",
    href: "/documents/association",
    description: "Manage documents and files",
    icon: FileText,
    items: [
      {
        title: "Association Documents",
        href: "/documents/association",
        description: "Manage association documents and files"
      },
      {
        title: "Document Templates",
        href: "/documents/templates",
        description: "Access and download data templates"
      }
    ]
  },
  {
    title: "Database",
    href: "/database/records",
    description: "Manage database records",
    icon: ListChecks,
  },
  {
    title: "Calendar",
    href: "/calendar",
    description: "Manage events and schedules",
    icon: Calendar,
  },
  {
    title: "Workflows",
    href: "/workflows",
    description: "Automate tasks and processes",
    icon: Activity,
  },
  {
    title: "Settings",
    href: "/settings",
    description: "Manage settings and configurations",
    icon: Settings,
    items: [
      {
        title: "Permissions",
        href: "/settings/permissions",
        description: "Manage user permissions",
      },
    ],
  },
];

// Convert the main navigation items to the format needed by the sidebar
export const getNavItems = (currentPath: string): (NavItem | 'separator')[] => {
  const navItems: (NavItem | 'separator')[] = [];
  
  // Add main sections
  mainNavItems.forEach((item) => {
    const navItem: NavItem = {
      label: item.title,
      href: item.href,
      icon: item.icon,
      description: item.description,
      active: currentPath.startsWith(item.href),
    };
    
    // If the item has children, add them
    if (item.items && item.items.length > 0) {
      navItem.items = item.items.map((subItem) => ({
        label: subItem.title,
        href: subItem.href,
        description: subItem.description,
        active: currentPath === subItem.href,
      }));
    }
    
    navItems.push(navItem);
    
    // Add separator after certain sections
    if (["Calendar", "Workflows"].includes(item.title)) {
      navItems.push('separator');
    }
  });
  
  return navItems;
};
