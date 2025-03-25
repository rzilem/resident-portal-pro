
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

interface FinancialReportsProps {
  timeRange: string;
  association: string;
}

const FinancialReports = ({ timeRange, association }: FinancialReportsProps) => {
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

  const expenseData = [
    { name: 'Maintenance', value: 32000 },
    { name: 'Utilities', value: 18000 },
    { name: 'Administration', value: 12000 },
    { name: 'Insurance', value: 8000 },
    { name: 'Reserves', value: 10000 },
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
    <Tabs defaultValue="income-expense">
      <TabsList className="mb-4">
        <TabsTrigger value="income-expense">Income vs Expenses</TabsTrigger>
        <TabsTrigger value="expense-breakdown">Expense Breakdown</TabsTrigger>
        <TabsTrigger value="cash-flow">Cash Flow Trend</TabsTrigger>
      </TabsList>
      
      <TabsContent value="income-expense" className="pt-4">
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
      </TabsContent>
      
      <TabsContent value="expense-breakdown" className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-[350px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-base font-medium">Expense Analysis</h4>
            
            <div className="space-y-4">
              {expenseData.map((expense, index) => (
                <div key={expense.name} className="flex items-center">
                  <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span>{expense.name}</span>
                      <span className="font-medium">{formatCurrency(expense.value)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                      <div className="h-1.5 rounded-full" 
                        style={{ 
                          width: `${(expense.value / expenseData.reduce((acc, curr) => acc + curr.value, 0) * 100).toFixed(0)}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md text-sm">
              <p className="font-medium mb-2">Expense Insights</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Maintenance costs are the largest expense category at 40%</li>
                <li>Utility costs have decreased by 5% compared to last quarter</li>
                <li>Administrative expenses remain consistent year over year</li>
                <li>Reserve contributions are meeting the annual target of 10%</li>
              </ul>
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="cash-flow" className="pt-4">
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
      </TabsContent>
    </Tabs>
  );
};

export default FinancialReports;
