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
  
  // Theme customization preferences
  themePreset?: string;
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  customBackground?: {
    type: 'url' | 'data' | 'pattern';
    value: string;
  } | null;
  
  // Company branding settings
  logoUrl?: string | null;
  companyName?: string;
  
  // Voice greeting settings
  voiceGreetingEnabled?: boolean;
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

export type UserRole = 'admin' | 'manager' | 'staff' | 'resident' | 'board_member' | 'board' | 'committee' | 'guest' | 'invoice_approver';

export type SecurityLevel = 'full_access' | 'moderate_access' | 'limited_access' | 'view_only' | 'full' | 'advanced' | 'basic' | 'restricted' | 'elevated';

export type GlobalPermission = 'create' | 'read' | 'update' | 'delete' | 'admin' | 'manage' | 'contribute' | 'none' | 'view' | 'edit' | 'approve' | 'export' | 'share' | 'print' | 'assign' | 'configure' | 'invite' | 'report';

export interface ModulePermissions {
  accounting: GlobalPermission[];
  communications: GlobalPermission[];
  properties: GlobalPermission[];
  residents: GlobalPermission[];
  vendors?: GlobalPermission[];
  settings: GlobalPermission[];
  calendar?: GlobalPermission[];
  documents?: GlobalPermission[];
  reports?: GlobalPermission[];
  maintenance?: GlobalPermission[];
  compliance?: GlobalPermission[];
  resale?: GlobalPermission[];
}

// Permission Feature Maps
export interface ModuleFeatures {
  [key: string]: FeaturePermission[];
}

export interface FeaturePermission {
  feature: string;
  description: string;
  requiredPermission: GlobalPermission;
}

// Define specific features for each module with required permissions
export const moduleFeatures: ModuleFeatures = {
  calendar: [
    { feature: 'View Calendar', description: 'View all calendar events', requiredPermission: 'view' },
    { feature: 'Create Events', description: 'Add new events to the calendar', requiredPermission: 'create' },
    { feature: 'Edit Events', description: 'Modify existing calendar events', requiredPermission: 'edit' },
    { feature: 'Delete Events', description: 'Remove events from the calendar', requiredPermission: 'delete' },
    { feature: 'Export Calendar', description: 'Export calendar data to external formats', requiredPermission: 'export' },
    { feature: 'Share Events', description: 'Share events with other users', requiredPermission: 'share' },
    { feature: 'Print Calendar', description: 'Generate printable versions of the calendar', requiredPermission: 'print' },
    { feature: 'Manage Workflows', description: 'Create automated event workflows', requiredPermission: 'admin' }
  ],
  documents: [
    { feature: 'View Documents', description: 'Access and read documents', requiredPermission: 'view' },
    { feature: 'Upload Documents', description: 'Add new documents to the system', requiredPermission: 'create' },
    { feature: 'Edit Document Details', description: 'Modify document metadata', requiredPermission: 'edit' },
    { feature: 'Delete Documents', description: 'Remove documents from the system', requiredPermission: 'delete' },
    { feature: 'Share Documents', description: 'Share documents with others', requiredPermission: 'share' },
    { feature: 'Print Documents', description: 'Generate printable versions', requiredPermission: 'print' },
    { feature: 'Configure Categories', description: 'Manage document categories', requiredPermission: 'configure' },
    { feature: 'Export Documents', description: 'Export documents to external formats', requiredPermission: 'export' }
  ],
  residents: [
    { feature: 'View Residents', description: 'View resident information', requiredPermission: 'view' },
    { feature: 'Add Residents', description: 'Create new resident records', requiredPermission: 'create' },
    { feature: 'Edit Residents', description: 'Modify resident information', requiredPermission: 'edit' },
    { feature: 'Delete Residents', description: 'Remove resident records', requiredPermission: 'delete' },
    { feature: 'Export Resident Data', description: 'Export resident information', requiredPermission: 'export' },
    { feature: 'Print Resident Reports', description: 'Generate printable resident reports', requiredPermission: 'print' },
    { feature: 'Invite Residents', description: 'Send system invitations to residents', requiredPermission: 'invite' },
    { feature: 'Assign Tags', description: 'Add categorization tags to residents', requiredPermission: 'assign' }
  ],
  accounting: [
    { feature: 'View Financial Data', description: 'Access to view financial information', requiredPermission: 'view' },
    { feature: 'Edit Financial Records', description: 'Modify financial data and records', requiredPermission: 'edit' },
    { feature: 'Create Financial Entries', description: 'Add new financial entries', requiredPermission: 'create' },
    { feature: 'Approve Invoices', description: 'Review and approve pending invoices', requiredPermission: 'approve' },
    { feature: 'Delete Financial Records', description: 'Remove financial records', requiredPermission: 'delete' },
    { feature: 'Export Financial Data', description: 'Export financial information', requiredPermission: 'export' },
    { feature: 'Print Financial Reports', description: 'Generate printable financial reports', requiredPermission: 'print' },
    { feature: 'Generate Financial Reports', description: 'Create custom financial reports', requiredPermission: 'report' }
  ]
};
