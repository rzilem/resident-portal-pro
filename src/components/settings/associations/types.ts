
export interface Association {
  id: string;
  name: string;
  units: number;
  address: string;
  isActive: boolean;
  isDefault?: boolean;
  settings?: {
    [key: string]: any;
  }
}

export interface SettingSection {
  id: string;
  title: string;
  icon: any;
  description: string;
}

export interface AssociationMenuItem {
  id: string;
  title: string;
  icon: any;
  route: string;
  hasSubmenu?: boolean;
}

export interface AssociationMenuCategory {
  id: string;
  title: string;
  items: AssociationMenuItem[];
}

// Budget Management Types
export interface BudgetItem {
  id: string;
  category: string;
  description: string;
  budgetedAmount: number;
  actualAmount: number;
  variance: number;
  fiscalYear: string;
  associationId?: string;
  amount?: number; // For backward compatibility
  createdAt?: string;
  status?: 'draft' | 'approved' | 'rejected';
}

// Financial Document Types
export interface FinancialDocument {
  id: string;
  title: string;
  type: string;
  documentType?: string; // For backward compatibility
  url?: string;
  uploadDate: string;
  createdAt?: string;
  fileSize?: string;
  status?: string;
  associationId?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

// Invoice Types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  number?: string; // For backward compatibility
  date: string;
  dueDate: string;
  amount: number;
  status: string;
  recipientId: string;
  recipientType: 'resident' | 'vendor';
  customer?: {
    name: string;
    id: string;
  };
  items?: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    category: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
}

// Vendor Payment Types
export interface VendorPayment {
  id: string;
  vendor: string;
  vendorId?: string; // Used in some components
  invoiceId?: string;
  amount: number;
  date: string;
  description?: string;
  status: string;
  paymentMethod: string;
  reference?: string;
  referenceNumber?: string;
  associationId?: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string; // Changed from TransactionType to string
  category: string;
  account: string;
  status: string;
  propertyId?: string;
  residentId?: string;
  referenceNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Now a simple string enum
export type TransactionType = string;

// Interaction Types
export interface Interaction {
  id: string;
  type: string;
  date: string;
  subject: string;
  description: string;
  status: string;
  user?: string; // For backward compatibility
  associationId?: string;
  residentId?: string;
  propertyId?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  referenceCode?: string;
  attachments?: string[];
}
