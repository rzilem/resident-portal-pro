
import React from 'react';
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

interface CashFlowReportProps {
  timeRange: string;
  association: string;
}

const CashFlowReport = ({ timeRange, association }: CashFlowReportProps) => {
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
        <LineChart data={monthlyData}>
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
              The cash flow trend shows consistent positive growth throughout the year, with income consistently exceeding expenses. The largest positive cash flow was observed in December, with a net positive of $18,000.
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
                <span className="text-sm font-medium">$48,083</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average Monthly Expenses:</span>
                <span className="text-sm font-medium">$33,083</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Average Net Cash Flow:</span>
                <span className="text-sm font-medium">$15,000</span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-muted-foreground">Year-End Reserve Balance:</span>
                <span className="text-sm font-medium">$235,000</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CashFlowReport;
