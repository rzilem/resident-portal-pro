
/**
 * Association type definitions for the application
 */

export interface Association {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    website?: string;
  };
  type: 'hoa' | 'condo' | 'coop' | 'other';
  foundedDate: string;
  units: number;
  managementCompanyId?: string;
  status: 'active' | 'inactive';
  settings?: AssociationSettings;
}

export interface AssociationSettings {
  fiscalYearStart: string; // MM-DD format
  feesFrequency: 'monthly' | 'quarterly' | 'annually';
  documents: {
    storageLimit: number; // in MB
    allowedTypes: string[];
  };
  board: {
    termLength: number; // in months
    maximumMembers: number;
  };
  communications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    announcementsEnabled: boolean;
  };
  modules: {
    maintenance: boolean;
    violations: boolean;
    voting: boolean;
    accounting: boolean;
    documents: boolean;
    calendar: boolean;
  };
}
