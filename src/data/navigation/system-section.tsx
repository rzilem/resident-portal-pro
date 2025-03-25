
import React from 'react';
import { Cog, Building, Shield } from 'lucide-react';
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
      active: currentPath === "/settings"
    },
    {
      label: "Associations",
      icon: <Building className="h-4 w-4" />,
      href: "/settings/associations",
      active: currentPath.startsWith("/settings/associations")
    },
    {
      label: "Permissions",
      icon: <Shield className="h-4 w-4" />,
      href: "/settings/permissions",
      active: currentPath.startsWith("/settings/permissions")
    }
  ]
});
