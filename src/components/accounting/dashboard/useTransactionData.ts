
import { useState, useMemo } from 'react';
import { Transaction } from './TransactionsTable';

export const useTransactionData = (transactions: Transaction[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionType, setTransactionType] = useState('all');

  // Filter transactions based on search query and type
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = 
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = 
        transactionType === 'all' || 
        (transactionType === 'debit' && transaction.type === 'debit') || 
        (transactionType === 'credit' && transaction.type === 'credit');
      
      return matchesSearch && matchesType;
    });
  }, [transactions, searchQuery, transactionType]);

  // Calculate summary amounts
  const totalDebits = useMemo(() => {
    return transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);
  
  const totalCredits = useMemo(() => {
    return transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  return {
    searchQuery,
    setSearchQuery,
    transactionType,
    setTransactionType,
    filteredTransactions,
    totalDebits,
    totalCredits
  };
};
