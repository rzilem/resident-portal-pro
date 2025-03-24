
import { 
  Home, 
  Building, 
  Users, 
  FileText, 
  Settings, 
  Database,
  MessageCircle,
  Zap,
  Bell
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
    'separator',
    {
      label: "Accounting",
      href: "#",
      icon: <FileText className="h-5 w-5" />,
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
          label: "Messages",
          href: "/communications/messaging",
          isActive: pathname === '/communications/messaging',
        },
        {
          label: "Email Templates",
          href: "/communications/email-templates",
          isActive: pathname === '/communications/email-templates',
        },
      ],
    },
    {
      label: "Database",
      href: "#",
      icon: <Database className="h-5 w-5" />,
      isActive: pathname.startsWith('/database'),
      items: [
        {
          label: "Records",
          href: "/database/records",
          isActive: pathname === '/database/records',
        },
        {
          label: "Templates",
          href: "/database/templates",
          isActive: pathname === '/database/templates',
        },
      ],
    },
    {
      label: "Workflows",
      href: "/workflows",
      icon: <Zap className="h-5 w-5" />,
      isActive: pathname === '/workflows',
    },
    {
      label: "Chatbot",
      href: "/chatbot",
      icon: <MessageCircle className="h-5 w-5" />,
      isActive: pathname === '/chatbot',
    },
    'separator',
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      isActive: pathname === '/settings',
    },
  ];
};
