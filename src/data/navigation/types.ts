
import { LucideIcon } from 'lucide-react';

// Define the NavItem type with proper structure
export type NavItem = {
  label: string;
  icon: LucideIcon; // Using LucideIcon type
  active: boolean;
  href?: string; // Make href optional
  tooltip?: string; // Add tooltip property
  items?: {
    label: string;
    href: string;
    active: boolean;
    icon?: LucideIcon; // Optional icon for sub-items
    tooltip?: string; // Add tooltip property for sub-items
    submenu?: {
      label: string;
      href: string;
      active: boolean;
      tooltip?: string; // Add tooltip property for sub-submenu items
    }[];
  }[];
};

export type NavigationItem = NavItem | "separator";
