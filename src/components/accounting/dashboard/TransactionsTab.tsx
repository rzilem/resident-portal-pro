
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import TransactionSummaryCards from './TransactionSummaryCards';
import TransactionFilters from './TransactionFilters';
import TransactionsTable, { Transaction } from './TransactionsTable';
import { useTransactionData } from './useTransactionData';

interface TransactionsTabProps {
  associationId?: string;
}

const TransactionsTab: React.FC<TransactionsTabProps> = ({ associationId }) => {
  // Sample transaction data - in a real app, this would come from an API
  const transactions: Transaction[] = [
    { 
      id: 'TRX-001', 
      date: '2023-07-15', 
      description: 'Monthly assessment payment', 
      amount: 350, 
      type: 'credit', 
      category: 'Assessment', 
      account: 'Operating Account',
      reference: 'INV-2023-07'
    },
    { 
      id: 'TRX-002', 
      date: '2023-07-10', 
      description: 'Landscaping service', 
      amount: 1200, 
      type: 'debit', 
      category: 'Maintenance',
      account: 'Operating Account',
      reference: 'PO-2023-15'
    },
    { 
      id: 'TRX-003', 
      date: '2023-07-05', 
      description: 'Special assessment collection', 
      amount: 500, 
      type: 'credit', 
      category: 'Special Assessment',
      account: 'Reserve Account',
      reference: 'SA-2023-02'
    },
    { 
      id: 'TRX-004', 
      date: '2023-07-01', 
      description: 'Pool repair', 
      amount: 850, 
      type: 'debit', 
      category: 'Repairs',
      account: 'Reserve Account',
      reference: 'WO-2023-42'
    },
    { 
      id: 'TRX-005', 
      date: '2023-06-28', 
      description: 'Insurance premium', 
      amount: 2450, 
      type: 'debit', 
      category: 'Insurance',
      account: 'Operating Account',
      reference: 'INS-2023-Q2'
    }
  ];

  const {
    searchQuery,
    setSearchQuery,
    transactionType,
    setTransactionType,
    filteredTransactions,
    totalDebits,
    totalCredits
  } = useTransactionData(transactions);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Management</CardTitle>
        <CardDescription>
          View and manage all financial transactions
          {associationId && <span className="ml-1">for the selected association</span>}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <TransactionSummaryCards 
          totalCredits={totalCredits} 
          totalDebits={totalDebits} 
        />

        {/* Filters */}
        <TransactionFilters
          searchQuery={searchQuery}
          transactionType={transactionType}
          setSearchQuery={setSearchQuery}
          setTransactionType={setTransactionType}
        />

        {/* Transactions Table */}
        <TransactionsTable transactions={filteredTransactions} />

        {/* Action Button */}
        <div className="mt-6 flex justify-end">
          <Button className="mt-2" asChild>
            <Link to={`/accounting/transactions${associationId ? `?associationId=${associationId}` : ''}`}>
              View All Transactions
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsTab;
