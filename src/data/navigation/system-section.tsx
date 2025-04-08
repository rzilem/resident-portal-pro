
import { Cog, Building, Shield, Puzzle, Sliders, Upload, Mail, Clock } from 'lucide-react';
import { NavItem } from './types';

export const getSystemSection = (currentPath: string): NavItem => ({
  label: "System",
  icon: Cog,
  active: currentPath.startsWith("/integrations") || 
          currentPath.startsWith("/settings") ||
          currentPath.startsWith("/system-uploads") ||
          currentPath.startsWith("/system/processes") ||
          currentPath.startsWith("/email-workflows"),
  href: "/integrations", // Default href
  items: [
    {
      label: "Integrations",
      icon: Puzzle,
      href: "/integrations",
      active: currentPath === "/integrations"
    },
    {
      label: "Settings",
      icon: Sliders,
      href: "/settings",
      active: currentPath === "/settings"
    },
    {
      label: "Email Workflows",
      icon: Mail,
      href: "/email-workflows",
      active: currentPath === "/email-workflows"
    },
    {
      label: "Data Import & Export",
      icon: Upload,
      href: "/system-uploads",
      active: currentPath === "/system-uploads"
    },
    {
      label: "Workflow Schedule",
      icon: Clock,
      href: "/system/processes",
      active: currentPath === "/system/processes"
    },
    {
      label: "Associations",
      icon: Building,
      href: "/settings/associations",
      active: currentPath.startsWith("/settings/associations")
    },
    {
      label: "Permissions",
      icon: Shield,
      href: "/settings/permissions",
      active: currentPath.startsWith("/settings/permissions")
    }
  ]
});
