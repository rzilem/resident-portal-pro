
/**
 * User type definitions for the application
 */

import { DashboardLayout } from './dashboard';
import { PropertyColumn } from '@/components/properties/PropertyColumnsSelector';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  associationIds?: string[];
  createdAt: string;
  lastLogin?: string;
  preferences?: UserPreferences;
  status: 'active' | 'inactive' | 'pending';
  type?: UserType;
  permissions?: PermissionSet;
  committees?: string[];
  isInvoiceApprover?: boolean;
}

export type UserRole = 
  | 'admin'
  | 'manager'
  | 'board'
  | 'committee'
  | 'resident'
  | 'guest';

export type UserType =
  | 'homeowner'
  | 'tenant'
  | 'vendor'
  | 'staff'
  | 'other';

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  cardStyle?: 'default' | 'flat' | 'glass';
  density?: 'comfortable' | 'compact';
  animations?: boolean;
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  calendarView?: 'day' | 'week' | 'month' | 'agenda';
  dashboardLayout?: DashboardLayout;
  dashboardWidgets?: string[];
  propertyTableColumns?: PropertyColumn[];
}

// Permission definitions
export interface PermissionSet {
  global?: GlobalPermission;
  modules?: ModulePermissions;
  entities?: EntityPermissions;
  securityLevel?: SecurityLevel;
}

export type SecurityLevel = 
  | 'restricted'   // Very limited access
  | 'basic'        // Standard user access
  | 'elevated'     // More access than basic
  | 'advanced'     // High level of access
  | 'full';        // Full system access

export type GlobalPermission =
  | 'none'          // No global permissions
  | 'read'          // Read-only access to allowed areas
  | 'contribute'    // Can contribute content but not approve or delete
  | 'manage'        // Can manage but with restrictions
  | 'admin';        // Full admin privileges

export interface ModulePermissions {
  properties?: Permission;
  accounting?: Permission;
  communications?: Permission;
  calendar?: Permission;
  documents?: Permission;
  reports?: Permission;
  settings?: Permission;
  residents?: Permission;
  maintenance?: Permission;
}

export interface EntityPermissions {
  users?: Permission;
  invoices?: Permission;
  payments?: Permission;
  announcements?: Permission;
  templates?: Permission;
  workOrders?: Permission;
  violations?: Permission;
}

export type Permission = 
  | 'none'       // No access
  | 'view'       // View-only permissions
  | 'create'     // Can create but not edit/delete
  | 'edit'       // Can create and edit but not delete
  | 'delete'     // Full CRUD permissions
  | 'approve'    // Can approve/reject items
  | 'admin';     // Full control including settings
