
import React from 'react';
import { PanelsTopLeft } from 'lucide-react';
import { NavItem } from './types';

export const getCommunitySection = (currentPath: string): NavItem => ({
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
});
