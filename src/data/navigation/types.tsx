
import { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
  items?: NavItem[];
  active?: boolean;
}

export type NavigationItem = NavItem | "separator";
