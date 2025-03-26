
import { LucideIcon } from 'lucide-react';

// Define the NavItem type with proper structure
export type NavItem = {
  label: string;
  icon: LucideIcon; // Updated to LucideIcon type
  active: boolean;
  href?: string; // Make href optional
  items?: {
    label: string;
    href: string;
    active: boolean;
    icon?: LucideIcon; // Updated to LucideIcon type for sub-items
    submenu?: {
      label: string;
      href: string;
      active: boolean;
    }[];
  }[];
};

export type NavigationItem = NavItem | "separator";
