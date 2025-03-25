
import React from 'react';

// Define the NavItem type with proper structure
export type NavItem = {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  href?: string; // Make href optional
  items?: {
    label: string;
    href: string;
    active: boolean;
    icon?: React.ReactNode; // Add optional icon support for sub-items
  }[];
};

export type NavigationItem = NavItem | "separator";
