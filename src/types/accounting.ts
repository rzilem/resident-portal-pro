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
  parentId?: string;      // For hierarchical GL accounts
}

// Types for account categories
export type GLAccountType = 'Asset' | 'Liability' | 'Equity' | 'Income' | 'Expense';

export type GLAccountCategory = 'Assets' | 'Liabilities' | 'Equity' | 'Revenue' | 'Expenses' | 'Other';

// New types for the enhanced accounting system
export interface BankAccount {
  id: string;
  associationId: string;
  name: string;
  accountType: 'operating' | 'reserve' | 'cd' | 'other';
  accountNumber?: string;
  routingNumber?: string;
  balance: number;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LedgerEntry {
  id: string;
  associationId: string;
  accountId?: string;
  glAccountId?: string;
  transactionDate: string;
  entryType: 'debit' | 'credit';
  amount: number;
  description?: string;
  referenceNumber?: string;
  journalEntryId?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankStatement {
  id: string;
  associationId: string;
  bankAccountId: string;
  statementDate: string;
  beginningBalance: number;
  endingBalance: number;
  isReconciled: boolean;
  reconciledDate?: string;
  reconciledBy?: string;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankTransaction {
  id: string;
  associationId: string;
  bankAccountId: string;
  transactionDate: string;
  amount: number;
  description?: string;
  transactionType: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'fee';
  checkNumber?: string;
  status: 'pending' | 'cleared' | 'reconciled';
  isReconciled: boolean;
  statementId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialSummary {
  operatingBalance: number;
  reserveBalance: number;
  otherBalance: number;
  totalAssets: number;
  totalLiabilities: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  yearToDateIncome: number;
  yearToDateExpenses: number;
}
