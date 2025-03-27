
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, Filter, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Payments = () => {
  // Placeholder payment data
  const payments = [
    { id: '1', date: '2023-10-15', description: 'Monthly HOA Fee', amount: 250.00, method: 'Credit Card', status: 'Completed' },
    { id: '2', date: '2023-09-15', description: 'Monthly HOA Fee', amount: 250.00, method: 'Bank Transfer', status: 'Completed' },
    { id: '3', date: '2023-08-15', description: 'Monthly HOA Fee', amount: 250.00, method: 'Check', status: 'Completed' },
    { id: '4', date: '2023-10-12', description: 'Special Assessment', amount: 500.00, method: 'Credit Card', status: 'Pending' },
    { id: '5', date: '2023-10-10', description: 'Late Fee Payment', amount: 25.00, method: 'Bank Transfer', status: 'Completed' },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all payments for your association
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
            Make Payment
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Payment Summary
          </CardTitle>
          <CardDescription>
            Overview of payment activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border rounded-md p-3">
              <div className="text-muted-foreground text-sm">Total Payments</div>
              <div className="text-2xl font-bold">$1,275.00</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-muted-foreground text-sm">Upcoming Due</div>
              <div className="text-2xl font-bold text-amber-600">$750.00</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-muted-foreground text-sm">Overdue</div>
              <div className="text-2xl font-bold text-red-600">$0.00</div>
            </div>
            <div className="border rounded-md p-3">
              <div className="text-muted-foreground text-sm">Next Payment</div>
              <div className="text-lg font-bold">Nov 15, 2023</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold">Payment History</h2>
        <div className="flex w-full md:w-auto gap-2 items-center">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search payments..." 
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${payment.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                      payment.status === 'Completed' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-800/20 dark:text-green-400' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-800/20 dark:text-amber-400'
                    }`}>
                      {payment.status}
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

export default Payments;
