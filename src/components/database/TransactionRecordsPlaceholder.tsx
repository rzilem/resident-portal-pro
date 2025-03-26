
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  // Filter transactions based on search term and transaction type
  const filteredTransactions = sampleTransactions.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      Object.values(transaction).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesType = transactionType === 'all' || 
      transaction.type.toLowerCase() === transactionType.toLowerCase();
    
    return matchesSearch && matchesType;
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

  return (
    <div className="pt-4">
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
        <div className="flex gap-2">
          <Select value={transactionType} onValueChange={setTransactionType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Transaction Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
              <SelectItem value="debit">Debit</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
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
    </div>
  );
};

export default TransactionRecordsPlaceholder;
