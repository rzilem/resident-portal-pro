
export interface Vendor {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  status: 'active' | 'inactive';
  paymentTerms: string;
  paymentMethod: string;
  taxId: string;
  notes?: string;
  createdAt: string;
  rating?: number;
  services?: string[];
  tags?: VendorTag[];
  lastInvoiceDate?: string;
  insurance?: VendorInsurance;
  association_id?: string;
  payment_terms_id?: string;
}

// Use type from resident.ts with extension
import { Tag } from '@/types/resident';

// Extend the vendor tag type with vendor-specific types
export type VendorTagType = 'positive' | 'negative' | 'info' | 'reliability' | 'pricing' | 'service' | 'amenity' | 'property' | 'custom' | 'board' | 'committee' | 'delinquent';

// Create a vendor-specific tag interface
export interface VendorTag {
  id: string;
  type: VendorTagType;
  label: string;
  color?: string;
  createdAt?: string;
}

export interface VendorInsurance {
  id?: string;
  policyNumber?: string;
  provider?: string;
  expirationDate?: string;
  coverageAmount?: number;
  coverageType?: string;
  agent?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  documents?: {
    id: string;
    name: string;
    url?: string;
    uploadDate: string;
    expirationDate?: string;
    isVerified?: boolean;
  }[];
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  nextVerificationDate?: string;
}

export interface VendorInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
  dueDate: string;
  paymentDate?: string;
  associationName?: string;
}

export interface VendorService {
  id: string;
  name: string;
  description?: string;
  rate?: number;
  rateType?: 'hourly' | 'fixed' | 'monthly';
}

export interface VendorCategory {
  id: string;
  name: string;
  description?: string;
}

export interface VendorRating {
  id: string;
  vendorId: string;
  rating: number;
  comment?: string;
  ratedBy?: string;
  createdAt: string;
}

export interface PaymentTerms {
  id: string;
  name: string;
  daysDue: number;
  description?: string;
}

export interface InsuranceNotification {
  id: string;
  vendorId: string;
  insuranceId?: string;
  notificationType: string;
  scheduledDate: string;
  sentAt?: string;
  recipient?: string;
  status: 'pending' | 'sent' | 'failed';
}

export interface InsuranceRequirement {
  id: string;
  vendorCategoryId: string;
  minCoverageAmount?: number;
  requiredCoverageTypes?: string[];
  description?: string;
}
