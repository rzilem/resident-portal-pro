
import { useState, useEffect } from 'react';
import { BankTransaction } from '@/types/accounting';
import { accountingLedgerService } from '@/services/accountingLedgerService';

interface UseBankTransactionsProps {
  bankAccountId?: string;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

interface UseBankTransactionsResult {
  transactions: BankTransaction[];
  loading: boolean;
  error: string | null;
  refreshTransactions: () => Promise<void>;
  createTransaction: (transaction: Omit<BankTransaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<BankTransaction | null>;
}

export const useBankTransactions = ({ 
  bankAccountId,
  limit,
  startDate,
  endDate
}: UseBankTransactionsProps = {}): UseBankTransactionsResult => {
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!bankAccountId) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedTransactions = await accountingLedgerService.getBankTransactions(
        bankAccountId,
        { limit, startDate, endDate }
      );
      setTransactions(fetchedTransactions);
    } catch (err) {
      console.error('Error in useBankTransactions:', err);
      setError('Failed to load bank transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [bankAccountId, limit, startDate, endDate]);

  const createTransaction = async (transaction: Omit<BankTransaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction = await accountingLedgerService.createBankTransaction(transaction);
    if (newTransaction) {
      await fetchTransactions(); // Reload transactions to get updated balances
    }
    return newTransaction;
  };

  return {
    transactions,
    loading,
    error,
    refreshTransactions: fetchTransactions,
    createTransaction
  };
};
