
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { formatDate } from './utils/formatters';
import { formatCurrency } from '../financial/utils/formatters';

interface TransactionHistoryReportProps {
  timeRange: string;
  association: string;
  selectedReport: string;
}

const TransactionHistoryReport = ({ timeRange, association, selectedReport }: TransactionHistoryReportProps) => {
  // Sample transaction history data
  const transactionHistoryData = [
    { id: 'TRX-001', resident: 'John Smith', date: '2023-07-10', type: 'HOA Fee', amount: 250, status: 'Paid' },
    { id: 'TRX-002', resident: 'Jane Doe', date: '2023-07-05', type: 'Late Fee', amount: 25, status: 'Paid' },
    { id: 'TRX-003', resident: 'Robert Johnson', date: '2023-07-01', type: 'HOA Fee', amount: 250, status: 'Paid' },
    { id: 'TRX-004', resident: 'Mary Williams', date: '2023-06-30', type: 'Special Assessment', amount: 500, status: 'Unpaid' },
    { id: 'TRX-005', resident: 'David Brown', date: '2023-06-25', type: 'HOA Fee', amount: 250, status: 'Paid' },
    { id: 'TRX-006', resident: 'Sarah Miller', date: '2023-06-20', type: 'Fine', amount: 100, status: 'Unpaid' },
    { id: 'TRX-007', resident: 'Michael Davis', date: '2023-06-15', type: 'HOA Fee', amount: 250, status: 'Paid' },
    { id: 'TRX-008', resident: 'Jennifer Garcia', date: '2023-06-10', type: 'Amenity Fee', amount: 75, status: 'Paid' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          {selectedReport === 'transaction-history' ? 'Homeowner Transaction History' : 'Transaction History By Charge'}
          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </h3>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Transactions
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Resident</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactionHistoryData.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">{transaction.id}</TableCell>
              <TableCell>{transaction.resident}</TableCell>
              <TableCell>{formatDate(transaction.date)}</TableCell>
              <TableCell>{transaction.type}</TableCell>
              <TableCell>{formatCurrency(transaction.amount)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  transaction.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {transaction.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-base font-medium mb-4">Transaction Distribution by Type</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'HOA Fee', amount: 1000 },
                  { name: 'Late Fee', amount: 25 },
                  { name: 'Special Assessment', amount: 500 },
                  { name: 'Fine', amount: 100 },
                  { name: 'Amenity Fee', amount: 75 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="amount" name="Amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-base font-medium">Transaction Summary</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <h4 className="text-sm font-medium">Total Collected</h4>
                <p className="text-2xl font-bold mt-1">{formatCurrency(
                  transactionHistoryData
                    .filter(t => t.status === 'Paid')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}</p>
                <p className="text-xs text-green-600 mt-1">75% collection rate</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="text-sm font-medium">Outstanding</h4>
                <p className="text-2xl font-bold mt-1">{formatCurrency(
                  transactionHistoryData
                    .filter(t => t.status === 'Unpaid')
                    .reduce((sum, t) => sum + t.amount, 0)
                )}</p>
                <p className="text-xs text-amber-600 mt-1">25% of total billed</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="p-4 bg-muted/50 rounded-md">
            <h4 className="text-sm font-medium mb-2">Key Transaction Insights</h4>
            <ul className="space-y-1 text-sm">
              <li>• HOA fee collection rate is 5% higher than same period last year</li>
              <li>• Special assessments account for 29% of total transactions</li>
              <li>• Late fees have decreased by 15% compared to previous quarter</li>
              <li>• Online payment adoption has increased to 78% of all transactions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistoryReport;
