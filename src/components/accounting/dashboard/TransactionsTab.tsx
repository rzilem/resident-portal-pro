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
  ],
  '1': [
    { 
      id: 'TRX-101', 
      date: '2023-07-15', 
      description: 'Riverside HOA Dues', 
      amount: 400, 
      type: 'credit', 
      category: 'Assessment', 
      account: 'Operating Account',
      reference: 'INV-R-2023-07',
      associationId: '1'
    },
    { 
      id: 'TRX-102', 
      date: '2023-07-14', 
      description: 'Pool maintenance', 
      amount: 850, 
      type: 'debit', 
      category: 'Maintenance',
      account: 'Operating Account',
      reference: 'PO-R-2023-12',
      associationId: '1'
    },
    { 
      id: 'TRX-103', 
      date: '2023-07-10', 
      description: 'Security system', 
      amount: 675, 
      type: 'debit', 
      category: 'Security',
      account: 'Reserve Account',
      reference: 'WO-R-2023-08',
      associationId: '1'
    }
  ],
  '2': [
    { 
      id: 'TRX-201', 
      date: '2023-07-15', 
      description: 'Oakwood Condos Fees', 
      amount: 520, 
      type: 'credit', 
      category: 'Assessment', 
      account: 'Operating Account',
      reference: 'INV-O-2023-07',
      associationId: '2'
    },
    { 
      id: 'TRX-202', 
      date: '2023-07-12', 
      description: 'Landscaping', 
      amount: 1200, 
      type: 'debit', 
      category: 'Maintenance',
      account: 'Operating Account',
      reference: 'PO-O-2023-14',
      associationId: '2'
    },
    { 
      id: 'TRX-203', 
      date: '2023-07-08', 
      description: 'Hallway lighting', 
      amount: 450, 
      type: 'debit', 
      category: 'Repairs',
      account: 'Reserve Account',
      reference: 'WO-O-2023-09',
      associationId: '2'
    }
  ],
  '3': [
    { 
      id: 'TRX-301', 
      date: '2023-07-16', 
      description: 'Pinecrest Community Dues', 
      amount: 350, 
      type: 'credit', 
      category: 'Assessment', 
      account: 'Operating Account',
      reference: 'INV-P-2023-07',
      associationId: '3'
    },
    { 
      id: 'TRX-302', 
      date: '2023-07-11', 
      description: 'Common area maintenance', 
      amount: 780, 
      type: 'debit', 
      category: 'Maintenance',
      account: 'Operating Account',
      reference: 'PO-P-2023-15',
      associationId: '3'
    },
    { 
      id: 'TRX-303', 
      date: '2023-07-05', 
      description: 'Tennis court resurfacing', 
      amount: 1800, 
      type: 'debit', 
      category: 'Improvements',
      account: 'Reserve Account',
      reference: 'WO-P-2023-10',
      associationId: '3'
    }
  ],
  'oakwood': [
    { 
      id: 'TRX-OW1', 
      date: '2023-07-15', 
      description: 'Oakwood HOA Dues', 
      amount: 380, 
      type: 'credit', 
      category: 'Assessment', 
      account: 'Operating Account',
      reference: 'INV-OW-2023-07',
      associationId: 'oakwood'
    },
    { 
      id: 'TRX-OW2', 
      date: '2023-07-10', 
      description: 'Fence repair', 
      amount: 650, 
      type: 'debit', 
      category: 'Repairs',
      account: 'Operating Account',
      reference: 'PO-OW-2023-15',
      associationId: 'oakwood'
    },
    { 
      id: 'TRX-OW3', 
      date: '2023-07-05', 
      description: 'Lawn maintenance', 
      amount: 420, 
      type: 'debit', 
      category: 'Maintenance',
      account: 'Reserve Account',
      reference: 'WO-OW-2023-08',
      associationId: 'oakwood'
    }
  ],
  'pinecrest': [
    { 
      id: 'TRX-PC1', 
      date: '2023-07-15', 
      description: 'Pinecrest Condo Fees', 
      amount: 550, 
      type: 'credit', 
      category: 'Assessment', 
      account: 'Operating Account',
      reference: 'INV-PC-2023-07',
      associationId: 'pinecrest'
    },
    { 
      id: 'TRX-PC2', 
      date: '2023-07-12', 
      description: 'Elevator maintenance', 
      amount: 1500, 
      type: 'debit', 
      category: 'Maintenance',
      account: 'Operating Account',
      reference: 'PO-PC-2023-12',
      associationId: 'pinecrest'
    },
    { 
      id: 'TRX-PC3', 
      date: '2023-07-08', 
      description: 'Lobby renovation', 
      amount: 2800, 
      type: 'debit', 
      category: 'Improvements',
      account: 'Reserve Account',
      reference: 'WO-PC-2023-10',
      associationId: 'pinecrest'
    }
  ],
  'riverdale': [
    { 
      id: 'TRX-RD1', 
      date: '2023-07-16', 
      description: 'Riverdale Community Fees', 
      amount: 420, 
      type: 'credit', 
      category: 'Assessment', 
      account: 'Operating Account',
      reference: 'INV-RD-2023-07',
      associationId: 'riverdale'
    },
    { 
      id: 'TRX-RD2', 
      date: '2023-07-11', 
      description: 'Clubhouse cleaning', 
      amount: 350, 
      type: 'debit', 
      category: 'Maintenance',
      account: 'Operating Account',
      reference: 'PO-RD-2023-14',
      associationId: 'riverdale'
    },
    { 
      id: 'TRX-RD3', 
      date: '2023-07-06', 
      description: 'Playground equipment', 
      amount: 1200, 
      type: 'debit', 
      category: 'Improvements',
      account: 'Reserve Account',
      reference: 'WO-RD-2023-09',
      associationId: 'riverdale'
    }
  ]
};

const TransactionsTab: React.FC<TransactionsTabProps> = ({ associationId }) => {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(transactionsByAssociation.default);
  
  // Update the transactions when the association changes
  useEffect(() => {
    console.log("TransactionsTab: Association changed to:", associationId);
    if (associationId && associationId !== 'all' && transactionsByAssociation[associationId]) {
      setAllTransactions(transactionsByAssociation[associationId]);
    } else {
      // If association is 'all' or not found, show all transactions from all associations
      if (associationId === 'all') {
        const allAssociationTransactions = Object.values(transactionsByAssociation).flat();
        setAllTransactions(allAssociationTransactions);
      } else {
        setAllTransactions(transactionsByAssociation.default);
      }
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
          {associationId && associationId !== 'all' && <span className="ml-1">for the selected association</span>}
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
