
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
}
