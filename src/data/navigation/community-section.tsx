
import { PanelsTopLeft, Building, Users, Castle, AlertTriangle } from 'lucide-react';
import { NavItem } from './types';

export const getCommunitySection = (currentPath: string): NavItem => ({
  label: "Community Management",
  icon: PanelsTopLeft,
  active: currentPath.startsWith("/properties") || 
          currentPath.startsWith("/residents") || 
          currentPath.startsWith("/community-hub") ||
          currentPath.startsWith("/compliance"),
  href: "/properties", // Default href
  items: [
    {
      label: "Properties",
      icon: Building,
      href: "/properties",
      active: currentPath === "/properties"
    },
    {
      label: "Residents",
      icon: Users,
      href: "/residents",
      active: currentPath === "/residents"
    },
    {
      label: "Community Hub",
      icon: Castle,
      href: "/community-hub",
      active: currentPath === "/community-hub"
    },
    {
      label: "Compliance",
      icon: AlertTriangle,
      href: "/compliance",
      active: currentPath.startsWith("/compliance")
    }
  ]
});
