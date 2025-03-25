
import { 
  Home, 
  Building, 
  Users, 
  FileText, 
  Settings, 
  Database,
  MessageCircle,
  Zap,
  Bell,
  Calendar,
  CreditCard,
  BarChart4,
  Layers,
  Link
} from "lucide-react";
import { ReactNode } from "react";

export type NavItem = {
  label: string;
  href: string;
  icon?: ReactNode;
  isActive?: boolean;
  items?: NavItem[];
};

export const getNavItems = (pathname: string): (NavItem | 'separator')[] => {
  return [
    // Main navigation
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      isActive: pathname === '/dashboard',
    },
    {
      label: "Properties",
      href: "/properties",
      icon: <Building className="h-5 w-5" />,
      isActive: pathname === '/properties',
    },
    {
      label: "Residents",
      href: "/residents",
      icon: <Users className="h-5 w-5" />,
      isActive: pathname.startsWith('/residents'),
    },
    {
      label: "Calendar",
      href: "/calendar",
      icon: <Calendar className="h-5 w-5" />,
      isActive: pathname === '/calendar' || pathname === '/settings/calendar',
      items: [
        {
          label: "View Calendar",
          href: "/calendar",
          isActive: pathname === '/calendar',
        },
        {
          label: "Calendar Settings",
          href: "/settings/calendar",
          isActive: pathname === '/settings/calendar',
        }
      ]
    },
    'separator',
    // Financial section
    {
      label: "Accounting",
      href: "#",
      icon: <CreditCard className="h-5 w-5" />,
      isActive: pathname.startsWith('/accounting'),
      items: [
        {
          label: "Dashboard",
          href: "/accounting",
          isActive: pathname === '/accounting',
        },
        {
          label: "Transactions",
          href: "/accounting/transactions",
          isActive: pathname === '/accounting/transactions',
        },
        {
          label: "Reports",
          href: "/accounting/reports",
          isActive: pathname === '/accounting/reports',
        },
        {
          label: "Payments",
          href: "/accounting/payments",
          isActive: pathname === '/accounting/payments',
        },
      ],
    },
    // Communications section
    {
      label: "Communications",
      href: "#",
      icon: <Bell className="h-5 w-5" />,
      isActive: pathname.startsWith('/communications'),
      items: [
        {
          label: "Announcements",
          href: "/communications/announcements",
          isActive: pathname === '/communications/announcements',
        },
        {
          label: "Messaging",
          href: "/communications/messaging",
          isActive: pathname === '/communications/messaging',
        }
      ],
    },
    // Database & Records section
    {
      label: "Records",
      href: "#",
      icon: <Database className="h-5 w-5" />,
      isActive: pathname.startsWith('/database'),
      items: [
        {
          label: "Association Records",
          href: "/database/records",
          isActive: pathname === '/database/records',
        },
        {
          label: "Document Templates",
          href: "/database/templates",
          isActive: pathname === '/database/templates',
        },
      ],
    },
    // Advanced features
    {
      label: "Workflows",
      href: "/workflows",
      icon: <Zap className="h-5 w-5" />,
      isActive: pathname === '/workflows',
    },
    {
      label: "Reports",
      href: "/reports",
      icon: <BarChart4 className="h-5 w-5" />,
      isActive: pathname === '/reports',
    },
    {
      label: "Integrations",
      href: "/integrations",
      icon: <Link className="h-5 w-5" />,
      isActive: pathname === '/integrations',
    },
    {
      label: "Community Hub",
      href: "/chatbot",
      icon: <MessageCircle className="h-5 w-5" />,
      isActive: pathname === '/chatbot',
    },
    'separator',
    // Settings and configuration
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      isActive: pathname === '/settings' || pathname.startsWith('/settings/'),
      items: [
        {
          label: "General Settings",
          href: "/settings",
          isActive: pathname === '/settings',
        },
        {
          label: "Calendar Settings",
          href: "/settings/calendar",
          isActive: pathname === '/settings/calendar',
        },
        {
          label: "User Permissions",
          href: "/settings/permissions",
          isActive: pathname === '/settings/permissions',
        }
      ]
    },
  ];
};
