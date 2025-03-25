import React from 'react';
import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import { SecurityLevel, UserRole, GlobalPermission, ModulePermissions } from "@/types/user";

export const securityLevelIcons: Record<SecurityLevel, () => React.ReactNode> = {
  'restricted': () => <Shield className="h-4 w-4 text-red-500" />,
  'basic': () => <Shield className="h-4 w-4 text-blue-500" />,
  'elevated': () => <Shield className="h-4 w-4 text-green-500" />,
  'advanced': () => <ShieldCheck className="h-4 w-4 text-purple-500" />,
  'full': () => <ShieldAlert className="h-4 w-4 text-amber-500" />
};

export const securityLevelDescriptions: Record<SecurityLevel, string> = {
  'restricted': 'Very limited access to specific features only',
  'basic': 'Standard access for regular users',
  'elevated': 'Extended permissions for trusted users',
  'advanced': 'High level access for managers/supervisors',
  'full': 'Complete system access for administrators'
};

export const defaultRolePermissions: Record<UserRole, {
  securityLevel: SecurityLevel,
  globalPermission: GlobalPermission,
  modules: Partial<Record<keyof ModulePermissions, string>>
}> = {
  'admin': {
    securityLevel: 'full',
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
  'manager': {
    securityLevel: 'advanced',
    globalPermission: 'manage',
    modules: {
      properties: 'edit',
      accounting: 'edit',
      communications: 'edit',
      calendar: 'edit',
      documents: 'edit',
      reports: 'view',
      settings: 'edit',
      residents: 'edit',
      maintenance: 'approve'
    }
  },
  'board': {
    securityLevel: 'elevated',
    globalPermission: 'contribute',
    modules: {
      properties: 'view',
      accounting: 'view',
      communications: 'create',
      calendar: 'edit',
      documents: 'view',
      reports: 'view',
      settings: 'none',
      residents: 'view',
      maintenance: 'create'
    }
  },
  'committee': {
    securityLevel: 'elevated',
    globalPermission: 'contribute',
    modules: {
      properties: 'view',
      accounting: 'none',
      communications: 'create',
      calendar: 'edit',
      documents: 'view',
      reports: 'view',
      settings: 'none',
      residents: 'view',
      maintenance: 'view'
    }
  },
  'resident': {
    securityLevel: 'basic',
    globalPermission: 'read',
    modules: {
      properties: 'view',
      accounting: 'view',
      communications: 'view',
      calendar: 'view',
      documents: 'view',
      reports: 'none',
      settings: 'none',
      residents: 'none',
      maintenance: 'create'
    }
  },
  'guest': {
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
