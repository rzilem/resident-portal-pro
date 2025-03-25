
export interface JournalEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  status: 'draft' | 'posted' | 'void';
  lines: JournalEntryLine[];
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntryLine {
  id: string;
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
  description?: string;
}

export interface GLAccount {
  id: string;
  code: string;
  name: string;
  category: string;
  type: string;
  isActive: boolean;
  associationId?: string; // Optional for association-specific accounts
  isMaster?: boolean;     // Indicates if this is a master account
  description?: string;   // Optional detailed description
}

// Types for account categories
export type GLAccountType = 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';

export type GLAccountCategory = 'Assets' | 'Liabilities' | 'Equity' | 'Revenue' | 'Expenses' | 'Other';
