
import { 
  User, 
  Mail, 
  FileText, 
  BarChart4 
} from 'lucide-react';
import { NavigationItem } from './types';

export const getLeadsSection = (currentPath: string): NavigationItem => {
  const isActive = 
    currentPath.startsWith('/leads') || 
    currentPath.startsWith('/proposal') ||
    currentPath.startsWith('/lead-details');
  
  return {
    label: 'Lead Management',
    icon: User,
    href: '/leads',
    active: isActive,
    items: [
      {
        label: 'Leads Dashboard',
        icon: User,
        href: '/leads',
        active: currentPath === '/leads'
      },
      {
        label: 'Proposals',
        icon: FileText,
        href: '/leads?tab=proposals',
        active: currentPath === '/leads?tab=proposals' || currentPath.startsWith('/proposal')
      },
      {
        label: 'Email Campaigns',
        icon: Mail,
        href: '/leads?tab=emails',
        active: currentPath === '/leads?tab=emails'
      },
      {
        label: 'Analytics',
        icon: BarChart4,
        href: '/leads?tab=analytics',
        active: currentPath === '/leads?tab=analytics'
      }
    ]
  };
};
