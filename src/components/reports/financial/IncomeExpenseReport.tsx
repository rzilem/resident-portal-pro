
import React, { useEffect, useState } from 'react';
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
import { sampleReportDataService } from '@/services/SampleReportDataService';

interface IncomeExpenseReportProps {
  timeRange: string;
  association: string;
}

const IncomeExpenseReport = ({ timeRange, association }: IncomeExpenseReportProps) => {
  const [reportData, setReportData] = useState<any>(null);
  
  useEffect(() => {
    // Get sample data from our service
    const data = sampleReportDataService.getFinancialData('income-expense', association);
    setReportData(data);
  }, [association, timeRange]);
  
  if (!reportData) {
    return <div className="animate-pulse p-6 text-center">Loading income vs expense data...</div>;
  }

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
        <BarChart data={reportData.monthlyData}>
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
            <p className="text-2xl font-bold">{formatCurrency(reportData.summary.totalIncome)}</p>
            <p className="text-xs text-green-600">
              +8.3% vs last year
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold">{formatCurrency(reportData.summary.totalExpenses)}</p>
            <p className="text-xs text-green-600">
              +3.2% vs last year
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Net Income</p>
            <p className="text-2xl font-bold">{formatCurrency(reportData.summary.netIncome)}</p>
            <p className="text-xs text-green-600">
              +12.5% vs last year
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex flex-col gap-1">
            <p className="text-sm text-muted-foreground">Profit Margin</p>
            <p className="text-2xl font-bold">{(reportData.summary.netIncome / reportData.summary.totalIncome * 100).toFixed(1)}%</p>
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
