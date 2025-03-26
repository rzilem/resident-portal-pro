
import { LayoutDashboard } from 'lucide-react';
import { NavItem } from './types';

export const getDashboardItem = (currentPath: string): NavItem => ({
  label: "Dashboard",
  icon: LayoutDashboard,
  href: "/dashboard",
  active: currentPath === "/dashboard"
});
