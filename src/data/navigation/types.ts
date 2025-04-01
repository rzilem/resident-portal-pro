
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  active: boolean;
  tooltip?: string;
  items?: NavItem[];
}
