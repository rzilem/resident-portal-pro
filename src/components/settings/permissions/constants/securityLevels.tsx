import { SecurityLevel } from '@/types/user';
import { Shield, ShieldAlert, ShieldCheck, ShieldOff, ShieldQuestion } from "lucide-react";
import React from 'react';

// Security level descriptions
export const securityLevelDescriptions: Record<SecurityLevel, string> = {
  full_access: 'Complete access to all features, settings, and administrative functions',
  full: 'Complete access to all features and settings',
  advanced: 'Advanced access to most features and settings with some administrative capabilities',
  elevated: 'Elevated access for users with higher responsibilities, such as board members',
  moderate_access: 'Moderate access to certain features with limited editing capabilities',
  limited_access: 'Limited access to assigned features with mainly viewing permissions',
  basic: 'Basic access to common features with minimal interaction permissions',
  restricted: 'Restricted access to specific features only, primarily view-only access',
  view_only: 'Read-only access with no modification capabilities across all modules'
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
      maintenance: 'admin',
      compliance: 'admin',
      resale: 'admin'
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
      maintenance: 'edit',
      compliance: 'edit',
      resale: 'edit'
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
      settings: 'view',
      residents: 'view',
      maintenance: 'approve',
      compliance: 'approve',
      resale: 'approve'
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
      settings: 'view',
      residents: 'view',
      maintenance: 'approve',
      compliance: 'approve',
      resale: 'approve'
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
      maintenance: 'create',
      compliance: 'create',
      resale: 'view'
    }
  },
  staff: {
    securityLevel: 'limited_access',
    globalPermission: 'contribute',
    modules: {
      properties: 'view',
      accounting: 'view',
      communications: 'create',
      calendar: 'create',
      documents: 'view',
      reports: 'view',
      settings: 'none',
      residents: 'view',
      maintenance: 'create',
      compliance: 'create',
      resale: 'create'
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
      maintenance: 'create',
      compliance: 'view',
      resale: 'view'
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
      maintenance: 'none',
      compliance: 'none',
      resale: 'none'
    }
  },
  invoice_approver: {
    securityLevel: 'limited_access',
    globalPermission: 'approve',
    modules: {
      properties: 'view',
      accounting: 'approve',
      communications: 'view',
      calendar: 'view',
      documents: 'view',
      reports: 'view',
      settings: 'none',
      residents: 'view',
      maintenance: 'view',
      compliance: 'view',
      resale: 'view'
    }
  }
};

export const defaultRolePermissions: Record<string, { securityLevel: SecurityLevel, description: string }> = {
  admin: {
    securityLevel: 'full_access',
    description: 'Complete access to all features, settings, and administrative functions'
  },
  manager: {
    securityLevel: 'advanced',
    description: 'Advanced access to most features and settings with some administrative capabilities'
  },
  board_member: {
    securityLevel: 'elevated',
    description: 'Elevated access to board-related features including approvals'
  },
  board: {
    securityLevel: 'elevated',
    description: 'Access to board-related features including approvals'
  },
  committee: {
    securityLevel: 'moderate_access',
    description: 'Moderate access to committee-related features and contributions'
  },
  staff: {
    securityLevel: 'limited_access',
    description: 'Limited access to assigned features with some creation rights'
  },
  resident: {
    securityLevel: 'basic',
    description: 'Basic access to resident-oriented features and self-service'
  },
  guest: {
    securityLevel: 'restricted',
    description: 'Restricted access to public features only'
  },
  invoice_approver: {
    securityLevel: 'limited_access',
    description: 'Special access for board members to approve invoices and financial documents'
  }
};

// Permission Descriptions
export const permissionDescriptions = {
  view: 'View and read information only',
  edit: 'Modify existing content',
  create: 'Create new content or records',
  delete: 'Remove existing content or records',
  approve: 'Provide formal approval on actions or content',
  admin: 'Full administrative control',
  export: 'Export data to external formats',
  share: 'Share content with others',
  print: 'Generate printable versions',
  assign: 'Assign tasks or responsibilities to others',
  manage: 'Oversee and coordinate activities',
  configure: 'Adjust settings and preferences',
  invite: 'Send invitations to new users',
  report: 'Generate or view reports'
};

// Module descriptions for better understanding
export const moduleDescriptions = {
  properties: 'Property management and records',
  accounting: 'Financial transactions and reporting',
  communications: 'Messages, announcements, and notifications',
  calendar: 'Events, schedules, and important dates',
  documents: 'File storage, sharing, and management',
  reports: 'Analytics, statistics, and summaries',
  settings: 'System configuration and preferences',
  residents: 'Homeowner and resident information',
  maintenance: 'Work orders, repairs, and facility management',
  compliance: 'Rules enforcement and violation tracking',
  resale: 'Property transfer and document generation'
};
