
import React from 'react';
import { Cog, Building, Shield, Puzzle, Sliders, Upload, Mail } from 'lucide-react';
import { NavItem } from './types';

export const getSystemSection = (currentPath: string): NavItem => ({
  label: "System",
  icon: <Cog className="h-4 w-4" />,
  active: currentPath.startsWith("/integrations") || 
          currentPath.startsWith("/settings") ||
          currentPath.startsWith("/system-uploads") ||
          currentPath.startsWith("/email-workflows"),
  href: "/integrations", // Default href
  items: [
    {
      label: "Integrations",
      icon: <Puzzle className="h-4 w-4" />,
      href: "/integrations",
      active: currentPath === "/integrations"
    },
    {
      label: "Settings",
      icon: <Sliders className="h-4 w-4" />,
      href: "/settings",
      active: currentPath === "/settings"
    },
    {
      label: "Email Workflows",
      icon: <Mail className="h-4 w-4" />,
      href: "/email-workflows",
      active: currentPath === "/email-workflows"
    },
    {
      label: "System Uploads",
      icon: <Upload className="h-4 w-4" />,
      href: "/system-uploads",
      active: currentPath === "/system-uploads"
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
