
export type UserRole = 'admin' | 'manager' | 'staff' | 'resident' | 'board_member' | 'board' | 'vendor' | 'committee' | 'guest' | 'invoice_approver';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'blocked';
export type SecurityLevel = 
  | 'basic' 
  | 'elevated' 
  | 'full_access' 
  | 'full' 
  | 'advanced' 
  | 'moderate_access' 
  | 'limited_access' 
  | 'restricted' 
  | 'view_only';

export type GlobalPermission = 'admin' | 'manage' | 'approve' | 'contribute' | 'view' | 'none';

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
  isAuthorized: boolean;
}

export interface VehicleInfo {
  id: string;
  make: string;
  model: string;
  year?: number;
  color?: string;
  licensePlate: string;
  parkingSpot?: string;
}

export interface CommunicationPreferences {
  allowEmailNotifications: boolean;
  allowSmsNotifications: boolean;
  allowPushNotifications: boolean;
  emailFrequency: 'immediate' | 'daily' | 'weekly';
  notificationTopics?: string[];
  subscribedTopics?: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  status: UserStatus;
  securityLevel: SecurityLevel;
  phoneNumber?: string;
  address?: string;
  profileImageUrl?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  customFields?: CustomField[];
  meta?: Record<string, any>;
  bio?: string;
  // Additional fields for profile
  type?: string;
  associationIds?: string[];
  committees?: string[];
  emergencyContacts?: EmergencyContact[];
  vehicleInfo?: VehicleInfo[];
  communicationPreferences?: CommunicationPreferences;
}

export interface UserPreferences {
  cardStyle?: 'default' | 'flat' | 'glass';
  density?: 'comfortable' | 'compact' | 'spacious';
  animations?: boolean;
  themePreset?: string;
  customColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    text?: string;
    border?: string;
  };
  customBackground?: {
    type: 'color' | 'gradient' | 'image';
    value: string;
  };
  invoiceTableColumns?: any[];
  databasePropertyColumns?: any[];
  databaseUnitColumns?: any[];
  databaseHomeownerColumns?: any[];
  databaseTransactionColumns?: any[];
  [key: string]: any;
}

export interface FeaturePermission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface ModuleFeature {
  [key: string]: FeaturePermission[];
}

// Make sure moduleFeatures is properly exported
export const moduleFeatures: ModuleFeature = {
  properties: [
    { id: 'add_property', name: 'Add Property', description: 'Create new properties', enabled: true },
    { id: 'edit_property', name: 'Edit Property', description: 'Modify property details', enabled: true },
    { id: 'delete_property', name: 'Delete Property', description: 'Remove properties', enabled: false },
    { id: 'view_property_financials', name: 'View Financials', description: 'Access financial data', enabled: true }
  ],
  accounting: [
    { id: 'create_invoice', name: 'Create Invoice', description: 'Create new invoices', enabled: true },
    { id: 'approve_payment', name: 'Approve Payment', description: 'Approve payment transactions', enabled: false },
    { id: 'view_reports', name: 'View Reports', description: 'Access financial reports', enabled: true }
  ],
  communications: [
    { id: 'send_announcement', name: 'Send Announcement', description: 'Send announcements to residents', enabled: true },
    { id: 'create_template', name: 'Create Template', description: 'Create communication templates', enabled: true }
  ]
};
