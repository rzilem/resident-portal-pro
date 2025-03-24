
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SearchIcon, Plus, FileDown, Filter, RefreshCw, DollarSign, ArrowUpDown, Eye } from "lucide-react";
import { toast } from "sonner";

// Define transaction status types
type TransactionStatus = 'completed' | 'pending' | 'failed' | 'refunded';

// Define a transaction interface
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  associationName: string;
  unit: string;
  paymentMethod: string;
  status: TransactionStatus;
}

const TransactionManagement = () => {
  // Sample transaction data
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'txn_123456',
      date: '2023-05-15',
      description: 'Monthly HOA Dues',
      amount: 250.00,
      associationName: 'Sunset Heights HOA',
      unit: 'Unit 101',
      paymentMethod: 'Credit Card',
      status: 'completed'
    },
    {
      id: 'txn_123457',
      date: '2023-05-16',
      description: 'Special Assessment',
      amount: 500.00,
      associationName: 'Ocean View Condos',
      unit: 'Unit 201',
      paymentMethod: 'ACH Transfer',
      status: 'pending'
    },
    {
      id: 'txn_123458',
      date: '2023-05-17',
      description: 'Late Fee',
      amount: 25.00,
      associationName: 'Mountain Valley Association',
      unit: 'Unit 305',
      paymentMethod: 'Check',
      status: 'completed'
    },
    {
      id: 'txn_123459',
      date: '2023-05-18',
      description: 'Maintenance Fee',
      amount: 150.00,
      associationName: 'Sunset Heights HOA',
      unit: 'Unit 107',
      paymentMethod: 'Credit Card',
      status: 'failed'
    },
    {
      id: 'txn_123460',
      date: '2023-05-19',
      description: 'Pool Access Fee',
      amount: 75.00,
      associationName: 'Ocean View Condos',
      unit: 'Unit 210',
      paymentMethod: 'ACH Transfer',
      status: 'refunded'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [associationFilter, setAssociationFilter] = useState<string | undefined>(undefined);
  const [sortField, setSortField] = useState<keyof Transaction>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.associationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.unit.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = !statusFilter || transaction.status === statusFilter;
      
      // Association filter
      const matchesAssociation = !associationFilter || transaction.associationName === associationFilter;
      
      return matchesSearch && matchesStatus && matchesAssociation;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      // Handle comparing different types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      }
      
      return 0;
    });
  
  // Get unique associations for filter
  const associations = Array.from(new Set(transactions.map(t => t.associationName)));
  
  // Handle sorting
  const handleSort = (field: keyof Transaction) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Handle viewing transaction details
  const viewTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  };
  
  // Handle transaction status update
  const updateTransactionStatus = (id: string, status: TransactionStatus) => {
    const updatedTransactions = transactions.map(transaction => 
      transaction.id === id ? { ...transaction, status } : transaction
    );
    setTransactions(updatedTransactions);
    setDialogOpen(false);
    toast.success(`Transaction status updated to ${status}`);
  };
  
  // Handle exporting transactions
  const exportTransactions = () => {
    // In a real app, this would generate and download a CSV or PDF file
    toast.success("Transactions exported to CSV");
  };
  
  // Render status badge with appropriate color
  const renderStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Display amount in currency format
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              View and manage payment transactions across all associations
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="gap-2" onClick={exportTransactions}>
              <FileDown className="h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="w-full sm:w-48">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-48">
                <Select
                  value={associationFilter}
                  onValueChange={setAssociationFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by association" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Associations</SelectItem>
                    {associations.map(association => (
                      <SelectItem key={association} value={association}>{association}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" className="gap-2" onClick={() => {
                setSearchTerm('');
                setStatusFilter(undefined);
                setAssociationFilter(undefined);
              }}>
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
                    <Button variant="ghost" className="gap-1 p-0 h-auto font-medium" onClick={() => handleSort('date')}>
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="gap-1 p-0 h-auto font-medium" onClick={() => handleSort('description')}>
                      Description
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="gap-1 p-0 h-auto font-medium" onClick={() => handleSort('associationName')}>
                      Association
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Unit</TableHead>
                  <TableHead>
                    <Button variant="ghost" className="gap-1 p-0 h-auto font-medium" onClick={() => handleSort('amount')}>
                      Amount
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.associationName}</TableCell>
                      <TableCell className="hidden md:table-cell">{transaction.unit}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(transaction.amount)}</TableCell>
                      <TableCell className="hidden md:table-cell">{transaction.paymentMethod}</TableCell>
                      <TableCell>{renderStatusBadge(transaction.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewTransactionDetails(transaction)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t p-4">
          <div className="text-sm text-muted-foreground">
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={true}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={true}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Transaction Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedTransaction && (
            <>
              <DialogHeader>
                <DialogTitle>Transaction Details</DialogTitle>
                <DialogDescription>
                  View details and manage this transaction
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Transaction ID</Label>
                  <div className="col-span-3 font-mono text-sm bg-muted p-2 rounded">
                    {selectedTransaction.id}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Date</Label>
                  <div className="col-span-3">
                    {selectedTransaction.date}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Description</Label>
                  <div className="col-span-3">
                    {selectedTransaction.description}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Association</Label>
                  <div className="col-span-3">
                    {selectedTransaction.associationName}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Unit</Label>
                  <div className="col-span-3">
                    {selectedTransaction.unit}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Amount</Label>
                  <div className="col-span-3 font-medium">
                    {formatCurrency(selectedTransaction.amount)}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Payment Method</Label>
                  <div className="col-span-3">
                    {selectedTransaction.paymentMethod}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Status</Label>
                  <div className="col-span-3">
                    {renderStatusBadge(selectedTransaction.status)}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Update Status</Label>
                  <div className="col-span-3 flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant={selectedTransaction.status === 'completed' ? 'default' : 'outline'}
                      className="gap-1"
                      onClick={() => updateTransactionStatus(selectedTransaction.id, 'completed')}
                    >
                      Completed
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedTransaction.status === 'pending' ? 'default' : 'outline'}
                      className="gap-1"
                      onClick={() => updateTransactionStatus(selectedTransaction.id, 'pending')}
                    >
                      Pending
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedTransaction.status === 'failed' ? 'default' : 'outline'}
                      className="gap-1"
                      onClick={() => updateTransactionStatus(selectedTransaction.id, 'failed')}
                    >
                      Failed
                    </Button>
                    <Button 
                      size="sm" 
                      variant={selectedTransaction.status === 'refunded' ? 'default' : 'outline'}
                      className="gap-1"
                      onClick={() => updateTransactionStatus(selectedTransaction.id, 'refunded')}
                    >
                      Refunded
                    </Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionManagement;
