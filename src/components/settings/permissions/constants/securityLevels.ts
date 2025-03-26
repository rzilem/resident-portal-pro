
import { SecurityLevel } from '@/types/user';

export const defaultRolePermissions: Record<string, { securityLevel: SecurityLevel, description: string }> = {
  admin: {
    securityLevel: 'full_access',
    description: 'Complete access to all features and settings'
  },
  manager: {
    securityLevel: 'advanced',
    description: 'Advanced access to most features and settings'
  },
  board_member: {
    securityLevel: 'elevated',
    description: 'Elevated access to board-related features'
  },
  board: {
    securityLevel: 'elevated',
    description: 'Access to board-related features'
  },
  committee: {
    securityLevel: 'moderate_access',
    description: 'Moderate access to committee-related features'
  },
  staff: {
    securityLevel: 'limited_access',
    description: 'Limited access to assigned features'
  },
  resident: {
    securityLevel: 'basic',
    description: 'Basic access to resident features'
  },
  guest: {
    securityLevel: 'restricted',
    description: 'Restricted access to specific features'
  }
};
