
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface BankBalancesReportProps {
  timeRange: string;
  association: string;
}

const BankBalancesReport = ({ timeRange, association }: BankBalancesReportProps) => {
  // Sample data
  const bankAccountsData = [
    { account: 'Operating Account', number: 'XXXX-4532', balance: 125000, lastUpdated: '2023-07-25' },
    { account: 'Reserve Fund', number: 'XXXX-7890', balance: 345000, lastUpdated: '2023-07-25' },
    { account: 'Special Assessment', number: 'XXXX-1234', balance: 78000, lastUpdated: '2023-07-25' },
    { account: 'Maintenance Fund', number: 'XXXX-5678', balance: 42000, lastUpdated: '2023-07-25' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          Bank Account Balances
          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </h3>
        <p className="text-sm text-muted-foreground">Last Updated: July 25, 2023</p>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account Name</TableHead>
            <TableHead>Account Number</TableHead>
            <TableHead>Current Balance</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bankAccountsData.map((account, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{account.account}</TableCell>
              <TableCell>{account.number}</TableCell>
              <TableCell>{formatCurrency(account.balance)}</TableCell>
              <TableCell>{account.lastUpdated}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-6">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={bankAccountsData.map(a => ({ name: a.account, value: a.balance }))}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {bankAccountsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 p-4 bg-muted/50 rounded-md">
        <h4 className="text-base font-medium mb-2">Total Assets</h4>
        <p className="text-2xl font-bold">{formatCurrency(bankAccountsData.reduce((sum, account) => sum + account.balance, 0))}</p>
        <p className="text-sm text-green-600 mt-1">+5.2% since last month</p>
      </div>
    </>
  );
};

export default BankBalancesReport;
