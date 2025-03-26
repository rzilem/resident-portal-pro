
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, RefreshCw, FileDown, Plus, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample transaction data
const sampleTransactions = [
  {
    id: 'TRX-001',
    date: '2023-04-15',
    description: 'Monthly HOA Fee Payment',
    amount: 250.00,
    type: 'payment',
    homeowner: 'John Smith',
    property: '125 Palm Ave, Unit 301',
    status: 'completed'
  },
  {
    id: 'TRX-002',
    date: '2023-04-10',
    description: 'Special Assessment Payment',
    amount: 500.00,
    type: 'payment',
    homeowner: 'Sarah Johnson',
    property: '125 Palm Ave, Unit 205',
    status: 'completed'
  },
  {
    id: 'TRX-003',
    date: '2023-04-05',
    description: 'Late Fee',
    amount: 25.00,
    type: 'fee',
    homeowner: 'Robert Williams',
    property: '125 Palm Ave, Unit 112',
    status: 'pending'
  },
  {
    id: 'TRX-004',
    date: '2023-04-01',
    description: 'Pool Maintenance Vendor Payment',
    amount: 350.00,
    type: 'expense',
    homeowner: 'N/A',
    property: 'Common Area',
    status: 'completed'
  },
  {
    id: 'TRX-005',
    date: '2023-03-28',
    description: 'Monthly HOA Fee Payment',
    amount: 250.00,
    type: 'payment',
    homeowner: 'Emily Davis',
    property: '125 Palm Ave, Unit 422',
    status: 'failed'
  }
];

const TransactionRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  
  // Filter transactions based on search term and filters
  const filteredTransactions = sampleTransactions.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.homeowner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = !typeFilter || transaction.type === typeFilter;
    const matchesStatus = !statusFilter || transaction.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'payment':
        return <Badge className="bg-blue-500">Payment</Badge>;
      case 'expense':
        return <Badge className="bg-orange-500">Expense</Badge>;
      case 'fee':
        return <Badge className="bg-purple-500">Fee</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };
  
  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between border-b">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center">
              <Select onValueChange={setTypeFilter} value={typeFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>{typeFilter || 'Type'}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="fee">Fee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center">
              <Select onValueChange={setStatusFilter} value={statusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>{statusFilter || 'Status'}</span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Button variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Homeowner</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                    <TableCell>{transaction.homeowner}</TableCell>
                    <TableCell>{transaction.property}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No transactions found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionRecords;
