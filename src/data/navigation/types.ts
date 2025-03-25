
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
  }[];
};

export type NavigationItem = NavItem | "separator";
