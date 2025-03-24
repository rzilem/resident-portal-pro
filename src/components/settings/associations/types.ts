
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

// Adding missing types referenced by accounting components
export interface BudgetItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  fiscalYear: string;
  createdAt: string;
  status: 'draft' | 'approved' | 'rejected';
}

export interface FinancialDocument {
  id: string;
  title: string;
  documentType: string;
  createdAt: string;
  fileSize: string;
  status: string;
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  status: string;
  customer: {
    name: string;
    id: string;
  };
}

export interface VendorPayment {
  id: string;
  vendor: string;
  amount: number;
  date: string;
  status: string;
  paymentMethod: string;
  reference: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  account: string;
  status: string;
}

export interface TransactionType {
  id: string;
  name: string;
  category: string;
}

export interface Interaction {
  id: string;
  type: string;
  date: string;
  user: string;
  description: string;
  status: string;
}
