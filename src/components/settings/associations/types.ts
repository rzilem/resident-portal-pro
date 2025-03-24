
export interface Association {
  id: string;
  name: string;
  units: number;
  address: string;
  isActive: boolean;
  isDefault: boolean;
  settings?: Record<string, any>;
}

export type SettingSection = {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

export type AssociationMenuItem = {
  id: string;
  title: string;
  icon?: React.ElementType;
  description?: string;
  hasSubmenu?: boolean;
  route?: string;
}

export type AssociationMenuCategory = {
  id: string;
  title: string;
  items: AssociationMenuItem[];
}

export type AssociationTabs = {
  id: string;
  title: string;
  icon?: React.ElementType;
}

export type TransactionType = 
  | 'payment' 
  | 'assessment' 
  | 'fine' 
  | 'fee' 
  | 'credit' 
  | 'refund' 
  | 'adjustment';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  description: string;
  propertyId?: string;
  unitId?: string;
  residentId?: string;
  status: 'pending' | 'completed' | 'failed' | 'void';
  referenceNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'void' | 'partially_paid';
  recipientId: string;
  recipientType: 'resident' | 'vendor' | 'association';
  items: InvoiceItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category?: string;
}

export interface Interaction {
  id: string;
  type: 'email' | 'call' | 'letter' | 'meeting' | 'violation' | 'other';
  date: string;
  subject: string;
  description: string;
  associationId: string;
  residentId?: string;
  propertyId?: string;
  status: 'pending' | 'completed' | 'scheduled' | 'cancelled';
  attachments?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  referenceCode: string; // Unique ID label for tracking
}

export interface BudgetItem {
  id: string;
  category: string;
  description: string;
  budgetedAmount: number;
  actualAmount: number;
  variance: number;
  fiscalYear: string;
  associationId: string;
}

export interface VendorPayment {
  id: string;
  vendorId: string;
  invoiceId?: string;
  amount: number;
  date: string;
  description: string;
  status: 'pending' | 'paid' | 'void';
  paymentMethod: string;
  referenceNumber?: string;
  associationId: string;
}

export interface FinancialDocument {
  id: string;
  title: string;
  type: 'receipt' | 'invoice' | 'statement' | 'tax' | 'audit' | 'other';
  url: string;
  uploadDate: string;
  associationId: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

// Adding additional financial entities

export interface BankAccount {
  id: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  accountType: 'checking' | 'savings' | 'reserve';
  balance: number;
  isActive: boolean;
  associationId: string;
  lastReconciled?: string;
}

export interface ReserveFund {
  id: string;
  name: string;
  description: string;
  currentBalance: number;
  targetAmount: number;
  contributionFrequency: 'monthly' | 'quarterly' | 'annually';
  contributionAmount: number;
  establishedDate: string;
  lastUpdated: string;
  associationId: string;
}

export interface TaxDocument {
  id: string;
  title: string;
  year: string;
  type: 'federal' | 'state' | 'local' | 'property';
  fileUrl: string;
  dateFiled: string;
  preparedBy: string;
  associationId: string;
  status: 'draft' | 'filed' | 'accepted' | 'amended';
}

export interface FinancialApproval {
  id: string;
  description: string;
  amount: number;
  requestedBy: string;
  requestedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'on_hold';
  category: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
  attachments?: string[];
  associationId: string;
}

export interface AuditTrail {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  entityType: 'transaction' | 'invoice' | 'payment' | 'budget' | 'approval' | 'document';
  entityId: string;
  details: string;
  ipAddress?: string;
  associationId: string;
}
