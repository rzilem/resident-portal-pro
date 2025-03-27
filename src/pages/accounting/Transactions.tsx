
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, Download, Filter, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Transactions = () => {
  // Placeholder transaction data
  const transactions = [
    { id: '1', date: '2023-10-15', description: 'Monthly HOA Fee', amount: 250.00, type: 'Payment', status: 'Completed' },
    { id: '2', date: '2023-10-12', description: 'Special Assessment', amount: 500.00, type: 'Invoice', status: 'Pending' },
    { id: '3', date: '2023-09-30', description: 'Pool Repair', amount: 1200.00, type: 'Expense', status: 'Completed' },
    { id: '4', date: '2023-09-15', description: 'Monthly HOA Fee', amount: 250.00, type: 'Payment', status: 'Completed' },
    { id: '5', date: '2023-08-15', description: 'Monthly HOA Fee', amount: 250.00, type: 'Payment', status: 'Completed' },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all financial transactions for your association
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Transaction
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Transaction Summary
          </CardTitle>
          <CardDescription>
            Overview of your association's financial transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-md p-3">
              <div className="text-muted-foreground text-sm">Total Received</div>
              <div className="text-2xl font-bold text-green-600">$3,250.00</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-muted-foreground text-sm">Total Spent</div>
              <div className="text-2xl font-bold text-red-600">$1,850.00</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-muted-foreground text-sm">Balance</div>
              <div className="text-2xl font-bold">$1,400.00</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Transaction History</h2>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search transactions..." 
            className="pl-8"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                      transaction.status === 'Completed' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-800/20 dark:text-green-400' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-800/20 dark:text-amber-400'
                    }`}>
                      {transaction.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
