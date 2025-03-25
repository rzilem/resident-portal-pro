
import React from 'react';
import { Cog } from 'lucide-react';
import { NavItem } from './types';

export const getSystemSection = (currentPath: string): NavItem => ({
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
});
