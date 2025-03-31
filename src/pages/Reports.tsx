import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSpreadsheet, Download, Filter, BarChart, PieChart, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RePieChart, Pie, Cell, LineChart as ReLineChart, Line, ResponsiveContainer } from 'recharts';

const Reports = () => {
  // Sample data for charts
  const monthlyData = [
    { name: 'Jan', income: 42000, expenses: 30000 },
    { name: 'Feb', income: 44000, expenses: 32000 },
    { name: 'Mar', income: 43500, expenses: 31000 },
    { name: 'Apr', income: 45000, expenses: 33000 },
    { name: 'May', income: 47000, expenses: 31500 },
    { name: 'Jun', income: 48000, expenses: 32000 },
  ];

  const expenseData = [
    { name: 'Maintenance', value: 32000 },
    { name: 'Utilities', value: 18000 },
    { name: 'Administration', value: 12000 },
    { name: 'Insurance', value: 8000 },
    { name: 'Reserves', value: 10000 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
      <div className="grid gap-4 md:gap-6 mb-6">
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">Financial Reports</h2>
              <p className="text-muted-foreground">Analyze financial data across all properties</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'Income Statement', desc: 'Monthly revenue & expenses', icon: BarChart, color: 'bg-blue-50 text-blue-600' },
            { title: 'Balance Sheet', desc: 'Assets & liabilities', icon: PieChart, color: 'bg-purple-50 text-purple-600' },
            { title: 'Cash Flow', desc: 'Monthly cash movement', icon: LineChart, color: 'bg-green-50 text-green-600' },
          ].map((item, i) => (
            <Card key={i} className="animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <div className={`${item.color} p-2 rounded-full`}>
                  <item.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-base font-medium">{item.desc}</div>
                <Button variant="link" className="p-0 h-auto text-xs">
                  View Report
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
        
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>
              Key financial metrics and trends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="income-expense">
              <TabsList className="mb-4">
                <TabsTrigger value="income-expense">Income vs Expenses</TabsTrigger>
                <TabsTrigger value="expense-breakdown">Expense Breakdown</TabsTrigger>
                <TabsTrigger value="cash-flow">Cash Flow Trend</TabsTrigger>
              </TabsList>
              
              <TabsContent value="income-expense" className="pt-4">
                <ResponsiveContainer width="100%" height={350}>
                  <ReBarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#4ade80" />
                    <Bar dataKey="expenses" name="Expenses" fill="#f87171" />
                  </ReBarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="expense-breakdown" className="pt-4">
                <ResponsiveContainer width="100%" height={350}>
                  <RePieChart>
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
                    <Tooltip formatter={(value) => `$${value}`} />
                  </RePieChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="cash-flow" className="pt-4">
                <ResponsiveContainer width="100%" height={350}>
                  <ReLineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value}`} />
                    <Legend />
                    <Line type="monotone" dataKey="income" name="Income" stroke="#4ade80" strokeWidth={2} />
                    <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#f87171" strokeWidth={2} />
                  </ReLineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in animate-delay-200">
          <CardHeader>
            <CardTitle>Available Reports</CardTitle>
            <CardDescription>
              Access and download detailed financial reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Monthly Income Statement', period: 'June 2023', format: 'Excel' },
                { title: 'Annual Budget Report', period: 'FY 2023', format: 'PDF' },
                { title: 'Expense Analysis by Category', period: 'Q2 2023', format: 'Excel' },
                { title: 'Property Comparison Report', period: 'YTD 2023', format: 'PDF' },
                { title: 'Accounts Receivable Aging', period: 'Current', format: 'Excel' },
                { title: 'Reserve Fund Analysis', period: 'June 2023', format: 'PDF' },
              ].map((report, i) => (
                <div key={i} className="flex items-start p-4 border rounded-lg">
                  <div className="mr-4 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileSpreadsheet className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{report.title}</h4>
                    <p className="text-xs text-muted-foreground">Period: {report.period}</p>
                    <p className="text-xs text-muted-foreground">Format: {report.format}</p>
                    <Button variant="link" className="p-0 h-auto text-xs mt-1 inline-flex items-center">
                      Download <Download className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
