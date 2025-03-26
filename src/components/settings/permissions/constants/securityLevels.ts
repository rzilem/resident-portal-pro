
import { SecurityLevel } from '@/types/user';
import { Shield, ShieldAlert, ShieldCheck, ShieldOff, ShieldQuestion } from "lucide-react";
import React from 'react';

// Security level descriptions
export const securityLevelDescriptions: Record<SecurityLevel, string> = {
  full_access: 'Complete access to all features and settings',
  full: 'Complete access to all features and settings',
  advanced: 'Advanced access to most features and settings',
  elevated: 'Elevated access for users with higher responsibilities',
  moderate_access: 'Moderate access to certain features',
  limited_access: 'Limited access to assigned features',
  basic: 'Basic access to common features',
  restricted: 'Restricted access to specific features only',
  view_only: 'Read-only access with no modification capabilities'
};

// Security level icons with color variations
export const securityLevelIcons: Record<SecurityLevel, () => React.ReactNode> = {
  full_access: () => <Shield className="h-4 w-4 text-amber-500" />,
  full: () => <Shield className="h-4 w-4 text-amber-500" />,
  advanced: () => <ShieldCheck className="h-4 w-4 text-purple-500" />,
  elevated: () => <ShieldCheck className="h-4 w-4 text-green-500" />,
  moderate_access: () => <Shield className="h-4 w-4 text-blue-500" />,
  limited_access: () => <ShieldQuestion className="h-4 w-4 text-blue-400" />,
  basic: () => <Shield className="h-4 w-4 text-blue-500" />,
  restricted: () => <ShieldOff className="h-4 w-4 text-red-500" />,
  view_only: () => <ShieldOff className="h-4 w-4 text-gray-500" />
};

// Default role permissions with the correct structure for RolesPermissionManagement
export const rolePermissionsData: Record<string, {
  securityLevel: SecurityLevel,
  globalPermission: string,
  modules: Record<string, string>
}> = {
  admin: {
    securityLevel: 'full_access',
    globalPermission: 'admin',
    modules: {
      properties: 'admin',
      accounting: 'admin',
      communications: 'admin',
      calendar: 'admin',
      documents: 'admin',
      reports: 'admin',
      settings: 'admin',
      residents: 'admin',
      maintenance: 'admin'
    }
  },
  manager: {
    securityLevel: 'advanced',
    globalPermission: 'manage',
    modules: {
      properties: 'edit',
      accounting: 'edit',
      communications: 'edit',
      calendar: 'edit',
      documents: 'edit',
      reports: 'view',
      settings: 'view',
      residents: 'edit',
      maintenance: 'edit'
    }
  },
  board_member: {
    securityLevel: 'elevated',
    globalPermission: 'approve',
    modules: {
      properties: 'view',
      accounting: 'view',
      communications: 'edit',
      calendar: 'edit',
      documents: 'view',
      reports: 'view',
      settings: 'none',
      residents: 'view',
      maintenance: 'approve'
    }
  },
  board: {
    securityLevel: 'elevated',
    globalPermission: 'approve',
    modules: {
      properties: 'view',
      accounting: 'view',
      communications: 'edit',
      calendar: 'edit',
      documents: 'view',
      reports: 'view',
      settings: 'none',
      residents: 'view',
      maintenance: 'approve'
    }
  },
  committee: {
    securityLevel: 'moderate_access',
    globalPermission: 'contribute',
    modules: {
      properties: 'view',
      accounting: 'none',
      communications: 'create',
      calendar: 'create',
      documents: 'view',
      reports: 'none',
      settings: 'none',
      residents: 'view',
      maintenance: 'create'
    }
  },
  staff: {
    securityLevel: 'limited_access',
    globalPermission: 'contribute',
    modules: {
      properties: 'view',
      accounting: 'none',
      communications: 'create',
      calendar: 'create',
      documents: 'view',
      reports: 'none',
      settings: 'none',
      residents: 'view',
      maintenance: 'create'
    }
  },
  resident: {
    securityLevel: 'basic',
    globalPermission: 'view',
    modules: {
      properties: 'view',
      accounting: 'none',
      communications: 'view',
      calendar: 'view',
      documents: 'view',
      reports: 'none',
      settings: 'none',
      residents: 'none',
      maintenance: 'create'
    }
  },
  guest: {
    securityLevel: 'restricted',
    globalPermission: 'none',
    modules: {
      properties: 'none',
      accounting: 'none',
      communications: 'none',
      calendar: 'view',
      documents: 'none',
      reports: 'none',
      settings: 'none',
      residents: 'none',
      maintenance: 'none'
    }
  }
};

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
