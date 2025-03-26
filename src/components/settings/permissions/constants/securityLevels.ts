
import React from 'react';
import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";
import { SecurityLevel, UserRole, GlobalPermission, ModulePermissions } from "@/types/user";

// For TypeScript files (.ts not .tsx), we can't use JSX directly
// Instead we need to use React.createElement
export const securityLevelIcons: Record<SecurityLevel, () => React.ReactNode> = {
  'restricted': () => React.createElement(Shield, { className: "h-4 w-4 text-red-500" }),
  'basic': () => React.createElement(Shield, { className: "h-4 w-4 text-blue-500" }),
  'elevated': () => React.createElement(Shield, { className: "h-4 w-4 text-green-500" }),
  'advanced': () => React.createElement(ShieldCheck, { className: "h-4 w-4 text-purple-500" }),
  'full': () => React.createElement(ShieldAlert, { className: "h-4 w-4 text-amber-500" }),
  'full_access': () => React.createElement(ShieldAlert, { className: "h-4 w-4 text-yellow-500" }),
  'moderate_access': () => React.createElement(ShieldCheck, { className: "h-4 w-4 text-teal-500" }),
  'limited_access': () => React.createElement(Shield, { className: "h-4 w-4 text-indigo-500" }),
  'view_only': () => React.createElement(Shield, { className: "h-4 w-4 text-gray-500" })
};

export const securityLevelDescriptions: Record<SecurityLevel, string> = {
  'restricted': 'Very limited access to specific features only',
  'basic': 'Standard access for regular users',
  'elevated': 'Extended permissions for trusted users',
  'advanced': 'High level access for managers/supervisors',
  'full': 'Complete system access for administrators',
  'full_access': 'Complete system access and configuration abilities',
  'moderate_access': 'Access to most features with some restrictions',
  'limited_access': 'Access to a subset of features with many restrictions',
  'view_only': 'Read-only access with no modification capabilities'
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
  'board_member': {
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
  'staff': {
    securityLevel: 'moderate_access',
    globalPermission: 'update',
    modules: {
      properties: 'view',
      accounting: 'view',
      communications: 'view',
      calendar: 'view',
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
