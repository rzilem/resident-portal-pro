
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FinancialReportsProps {
  timeRange: string;
  association: string;
  selectedReport: string;
}

const FinancialReports = ({ timeRange, association, selectedReport }: FinancialReportsProps) => {
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

  const invoiceData = [
    { id: 'INV-2305', date: '2023-05-15', amount: 1250, status: 'Paid', vendor: 'ABC Maintenance' },
    { id: 'INV-2306', date: '2023-05-22', amount: 850, status: 'Paid', vendor: 'City Utilities' },
    { id: 'INV-2307', date: '2023-06-01', amount: 1500, status: 'Pending', vendor: 'Premium Insurance' },
    { id: 'INV-2308', date: '2023-06-10', amount: 750, status: 'Paid', vendor: 'Green Landscaping' },
    { id: 'INV-2309', date: '2023-06-15', amount: 1100, status: 'Overdue', vendor: 'Security Systems Inc' },
    { id: 'INV-2310', date: '2023-06-28', amount: 950, status: 'Pending', vendor: 'ABC Maintenance' },
    { id: 'INV-2311', date: '2023-07-05', amount: 1350, status: 'Paid', vendor: 'Elevator Services' },
    { id: 'INV-2312', date: '2023-07-12', amount: 800, status: 'Pending', vendor: 'City Utilities' },
  ];

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

  // Render different reports based on selectedReport value
  const renderReportContent = () => {
    switch (selectedReport) {
      case 'income-expense':
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
        
      case 'cash-flow':
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
        
      case 'admin-billing':
      case 'billing-report':
        return (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                {selectedReport === 'admin-billing' ? 'Admin Billing Report' : 'Billing Report'}
                <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </h3>
              <Button variant="outline" size="sm">
                Download PDF
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vendor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceData.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                        invoice.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {invoice.status}
                      </span>
                    </TableCell>
                    <TableCell>{invoice.vendor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-md">
              <h4 className="text-base font-medium mb-2">Billing Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card p-3 rounded-md border">
                  <p className="text-sm text-muted-foreground">Total Billed</p>
                  <p className="text-xl font-bold mt-1">$8,550</p>
                </div>
                <div className="bg-card p-3 rounded-md border">
                  <p className="text-sm text-muted-foreground">Paid</p>
                  <p className="text-xl font-bold mt-1 text-green-600">$5,100</p>
                </div>
                <div className="bg-card p-3 rounded-md border">
                  <p className="text-sm text-muted-foreground">Outstanding</p>
                  <p className="text-xl font-bold mt-1 text-amber-600">$3,450</p>
                </div>
              </div>
            </div>
          </>
        );
        
      case 'bank-balances':
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
        
      case 'cash-forecast':
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

      // Add more financial report types as needed
      default:
        return (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">Select a report from the dropdown above</p>
          </div>
        );
    }
  };

  return <div>{renderReportContent()}</div>;
};

export default FinancialReports;
