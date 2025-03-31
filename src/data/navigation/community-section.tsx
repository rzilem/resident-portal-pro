
import { PanelsTopLeft, Building, Users, Castle, FileWarning, HandCoins, MessageSquare } from 'lucide-react';
import { NavItem } from './types';

export const getCommunitySection = (currentPath: string): NavItem => ({
  label: "Community Management",
  icon: PanelsTopLeft,
  active: currentPath.startsWith("/properties") || 
          currentPath.startsWith("/residents") || 
          currentPath.startsWith("/compliance") ||
          currentPath.startsWith("/community-hub") ||
          currentPath.startsWith("/resale/bid-requests") ||
          currentPath.startsWith("/resale/bid-request") ||
          currentPath.startsWith("/communications"),
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
      label: "Compliance",
      icon: FileWarning,
      href: "/compliance",
      active: currentPath === "/compliance"
    },
    {
      label: "Community Hub",
      icon: Castle,
      href: "/community-hub",
      active: currentPath === "/community-hub"
    },
    {
      label: "Communications",
      icon: MessageSquare,
      href: "/communications/messaging",
      active: currentPath.startsWith("/communications")
    },
    {
      label: "Bid Requests",
      icon: HandCoins,
      href: "/resale/bid-requests",
      active: currentPath.startsWith("/resale/bid-requests") || currentPath.startsWith("/resale/bid-request")
    }
  ]
});
