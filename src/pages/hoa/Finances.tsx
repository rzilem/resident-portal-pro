
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, DollarSign, FileText, PieChart, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Finances = () => {
  // Example financial data for charts
  const revenueData = [
    { month: 'Jan', amount: 12000 },
    { month: 'Feb', amount: 12000 },
    { month: 'Mar', amount: 14000 },
    { month: 'Apr', amount: 12000 },
    { month: 'May', amount: 12000 },
    { month: 'Jun', amount: 17000 },
    { month: 'Jul', amount: 12000 },
    { month: 'Aug', amount: 12000 },
    { month: 'Sep', amount: 12000 },
    { month: 'Oct', amount: 12000 },
    { month: 'Nov', amount: 12000 },
    { month: 'Dec', amount: 12000 },
  ];

  const expenseData = [
    { category: 'Landscaping', amount: 35000 },
    { category: 'Maintenance', amount: 24000 },
    { category: 'Utilities', amount: 18000 },
    { category: 'Insurance', amount: 12000 },
    { category: 'Administration', amount: 8000 },
    { category: 'Reserves', amount: 18000 },
  ];

  const budgetComparisonData = [
    { category: 'Landscaping', budgeted: 36000, actual: 35000 },
    { category: 'Maintenance', budgeted: 25000, actual: 24000 },
    { category: 'Utilities', budgeted: 18000, actual: 18000 },
    { category: 'Insurance', budgeted: 12000, actual: 12000 },
    { category: 'Administration', budgeted: 10000, actual: 8000 },
    { category: 'Reserves', budgeted: 18000, actual: 18000 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Association Finances</h1>
          <p className="text-muted-foreground mt-1">
            Financial overview and reports for your association
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            View Budget
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Operating Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$145,250.00</div>
            <p className="text-sm text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Reserve Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$352,750.00</div>
            <p className="text-sm text-muted-foreground">68% of annual target</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              YTD Expense Ratio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">83%</div>
            <p className="text-sm text-muted-foreground">of annual budgeted expenses</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Financial Overview</TabsTrigger>
          <TabsTrigger value="expenses">Expense Analysis</TabsTrigger>
          <TabsTrigger value="budget">Budget Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Annual Revenue Overview</CardTitle>
              <CardDescription>
                Monthly revenue trends for the current year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Revenue']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      name="Revenue" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Distribution</CardTitle>
              <CardDescription>
                Breakdown of expenses by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      nameKey="category"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="budget" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Budget vs. Actual Expenses</CardTitle>
              <CardDescription>
                Comparison of budgeted amounts to actual expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={budgetComparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, '']} />
                    <Legend />
                    <Bar dataKey="budgeted" name="Budgeted" fill="#8884d8" />
                    <Bar dataKey="actual" name="Actual" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finances;
