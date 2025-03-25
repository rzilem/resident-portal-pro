
import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { NavItem } from './types';

export const getDashboardItem = (currentPath: string): NavItem => ({
  label: "Dashboard",
  icon: <LayoutDashboard className="h-4 w-4" />,
  href: "/dashboard",
  active: currentPath === "/dashboard"
});
