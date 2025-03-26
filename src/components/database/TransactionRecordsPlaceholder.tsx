
import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Calendar, Download, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

// Sample transaction data
const sampleTransactions = [
  { 
    id: 'txn-001', 
    date: '2023-06-01', 
    description: 'Monthly Assessment Payment', 
    amount: '$1,450.00', 
    type: 'payment',
    balance: '$0.00',
    resident: 'Robert Smith',
    property: 'Willow Creek Estates'
  },
  { 
    id: 'txn-002', 
    date: '2023-05-28', 
    description: 'Late Fee', 
    amount: '$50.00', 
    type: 'charge',
    balance: '$50.00',
    resident: 'Emily Davis',
    property: 'Riverfront Towers'
  },
  { 
    id: 'txn-003', 
    date: '2023-05-15', 
    description: 'Special Assessment', 
    amount: '$250.00', 
    type: 'charge',
    balance: '$250.00',
    resident: 'Alice Johnson',
    property: 'Oakwood Heights'
  },
  { 
    id: 'txn-004', 
    date: '2023-05-01', 
    description: 'Monthly Assessment Payment', 
    amount: '$1,575.00', 
    type: 'payment',
    balance: '$0.00',
    resident: 'Emily Davis',
    property: 'Riverfront Towers'
  },
  { 
    id: 'txn-005', 
    date: '2023-04-30', 
    description: 'Maintenance Fee', 
    amount: '$125.00', 
    type: 'charge',
    balance: '$125.00',
    resident: 'Robert Smith',
    property: 'Willow Creek Estates'
  }
];

const TransactionRecords = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionType, setTransactionType] = useState('all');
  
  // Filter transactions based on search query and transaction type
  const filteredTransactions = sampleTransactions.filter(transaction => {
    // Apply search filter
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.resident.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.property.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply transaction type filter
    const matchesType = 
      transactionType === 'all' || 
      (transactionType === 'payments' && transaction.type === 'payment') ||
      (transactionType === 'charges' && transaction.type === 'charge');
    
    return matchesSearch && matchesType;
  });
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Financial Transaction Records</CardTitle>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => navigate('/accounting/reports')}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      
      <CardContent>
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
              <SelectItem value="payments">Payments</SelectItem>
              <SelectItem value="charges">Charges</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Transactions Table */}
        {filteredTransactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Resident</TableHead>
                <TableHead>Property</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className={`mr-2 p-1 rounded-full ${
                        transaction.type === 'payment' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {transaction.type === 'payment' ? 
                          <ArrowDown className="h-3 w-3 text-green-600" /> : 
                          <ArrowUp className="h-3 w-3 text-red-600" />
                        }
                      </span>
                      {transaction.description}
                    </div>
                  </TableCell>
                  <TableCell>{transaction.resident}</TableCell>
                  <TableCell>{transaction.property}</TableCell>
                  <TableCell className={`text-right font-medium ${
                    transaction.type === 'payment' ? 'text-green-600' : ''
                  }`}>
                    {transaction.amount}
                  </TableCell>
                  <TableCell className="text-right">{transaction.balance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-lg font-medium">No transactions found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionRecords;
