
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  cardStyle: 'default' | 'flat' | 'rounded';
  density: 'comfortable' | 'compact' | 'spacious';
  animations: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  calendarView: 'day' | 'week' | 'month' | 'year';
  dashboardLayout: {
    columns: number;
    widgets: Widget[];
  };
  dashboardWidgets: string[];
  invoiceTableColumns: InvoiceColumn[];
  vendorTableColumns?: any[];
  databasePropertyColumns?: any[];
  databaseUnitColumns?: any[];
  databaseHomeownerColumns?: any[];
  databaseTransactionColumns?: any[];
  propertyTableColumns?: any[];
  residentTableColumns?: any[];
}

export interface Widget {
  id: string;
  type: string;
  title: string;
  size: 'small' | 'medium' | 'large';
  position: number;
}

import { InvoiceColumn } from '@/components/accounting/invoices/InvoiceColumnsSelector';

// Add these types to fix build errors
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  customFields?: CustomField[];
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
  type: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface VehicleInfo {
  id: string;
  make: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
}

export interface CommunicationPreferences {
  emailFrequency: string;
  notificationTopics: string[];
  channels: {
    email: boolean;
    sms: boolean;
    app: boolean;
  };
}

export type UserRole = 'admin' | 'manager' | 'staff' | 'resident' | 'board_member';

export type SecurityLevel = 'full_access' | 'moderate_access' | 'limited_access' | 'view_only';

export type GlobalPermission = 'create' | 'read' | 'update' | 'delete';

export interface ModulePermissions {
  accounting: GlobalPermission[];
  communications: GlobalPermission[];
  properties: GlobalPermission[];
  residents: GlobalPermission[];
  vendors: GlobalPermission[];
  settings: GlobalPermission[];
}
