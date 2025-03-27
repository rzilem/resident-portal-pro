
import React, { useEffect, useState } from 'react';
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

// Sample transaction data by association
const transactionsByAssociation: Record<string, Transaction[]> = {
  'default': [
    { 
      id: 'TRX-001', 
      date: '2023-07-15', 
      description: 'Monthly assessment payment', 
      amount: 350, 
      type: 'credit', 
      category: 'Assessment', 
      account: 'Operating Account',
      reference: 'INV-2023-07',
      associationId: 'default'
    },
    { 
      id: 'TRX-002', 
      date: '2023-07-10', 
      description: 'Landscaping service', 
      amount: 1200, 
      type: 'debit', 
      category: 'Maintenance',
      account: 'Operating Account',
      reference: 'PO-2023-15',
      associationId: 'default'
    },
    { 
      id: 'TRX-003', 
      date: '2023-07-05', 
      description: 'Special assessment collection', 
      amount: 500, 
      type: 'credit', 
      category: 'Special Assessment',
      account: 'Reserve Account',
      reference: 'SA-2023-02',
      associationId: 'default'
    },
    { 
      id: 'TRX-004', 
      date: '2023-07-01', 
      description: 'Pool repair', 
      amount: 850, 
      type: 'debit', 
      category: 'Repairs',
      account: 'Reserve Account',
      reference: 'WO-2023-42',
      associationId: 'default'
    },
    { 
      id: 'TRX-005', 
      date: '2023-06-28', 
      description: 'Insurance premium', 
      amount: 2450, 
      type: 'debit', 
      category: 'Insurance',
      account: 'Operating Account',
      reference: 'INS-2023-Q2',
      associationId: 'default'
    }
  ],
  'assoc1': [
    { 
      id: 'TRX-A001', 
      date: '2023-07-12', 
      description: 'Sunset Heights HOA Dues', 
      amount: 450, 
      type: 'credit', 
      category: 'Assessment', 
      account: 'Operating Account',
      reference: 'INV-SH-2023-07',
      associationId: 'assoc1'
    },
    { 
      id: 'TRX-A002', 
      date: '2023-07-08', 
      description: 'Tree trimming service', 
      amount: 875, 
      type: 'debit', 
      category: 'Maintenance',
      account: 'Operating Account',
      reference: 'PO-SH-2023-12',
      associationId: 'assoc1'
    },
    { 
      id: 'TRX-A003', 
      date: '2023-07-01', 
      description: 'Gate repair', 
      amount: 350, 
      type: 'debit', 
      category: 'Repairs',
      account: 'Reserve Account',
      reference: 'WO-SH-2023-08',
      associationId: 'assoc1'
    }
  ],
  'assoc2': [
    { 
      id: 'TRX-B001', 
      date: '2023-07-15', 
      description: 'Ocean View Condo Fees', 
      amount: 620, 
      type: 'credit', 
      category: 'Assessment', 
      account: 'Operating Account',
      reference: 'INV-OV-2023-07',
      associationId: 'assoc2'
    },
    { 
      id: 'TRX-B002', 
      date: '2023-07-10', 
      description: 'Elevator maintenance', 
      amount: 1800, 
      type: 'debit', 
      category: 'Maintenance',
      account: 'Operating Account',
      reference: 'PO-OV-2023-15',
      associationId: 'assoc2'
    },
    { 
      id: 'TRX-B003', 
      date: '2023-07-05', 
      description: 'Plumbing repairs', 
      amount: 720, 
      type: 'debit', 
      category: 'Repairs',
      account: 'Reserve Account',
      reference: 'WO-OV-2023-11',
      associationId: 'assoc2'
    }
  ],
  'assoc3': [
    { 
      id: 'TRX-C001', 
      date: '2023-07-14', 
      description: 'Mountain Valley Assessment', 
      amount: 380, 
      type: 'credit', 
      category: 'Assessment', 
      account: 'Operating Account',
      reference: 'INV-MV-2023-07',
      associationId: 'assoc3'
    },
    { 
      id: 'TRX-C002', 
      date: '2023-07-09', 
      description: 'Snow removal service', 
      amount: 1450, 
      type: 'debit', 
      category: 'Maintenance',
      account: 'Operating Account',
      reference: 'PO-MV-2023-14',
      associationId: 'assoc3'
    },
    { 
      id: 'TRX-C003', 
      date: '2023-07-03', 
      description: 'Roof inspection', 
      amount: 550, 
      type: 'debit', 
      category: 'Maintenance',
      account: 'Operating Account',
      reference: 'WO-MV-2023-09',
      associationId: 'assoc3'
    }
  ]
};

const TransactionsTab: React.FC<TransactionsTabProps> = ({ associationId }) => {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(transactionsByAssociation.default);
  
  // Update the transactions when the association changes
  useEffect(() => {
    console.log("Association changed to:", associationId);
    if (associationId && transactionsByAssociation[associationId]) {
      setAllTransactions(transactionsByAssociation[associationId]);
    } else {
      setAllTransactions(transactionsByAssociation.default);
    }
  }, [associationId]);

  const {
    searchQuery,
    setSearchQuery,
    transactionType,
    setTransactionType,
    filteredTransactions,
    totalDebits,
    totalCredits
  } = useTransactionData(allTransactions, associationId);

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
