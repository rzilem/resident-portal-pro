
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
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { sampleReportDataService } from '@/services/SampleReportDataService';

interface CashForecastReportProps {
  timeRange: string;
  association: string;
}

const CashForecastReport = ({ timeRange, association }: CashForecastReportProps) => {
  const [reportData, setReportData] = useState<any>(null);
  
  useEffect(() => {
    // Get sample data from our service
    const data = sampleReportDataService.getFinancialData('cash-forecast', association);
    setReportData(data);
  }, [association, timeRange]);
  
  if (!reportData) {
    return <div className="animate-pulse p-6 text-center">Loading cash forecast data...</div>;
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
  
  // Generate forecast data based on actual data from the report
  const generateForecastData = () => {
    // Use last 3 months of data for actual, then project forward 3 months
    const actualMonths = reportData.monthlyData.slice(-3);
    const lastActualMonth = actualMonths[actualMonths.length - 1];
    
    // Calculate average growth rate from actual data
    const avgIncomeGrowth = 0.03; // 3% monthly growth
    const avgExpenseGrowth = 0.02; // 2% monthly growth
    
    // Create forecast months
    const forecastMonths = ['Oct', 'Nov', 'Dec'];
    const forecastData = [
      {
        month: actualMonths[0].name,
        actual: actualMonths[0].income - actualMonths[0].expenses,
        forecast: actualMonths[0].income - actualMonths[0].expenses
      },
      {
        month: actualMonths[1].name,
        actual: actualMonths[1].income - actualMonths[1].expenses,
        forecast: actualMonths[1].income - actualMonths[1].expenses
      },
      {
        month: actualMonths[2].name,
        actual: actualMonths[2].income - actualMonths[2].expenses,
        forecast: actualMonths[2].income - actualMonths[2].expenses
      }
    ];
    
    // Add forecast months
    let lastNetCashflow = lastActualMonth.income - lastActualMonth.expenses;
    
    for (let i = 0; i < forecastMonths.length; i++) {
      const forecastNetCashflow = Math.round(lastNetCashflow * (1 + (avgIncomeGrowth - avgExpenseGrowth)));
      forecastData.push({
        month: forecastMonths[i],
        actual: null,
        forecast: forecastNetCashflow
      });
      lastNetCashflow = forecastNetCashflow;
    }
    
    return forecastData;
  };
  
  const forecastData = generateForecastData();

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
        <LineChart data={forecastData}>
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
              <span className="text-sm font-medium">{formatCurrency(reportData.summary.cashOnHand * 1.15)}</span>
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
