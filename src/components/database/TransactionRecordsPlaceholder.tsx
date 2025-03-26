
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download, ChevronUp, ChevronDown, FileText, Calendar, CreditCard, Database } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Sample transaction data
const sampleTransactions = [
  { id: 'TRX-001', date: '2023-07-15', description: 'Monthly assessment payment', amount: '$350.00', type: 'Credit', account: 'Operating Account' },
  { id: 'TRX-002', date: '2023-07-10', description: 'Landscaping service', amount: '$1,200.00', type: 'Debit', account: 'Operating Account' },
  { id: 'TRX-003', date: '2023-07-05', description: 'Special assessment collection', amount: '$500.00', type: 'Credit', account: 'Reserve Account' },
  { id: 'TRX-004', date: '2023-07-01', description: 'Pool repair', amount: '$850.00', type: 'Debit', account: 'Reserve Account' },
  { id: 'TRX-005', date: '2023-06-28', description: 'Insurance premium', amount: '$2,450.00', type: 'Debit', account: 'Operating Account' },
  { id: 'TRX-006', date: '2023-06-15', description: 'Member dues payment', amount: '$350.00', type: 'Credit', account: 'Operating Account' },
  { id: 'TRX-007', date: '2023-06-10', description: 'Playground maintenance', amount: '$450.00', type: 'Debit', account: 'Reserve Account' },
  { id: 'TRX-008', date: '2023-06-05', description: 'Late fee collection', amount: '$25.00', type: 'Credit', account: 'Operating Account' },
];

const TransactionRecordsPlaceholder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [transactionType, setTransactionType] = useState<string>('all');
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const { toast } = useToast();

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending for dates
      setSortField(field);
      setSortDirection(field === 'date' ? 'desc' : 'asc');
    }
  };

  const handleExport = () => {
    toast({
      title: "Export started",
      description: "Your transaction data is being exported to CSV"
    });
  };

  // Unique accounts for filter
  const accounts = [...new Set(sampleTransactions.map(t => t.account))];

  // Filter transactions based on search term, transaction type, and account
  const filteredTransactions = sampleTransactions.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      Object.values(transaction).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesType = transactionType === 'all' || 
      transaction.type.toLowerCase() === transactionType.toLowerCase();
    
    const matchesAccount = selectedAccount === 'all' ||
      transaction.account === selectedAccount;
    
    return matchesSearch && matchesType && matchesAccount;
  });

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const valueA = a[sortField as keyof typeof a];
    const valueB = b[sortField as keyof typeof b];
    
    if (valueA === undefined || valueB === undefined) return 0;
    
    // Handle date sorting
    if (sortField === 'date') {
      const dateA = new Date(valueA as string);
      const dateB = new Date(valueB as string);
      return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    }
    
    // Handle amount sorting by converting to number
    if (sortField === 'amount') {
      const numA = parseFloat((valueA as string).replace(/[$,]/g, ''));
      const numB = parseFloat((valueB as string).replace(/[$,]/g, ''));
      return sortDirection === 'asc' ? numA - numB : numB - numA;
    }
    
    // Default string comparison
    const strA = String(valueA).toLowerCase();
    const strB = String(valueB).toLowerCase();
    
    return sortDirection === 'asc' 
      ? strA.localeCompare(strB)
      : strB.localeCompare(strA);
  });

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  // Calculate totals for summary cards
  const totalCredits = sampleTransactions
    .filter(t => t.type === 'Credit')
    .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[$,]/g, '')), 0);
    
  const totalDebits = sampleTransactions
    .filter(t => t.type === 'Debit')
    .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[$,]/g, '')), 0);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Credits</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(totalCredits)}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Debits</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(totalDebits)}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <CreditCard className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Net Balance</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(totalCredits - totalDebits)}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Database className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={transactionType} onValueChange={setTransactionType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Transaction Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
              <SelectItem value="debit">Debit</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedAccount} onValueChange={setSelectedAccount}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Accounts</SelectItem>
              {accounts.map(account => (
                <SelectItem key={account} value={account}>{account}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Date Range
          </Button>
          
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {sortedTransactions.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors w-[100px]"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-1">
                  ID
                  <SortIcon field="id" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors w-[100px]"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1">
                  Date
                  <SortIcon field="date" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => handleSort('description')}
              >
                <div className="flex items-center gap-1">
                  Description
                  <SortIcon field="description" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors text-right w-[120px]"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center gap-1 justify-end">
                  Amount
                  <SortIcon field="amount" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors w-[100px]"
                onClick={() => handleSort('type')}
              >
                <div className="flex items-center gap-1">
                  Type
                  <SortIcon field="type" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => handleSort('account')}
              >
                <div className="flex items-center gap-1">
                  Account
                  <SortIcon field="account" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((transaction, i) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-mono">{transaction.id}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className={`text-right ${transaction.type === 'Credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.amount}
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    transaction.type === 'Credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.type}
                  </span>
                </TableCell>
                <TableCell>{transaction.account}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center p-8 border rounded-md">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium mb-2">No transactions found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
        </div>
      )}
      
      {/* Pagination Placeholder */}
      {sortedTransactions.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {sortedTransactions.length} of {sampleTransactions.length} transactions
          </p>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionRecordsPlaceholder;
