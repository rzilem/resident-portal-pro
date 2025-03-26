
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
}

export type VendorTag = {
  id: string;
  label: string;
  color: string;
  type: VendorTagType;
  createdAt: string;
};

export type VendorTagType = 'service' | 'reliability' | 'pricing' | 'custom';

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
