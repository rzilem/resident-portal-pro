
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BankAccount, BankTransaction } from '@/types/accounting';
import { formatCurrency } from '@/utils/formatters';
import { useBankTransactions } from '@/hooks/useBankTransactions';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, ArrowDown, ArrowUp, Calendar, CreditCard, DollarSign, Download, Pencil, Plus, Upload } from 'lucide-react';
import TransactionDialog from './TransactionDialog';
import { toast } from 'sonner';

interface BankAccountDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: BankAccount;
  onClose: () => void;
}

const BankAccountDetails: React.FC<BankAccountDetailsProps> = ({
  open,
  onOpenChange,
  account,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'deposit' | 'withdrawal'>('deposit');
  
  const { transactions, loading: transactionsLoading, createTransaction } = useBankTransactions({
    bankAccountId: account.id,
    limit: 50
  });
  
  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'bg-green-100 text-green-800';
      case 'withdrawal':
        return 'bg-red-100 text-red-800';
      case 'transfer':
        return 'bg-blue-100 text-blue-800';
      case 'payment':
        return 'bg-orange-100 text-orange-800';
      case 'fee':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getTransactionStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'cleared':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Cleared</Badge>;
      case 'reconciled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Reconciled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const handleAddDeposit = () => {
    setTransactionType('deposit');
    setIsTransactionDialogOpen(true);
  };
  
  const handleAddWithdrawal = () => {
    setTransactionType('withdrawal');
    setIsTransactionDialogOpen(true);
  };
  
  const handleExportTransactions = () => {
    toast.info('Exporting transactions is not implemented yet');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{account.name}</span>
            <Badge className={`ml-2 ${account.accountType === 'operating' ? 'bg-blue-100 text-blue-800' : account.accountType === 'reserve' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`} variant="outline">
              {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
            </Badge>
          </DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <span>Account details and transaction history</span>
            <span className="font-semibold">{formatCurrency(account.balance)}</span>
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="statements">Statements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Account Details</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-y-2">
                    <div className="text-sm text-muted-foreground">Account Name:</div>
                    <div className="text-sm font-medium">{account.name}</div>
                    
                    <div className="text-sm text-muted-foreground">Account Type:</div>
                    <div className="text-sm font-medium capitalize">{account.accountType}</div>
                    
                    <div className="text-sm text-muted-foreground">Account Number:</div>
                    <div className="text-sm font-medium">
                      {account.accountNumber ? 
                        `****${account.accountNumber.slice(-4)}` : 
                        'Not provided'}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">Routing Number:</div>
                    <div className="text-sm font-medium">
                      {account.routingNumber || 'Not provided'}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">Status:</div>
                    <div className="text-sm font-medium">
                      {account.isActive ? 
                        <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge> : 
                        <Badge variant="outline" className="bg-red-50 text-red-700">Inactive</Badge>
                      }
                    </div>
                  </div>
                </div>
                
                {account.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                    <Separator className="my-2" />
                    <p className="text-sm">{account.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="border rounded-md p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Account Summary</h3>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current Balance:</span>
                      <span className="text-lg font-bold">{formatCurrency(account.balance)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Last Updated:</span>
                      <span className="text-sm">
                        {new Date(account.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Deposits (30 days):</span>
                      <span className="text-sm text-green-600 font-medium">
                        {formatCurrency(
                          transactions
                            .filter(t => 
                              ['deposit', 'transfer'].includes(t.transactionType) &&
                              new Date(t.transactionDate) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                            )
                            .reduce((sum, t) => sum + t.amount, 0)
                        )}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Withdrawals (30 days):</span>
                      <span className="text-sm text-red-600 font-medium">
                        {formatCurrency(
                          transactions
                            .filter(t => 
                              ['withdrawal', 'payment', 'fee'].includes(t.transactionType) &&
                              new Date(t.transactionDate) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                            )
                            .reduce((sum, t) => sum + t.amount, 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
                  <Separator className="my-2" />
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={handleAddDeposit}
                      >
                        <ArrowDown className="h-4 w-4 mr-2 text-green-500" />
                        Add Deposit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={handleAddWithdrawal}
                      >
                        <ArrowUp className="h-4 w-4 mr-2 text-red-500" />
                        Add Withdrawal
                      </Button>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => setActiveTab('transactions')}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      View All Transactions
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold">Transaction History</h3>
                <p className="text-sm text-muted-foreground">
                  View and manage transactions for this account
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddDeposit}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  <ArrowDown className="h-4 w-4 text-green-500" />
                  Deposit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddWithdrawal}
                  className="gap-1"
                >
                  <Plus className="h-4 w-4" />
                  <ArrowUp className="h-4 w-4 text-red-500" />
                  Withdrawal
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportTransactions}
                  className="gap-1"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="transaction-search" className="sr-only">
                  Search Transactions
                </Label>
                <Input
                  id="transaction-search"
                  placeholder="Search transactions..."
                  className="w-full sm:w-auto"
                />
              </div>
              
              <div className="flex items-center gap-2 sm:ml-auto">
                <Label htmlFor="transaction-filter" className="sr-only">
                  Filter by
                </Label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="deposit">Deposits</SelectItem>
                    <SelectItem value="withdrawal">Withdrawals</SelectItem>
                    <SelectItem value="transfer">Transfers</SelectItem>
                    <SelectItem value="payment">Payments</SelectItem>
                    <SelectItem value="fee">Fees</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                    <SelectItem value="90">Last 90 Days</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {transactionsLoading ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-muted-foreground">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="border rounded-md p-8 flex flex-col items-center justify-center gap-2">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                <h3 className="text-lg font-medium">No Transactions Found</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  This account doesn't have any transactions yet. 
                  Use the buttons above to add deposits or withdrawals.
                </p>
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Check #</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {format(new Date(transaction.transactionDate), 'MM/dd/yyyy')}
                        </TableCell>
                        <TableCell>
                          {transaction.description || 'No description'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getTransactionTypeColor(transaction.transactionType)} variant="outline">
                            {transaction.transactionType.charAt(0).toUpperCase() + transaction.transactionType.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${(['deposit', 'transfer'].includes(transaction.transactionType)) ? 'text-green-600' : 'text-red-600'}`}>
                          {(['deposit', 'transfer'].includes(transaction.transactionType)) ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {getTransactionStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {transaction.checkNumber || '–'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {}}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="statements" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold">Bank Statements</h3>
                <p className="text-sm text-muted-foreground">
                  View and upload bank statements for this account
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <Upload className="h-4 w-4" />
                  Upload Statement
                </Button>
                <Button
                  size="sm"
                  className="gap-1"
                >
                  <Calendar className="h-4 w-4" />
                  Reconcile Account
                </Button>
              </div>
            </div>
            
            <div className="border rounded-md p-8 flex flex-col items-center justify-center gap-2">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <h3 className="text-lg font-medium">No Statements Found</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                There are no bank statements uploaded for this account yet.
                Use the Upload Statement button to add statements.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
      
      <TransactionDialog
        open={isTransactionDialogOpen}
        onOpenChange={setIsTransactionDialogOpen}
        account={account}
        transactionType={transactionType}
        onSuccess={() => {
          setIsTransactionDialogOpen(false);
        }}
      />
    </Dialog>
  );
};

export default BankAccountDetails;
