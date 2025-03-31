
import React, { useEffect, useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import { sampleReportDataService } from '@/services/SampleReportDataService';

interface CashFlowReportProps {
  timeRange: string;
  association: string;
}

const CashFlowReport = ({ timeRange, association }: CashFlowReportProps) => {
  const [reportData, setReportData] = useState<any>(null);
  
  useEffect(() => {
    // Get sample data from our service
    const data = sampleReportDataService.getFinancialData('cash-flow', association);
    setReportData(data);
  }, [association, timeRange]);
  
  if (!reportData) {
    return <div className="animate-pulse p-6 text-center">Loading cash flow data...</div>;
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
  
  // Calculate average monthly income
  const avgMonthlyIncome = Math.round(
    reportData.monthlyData.reduce((sum: number, month: any) => sum + month.income, 0) / 
    reportData.monthlyData.length
  );
  
  // Calculate average monthly expenses
  const avgMonthlyExpenses = Math.round(
    reportData.monthlyData.reduce((sum: number, month: any) => sum + month.expenses, 0) / 
    reportData.monthlyData.length
  );
  
  // Calculate average net cash flow
  const avgNetCashFlow = avgMonthlyIncome - avgMonthlyExpenses;

  return (
    <>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={reportData.monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Legend />
          <Line type="monotone" dataKey="income" name="Income" stroke="#4ade80" strokeWidth={2} />
          <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#f87171" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-6 p-4 bg-muted/50 rounded-md">
        <h4 className="text-base font-medium mb-2">Cash Flow Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm mb-2">
              The cash flow trend shows consistent positive growth throughout the year, with income consistently exceeding expenses. The largest positive cash flow was observed in December, with a net positive of ${formatCurrency(reportData.monthlyData[reportData.monthlyData.length - 1].income - reportData.monthlyData[reportData.monthlyData.length - 1].expenses).replace('$', '')}.
            </p>
            <p className="text-sm">
              Seasonal variations are evident, with higher expense periods in winter months (Jan-Feb) and summer months (Jun-Aug), likely due to increased maintenance and utility costs during these seasons.
            </p>
          </div>
          <div>
            <h5 className="text-sm font-medium mb-2">Key Metrics</h5>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average Monthly Income:</span>
                <span className="text-sm font-medium">{formatCurrency(avgMonthlyIncome)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average Monthly Expenses:</span>
                <span className="text-sm font-medium">{formatCurrency(avgMonthlyExpenses)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average Net Cash Flow:</span>
                <span className="text-sm font-medium">{formatCurrency(avgNetCashFlow)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Year-End Reserve Balance:</span>
                <span className="text-sm font-medium">{formatCurrency(reportData.summary.totalAssets * 0.2)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CashFlowReport;
