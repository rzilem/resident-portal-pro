
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
}

// Use type from resident.ts
import { Tag, TagType } from '@/types/resident';

export type VendorTag = Tag;

// Keep for backward compatibility but mark as deprecated
/** @deprecated Use TagType from resident.ts instead */
export type VendorTagType = TagType;

export interface VendorInsurance {
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
  }[];
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
}

export interface VendorService {
  id: string;
  name: string;
  description?: string;
  rate?: number;
  rateType?: 'hourly' | 'fixed' | 'monthly';
}
