
import { useState, useMemo, useEffect } from 'react';
import { Transaction } from './TransactionsTable';

export const useTransactionData = (transactions: Transaction[], associationId?: string) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionType, setTransactionType] = useState('all');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);

  // Filter transactions based on search query, type, and association ID
  useEffect(() => {
    console.log("Filtering transactions for association ID:", associationId);
    
    const filtered = transactions.filter(transaction => {
      const matchesSearch = 
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = 
        transactionType === 'all' || 
        (transactionType === 'debit' && transaction.type === 'debit') || 
        (transactionType === 'credit' && transaction.type === 'credit');
      
      // Filter by association if associationId is provided and not 'all'
      const matchesAssociation = 
        !associationId || 
        associationId === 'all' || 
        transaction.associationId === associationId;
      
      return matchesSearch && matchesType && matchesAssociation;
    });

    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, transactionType, associationId]);

  // Calculate summary amounts for the filtered transactions
  const totalDebits = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);
  
  const totalCredits = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredTransactions]);

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
