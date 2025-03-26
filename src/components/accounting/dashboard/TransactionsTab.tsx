
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  CreditCard, 
  FileBarChart, 
  Search,
  Filter,
  Calendar
} from "lucide-react";
import { formatCurrency } from "@/components/reports/financial/utils/formatters";

interface TransactionsTabProps {
  associationId?: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
  account: string;
  reference: string;
}

const TransactionsTab: React.FC<TransactionsTabProps> = ({ associationId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionType, setTransactionType] = useState('all');
  
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

  // Filter transactions based on search query and type
  const filteredTransactions = transactions.filter(transaction => {
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

  // Calculate summary amounts
  const totalDebits = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalCredits = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  // Format date string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Inflow</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCredits)}</p>
                </div>
                <ArrowDownCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Outflow</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebits)}</p>
                </div>
                <ArrowUpCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Net Flow</p>
                  <p className={`text-2xl font-bold ${totalCredits - totalDebits >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(totalCredits - totalDebits)}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search transactions..." 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={transactionType} onValueChange={setTransactionType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Transaction Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="credit">Income (Credits)</SelectItem>
              <SelectItem value="debit">Expense (Debits)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transactions Table */}
        {filteredTransactions.length > 0 ? (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>{transaction.reference}</TableCell>
                    <TableCell className="text-right">
                      <span className={`flex items-center justify-end ${
                        transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' ? 
                          <ArrowDownCircle className="mr-1 h-4 w-4" /> : 
                          <ArrowUpCircle className="mr-1 h-4 w-4" />
                        }
                        {formatCurrency(transaction.amount)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center p-8">
            <FileBarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No transactions found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}

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
