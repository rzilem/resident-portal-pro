export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  cardStyle: 'default' | 'flat' | 'rounded' | 'glass';
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
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  bio?: string;
  createdAt?: string;
  lastLogin?: string;
  status?: string;
  type?: string;
  associationIds?: string[];
  committees?: string[];
  profileImageUrl?: string;
  customFields?: CustomField[];
  emergencyContacts?: EmergencyContact[];
  vehicleInfo?: VehicleInfo[];
  communicationPreferences?: CommunicationPreferences;
  permissions?: ModulePermissions;
  securityLevel?: SecurityLevel;
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
  phoneNumber: string;
  email?: string;
  isAuthorized?: boolean;
}

export interface VehicleInfo {
  id: string;
  make: string;
  model: string;
  year: string | number;
  color: string;
  licensePlate: string;
  parkingSpot?: string;
}

export interface CommunicationPreferences {
  emailFrequency: 'immediate' | 'daily' | 'weekly';
  notificationTopics: string[];
  channels?: {
    email: boolean;
    sms: boolean;
    app: boolean;
  };
  allowEmailNotifications: boolean;
  allowSmsNotifications: boolean;
  allowPushNotifications: boolean;
  subscribedTopics?: string[];
}

export type UserRole = 'admin' | 'manager' | 'staff' | 'resident' | 'board_member' | 'board' | 'committee' | 'guest';

export type SecurityLevel = 'full_access' | 'moderate_access' | 'limited_access' | 'view_only' | 'full' | 'advanced' | 'basic' | 'restricted' | 'elevated';

export type GlobalPermission = 'create' | 'read' | 'update' | 'delete' | 'admin' | 'manage' | 'contribute' | 'none';

export interface ModulePermissions {
  accounting: GlobalPermission[];
  communications: GlobalPermission[];
  properties: GlobalPermission[];
  residents: GlobalPermission[];
  vendors: GlobalPermission[];
  settings: GlobalPermission[];
  calendar?: GlobalPermission[];
  documents?: GlobalPermission[];
  reports?: GlobalPermission[];
  maintenance?: GlobalPermission[];
}
