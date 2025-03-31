
import { useState, useEffect } from 'react';
import { BankAccount } from '@/types/accounting';
import { accountingLedgerService } from '@/services/accountingLedgerService';

interface UseBankAccountsProps {
  associationId?: string;
}

interface UseBankAccountsResult {
  accounts: BankAccount[];
  loading: boolean;
  error: string | null;
  refreshAccounts: () => Promise<void>;
  createAccount: (account: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>) => Promise<BankAccount | null>;
  updateAccount: (id: string, updates: Partial<BankAccount>) => Promise<boolean>;
}

export const useBankAccounts = ({ associationId }: UseBankAccountsProps = {}): UseBankAccountsResult => {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    if (!associationId) {
      setAccounts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const fetchedAccounts = await accountingLedgerService.getBankAccounts(associationId);
      setAccounts(fetchedAccounts);
    } catch (err) {
      console.error('Error in useBankAccounts:', err);
      setError('Failed to load bank accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [associationId]);

  const createAccount = async (account: Omit<BankAccount, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAccount = await accountingLedgerService.createBankAccount(account);
    if (newAccount) {
      setAccounts(prevAccounts => [...prevAccounts, newAccount]);
    }
    return newAccount;
  };

  const updateAccount = async (id: string, updates: Partial<BankAccount>) => {
    const success = await accountingLedgerService.updateBankAccount(id, updates);
    if (success) {
      setAccounts(prevAccounts => 
        prevAccounts.map(account => 
          account.id === id 
            ? { ...account, ...updates } 
            : account
        )
      );
    }
    return success;
  };

  return {
    accounts,
    loading,
    error,
    refreshAccounts: fetchAccounts,
    createAccount,
    updateAccount
  };
};
