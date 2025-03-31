
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BarChart, FileText, PieChart, LineChart, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart as ReLineChart,
  Line,
  ResponsiveContainer
} from 'recharts';

interface ReportDashboardProps {
  association: string;
  timeRange: string;
  onRunReport: (report: string) => void;
}

const ReportDashboard: React.FC<ReportDashboardProps> = ({ 
  association, 
  timeRange,
  onRunReport
}) => {
  // Monthly data with different values based on association selection
  const getMonthlyData = () => {
    if (association === 'all') {
      return [
        { name: 'Jan', income: 42000, expenses: 30000 },
        { name: 'Feb', income: 44000, expenses: 32000 },
        { name: 'Mar', income: 43500, expenses: 31000 },
        { name: 'Apr', income: 45000, expenses: 33000 },
        { name: 'May', income: 47000, expenses: 31500 },
        { name: 'Jun', income: 48000, expenses: 32000 },
      ];
    } else if (association === '1') { // Sunset Heights HOA
      return [
        { name: 'Jan', income: 28000, expenses: 20000 },
        { name: 'Feb', income: 29000, expenses: 22000 },
        { name: 'Mar', income: 27500, expenses: 21000 },
        { name: 'Apr', income: 30000, expenses: 23000 },
        { name: 'May', income: 32000, expenses: 21500 },
        { name: 'Jun', income: 33000, expenses: 22000 },
      ];
    } else if (association === '2') { // Ocean View Condos
      return [
        { name: 'Jan', income: 36000, expenses: 25000 },
        { name: 'Feb', income: 38000, expenses: 27000 },
        { name: 'Mar', income: 37500, expenses: 26000 },
        { name: 'Apr', income: 39000, expenses: 28000 },
        { name: 'May', income: 41000, expenses: 26500 },
        { name: 'Jun', income: 42000, expenses: 27000 },
      ];
    } else { // Mountain Valley Association or any other
      return [
        { name: 'Jan', income: 22000, expenses: 15000 },
        { name: 'Feb', income: 23000, expenses: 17000 },
        { name: 'Mar', income: 22500, expenses: 16000 },
        { name: 'Apr', income: 24000, expenses: 18000 },
        { name: 'May', income: 26000, expenses: 16500 },
        { name: 'Jun', income: 27000, expenses: 17000 },
      ];
    }
  };

  // Expense data with different values based on association selection
  const getExpenseData = () => {
    if (association === 'all') {
      return [
        { name: 'Maintenance', value: 32000 },
        { name: 'Utilities', value: 18000 },
        { name: 'Administration', value: 12000 },
        { name: 'Insurance', value: 8000 },
        { name: 'Reserves', value: 10000 },
      ];
    } else if (association === '1') { // Sunset Heights HOA
      return [
        { name: 'Maintenance', value: 22000 },
        { name: 'Utilities', value: 10000 },
        { name: 'Administration', value: 8000 },
        { name: 'Insurance', value: 5000 },
        { name: 'Reserves', value: 6000 },
      ];
    } else if (association === '2') { // Ocean View Condos
      return [
        { name: 'Maintenance', value: 28000 },
        { name: 'Utilities', value: 15000 },
        { name: 'Administration', value: 10000 },
        { name: 'Insurance', value: 7000 },
        { name: 'Reserves', value: 8000 },
      ];
    } else { // Mountain Valley Association or any other
      return [
        { name: 'Maintenance', value: 18000 },
        { name: 'Utilities', value: 8000 },
        { name: 'Administration', value: 6000 },
        { name: 'Insurance', value: 4000 },
        { name: 'Reserves', value: 5000 },
      ];
    }
  };

  const monthlyData = getMonthlyData();
  const expenseData = getExpenseData();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  // Featured reports list
  const featuredReports = [
    { name: 'Balance Sheet - Consolidated', value: 'balance-sheet-consolidated', icon: FileText },
    { name: 'Financial Summary', value: 'financial-summary', icon: Calculator },
    { name: 'Budget w/ Per Unit Cost (Monthly)', value: 'budget-per-unit-monthly', icon: Calculator },
    { name: 'Bank Account Balances', value: 'bank-balances', icon: Calculator },
    { name: 'Association List', value: 'association-list', icon: FileText },
    { name: 'Work Order Summary', value: 'work-order', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Income vs Expenses', desc: 'Monthly breakdown', icon: BarChart, color: 'bg-blue-50 text-blue-600', report: 'financial-summary' },
          { title: 'Expense Breakdown', desc: 'By category', icon: PieChart, color: 'bg-purple-50 text-purple-600', report: 'expense-breakdown' },
          { title: 'Cash Flow Trend', desc: '6-month trend', icon: LineChart, color: 'bg-green-50 text-green-600', report: 'cash-forecast' },
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
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs"
                onClick={() => onRunReport(item.report)}
              >
                View Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
      
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ReBarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#4ade80" />
              <Bar dataKey="expenses" name="Expenses" fill="#f87171" />
            </ReBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RePieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </RePieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Featured Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {featuredReports.map((report, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/5 cursor-pointer"
                  onClick={() => onRunReport(report.value)}
                >
                  <div className="flex items-center gap-3">
                    <report.icon className="h-5 w-5 text-muted-foreground" />
                    <span>{report.name}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportDashboard;
