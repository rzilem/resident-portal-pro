
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

interface IncomeExpenseReportProps {
  timeRange: string;
  association: string;
}

const IncomeExpenseReport = ({ timeRange, association }: IncomeExpenseReportProps) => {
  // Sample data for charts
  const monthlyData = [
    { name: 'Jan', income: 42000, expenses: 30000 },
    { name: 'Feb', income: 44000, expenses: 32000 },
    { name: 'Mar', income: 43500, expenses: 31000 },
    { name: 'Apr', income: 45000, expenses: 33000 },
    { name: 'May', income: 47000, expenses: 31500 },
    { name: 'Jun', income: 48000, expenses: 32000 },
    { name: 'Jul', income: 49000, expenses: 33000 },
    { name: 'Aug', income: 48500, expenses: 32500 },
    { name: 'Sep', income: 50000, expenses: 34000 },
    { name: 'Oct', income: 52000, expenses: 35000 },
    { name: 'Nov', income: 53000, expenses: 36000 },
    { name: 'Dec', income: 55000, expenses: 37000 },
  ];

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
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Legend />
          <Bar dataKey="income" name="Income" fill="#4ade80" />
          <Bar dataKey="expenses" name="Expenses" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-2xl font-bold">$577,000</p>
            <p className="text-xs text-green-600">
              +8.3% vs last year
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold">$397,000</p>
            <p className="text-xs text-green-600">
              +3.2% vs last year
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Net Income</p>
            <p className="text-2xl font-bold">$180,000</p>
            <p className="text-xs text-green-600">
              +12.5% vs last year
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Profit Margin</p>
            <p className="text-2xl font-bold">31.2%</p>
            <p className="text-xs text-green-600">
              +2.8% vs last year
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default IncomeExpenseReport;
