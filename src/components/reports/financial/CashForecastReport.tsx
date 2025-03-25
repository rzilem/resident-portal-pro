
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
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

interface CashForecastReportProps {
  timeRange: string;
  association: string;
}

const CashForecastReport = ({ timeRange, association }: CashForecastReportProps) => {
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
          Cash Forecast Report
          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </h3>
        <Button variant="outline" size="sm">
          Download Forecast
        </Button>
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <LineChart 
          data={[
            { month: 'Jul', actual: 15000, forecast: 15000 },
            { month: 'Aug', actual: 16000, forecast: 16000 },
            { month: 'Sep', actual: 16500, forecast: 16500 },
            { month: 'Oct', actual: null, forecast: 17000 },
            { month: 'Nov', actual: null, forecast: 17500 },
            { month: 'Dec', actual: null, forecast: 18000 },
          ]}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Legend />
          <Line type="monotone" dataKey="actual" name="Actual Cash Flow" stroke="#4ade80" strokeWidth={2} />
          <Line type="monotone" dataKey="forecast" name="Forecasted Cash Flow" stroke="#60a5fa" strokeWidth={2} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-muted/50 rounded-md">
          <h4 className="text-base font-medium mb-2">Forecast Assumptions</h4>
          <ul className="space-y-1 text-sm">
            <li>• Expected increase in HOA fees collection by 2% month-over-month</li>
            <li>• Seasonal maintenance expenses expected in October</li>
            <li>• Year-end vendor payments scheduled for December</li>
            <li>• Reserve contributions remain constant at 10% of revenue</li>
            <li>• No special assessments planned for this period</li>
          </ul>
        </div>
        
        <div className="p-4 bg-muted/50 rounded-md">
          <h4 className="text-base font-medium mb-2">Year-End Projections</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Projected Year-End Cash Balance:</span>
              <span className="text-sm font-medium">$285,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Projected Reserve Growth:</span>
              <span className="text-sm font-medium">+8.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Cash Flow Sensitivity:</span>
              <span className="text-sm font-medium">Medium</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Projected Cash Ratio:</span>
              <span className="text-sm font-medium">1.4</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CashForecastReport;
