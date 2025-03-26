
import React, { useState } from 'react';
import { Download, ArrowUp, ArrowDown, DollarSign, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Transaction } from '@/types/resident';
import { formatCurrency } from '@/components/reports/financial/utils/formatters';

interface FinancialTabProps {
  transactions?: Transaction[];
}

const FinancialTab: React.FC<FinancialTabProps> = ({ transactions = [] }) => {
  const [view, setView] = useState<'all' | 'payments' | 'charges'>('all');
  
  // Filter transactions based on selected view
  const filteredTransactions = transactions.filter(transaction => {
    if (view === 'all') return true;
    if (view === 'payments') return transaction.amount.startsWith('-') || transaction.description.toLowerCase().includes('payment');
    if (view === 'charges') return !transaction.amount.startsWith('-') && !transaction.description.toLowerCase().includes('payment');
    return true;
  });

  // Calculate the total balance
  const calculateTotalBalance = () => {
    if (!transactions || transactions.length === 0) return "$0.00";
    return transactions[0].balance; // Most recent balance
  };

  // Calculate total payments and charges
  const calculateTotal = (type: 'payments' | 'charges') => {
    if (!transactions || transactions.length === 0) return "$0.00";
    
    const total = transactions.reduce((sum, transaction) => {
      const amount = parseFloat(transaction.amount.replace('$', '').replace(',', ''));
      if (type === 'payments' && (transaction.amount.startsWith('-') || 
         transaction.description.toLowerCase().includes('payment'))) {
        return sum + Math.abs(amount);
      } else if (type === 'charges' && !transaction.amount.startsWith('-') && 
                !transaction.description.toLowerCase().includes('payment')) {
        return sum + amount;
      }
      return sum;
    }, 0);
    
    return formatCurrency(total);
  };

  // Determine transaction type for styling
  const getTransactionType = (transaction: Transaction) => {
    if (transaction.amount.startsWith('-') || 
       transaction.description.toLowerCase().includes('payment')) {
      return 'payment';
    }
    return 'charge';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Complete financial history for this resident
          </CardDescription>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </CardHeader>

      <CardContent>
        {/* Financial Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <h3 className="text-2xl font-bold">{calculateTotalBalance()}</h3>
                </div>
                <div className="p-2 bg-blue-100 rounded-full">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Payments</p>
                  <h3 className="text-2xl font-bold text-green-600">{calculateTotal('payments')}</h3>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <ArrowDown className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Charges</p>
                  <h3 className="text-2xl font-bold text-red-600">{calculateTotal('charges')}</h3>
                </div>
                <div className="p-2 bg-red-100 rounded-full">
                  <ArrowUp className="h-5 w-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction Filters */}
        <Tabs value={view} onValueChange={(v) => setView(v as 'all' | 'payments' | 'charges')} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="charges">Charges</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Transaction Table */}
        {filteredTransactions && filteredTransactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction, i) => {
                const type = getTransactionType(transaction);
                return (
                  <TableRow key={i}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className={`mr-2 p-1 rounded-full ${
                          type === 'payment' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {type === 'payment' ? 
                            <ArrowDown className={`h-3 w-3 text-green-600`} /> : 
                            <ArrowUp className={`h-3 w-3 text-red-600`} />
                          }
                        </span>
                        {transaction.description}
                      </div>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${
                      type === 'payment' ? 'text-green-600' : ''
                    }`}>
                      {transaction.amount}
                    </TableCell>
                    <TableCell className="text-right">{transaction.balance}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-lg font-medium">No transaction history available</p>
            <p className="text-sm text-muted-foreground">All financial transactions will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialTab;
