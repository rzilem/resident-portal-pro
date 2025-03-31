
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck, FileQuestion, FileSearch, FileText, FileBadge, TrendingUp, AlertTriangle, 
  ChartBarIcon, DollarSign, Calendar, Clock, Users, Home, Package, Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Grid } from '@/components/ui/grid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
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
import { ResaleMetrics } from './ResaleMetrics';
import { ResaleStatCards } from './ResaleStatCards';
import { ResaleTrends } from './ResaleTrends';

interface ResaleOverviewProps {
  onNavigate: (tab: string) => void;
}

const ResaleOverview: React.FC<ResaleOverviewProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [viewPeriod, setViewPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('monthly');
  
  // Sample data for charts
  const resaleModules = [
    {
      id: 'certificate',
      title: 'Resale Certificates',
      description: 'Generate and manage property resale certificates',
      icon: <FileCheck className="h-8 w-8 text-blue-500" />,
      count: 12
    },
    {
      id: 'questionnaire',
      title: 'Condo Questionnaires',
      description: 'Complete and track lender questionnaires',
      icon: <FileQuestion className="h-8 w-8 text-purple-500" />,
      count: 8
    },
    {
      id: 'inspection',
      title: 'Property Inspections',
      description: 'Schedule and document property inspections',
      icon: <FileSearch className="h-8 w-8 text-green-500" />,
      count: 6
    },
    {
      id: 'statements',
      title: 'Account Statements',
      description: 'Generate account statements for closing',
      icon: <FileText className="h-8 w-8 text-amber-500" />,
      count: 15
    },
    {
      id: 'trec-forms',
      title: 'TREC Forms',
      description: 'Standard Texas Real Estate Commission forms',
      icon: <FileBadge className="h-8 w-8 text-red-500" />,
      count: 4
    },
    {
      id: 'queue',
      title: 'Order Queue',
      description: 'View and manage the processing queue',
      icon: <Package className="h-8 w-8 text-indigo-500" />,
      count: 36
    }
  ];

  // Transaction data
  const transactionData = [
    { name: 'Jan', TREC: 24, Certificates: 18, Questionnaires: 12, Inspections: 7 },
    { name: 'Feb', TREC: 30, Certificates: 25, Questionnaires: 15, Inspections: 10 },
    { name: 'Mar', TREC: 45, Certificates: 30, Questionnaires: 20, Inspections: 15 },
    { name: 'Apr', TREC: 35, Certificates: 22, Questionnaires: 13, Inspections: 9 },
    { name: 'May', TREC: 50, Certificates: 35, Questionnaires: 25, Inspections: 18 },
    { name: 'Jun', TREC: 60, Certificates: 45, Questionnaires: 30, Inspections: 22 },
  ];

  // Revenue data
  const revenueData = [
    { name: 'Jan', Revenue: 12500, Remittance: 8500 },
    { name: 'Feb', Revenue: 17500, Remittance: 12000 },
    { name: 'Mar', Revenue: 22000, Remittance: 15500 },
    { name: 'Apr', Revenue: 19000, Remittance: 13000 },
    { name: 'May', Revenue: 25500, Remittance: 18000 },
    { name: 'Jun', Revenue: 30000, Remittance: 22500 },
  ];

  // Status distribution data
  const statusData = [
    { name: 'Completed', value: 45, color: '#10B981' },
    { name: 'In Progress', value: 30, color: '#3B82F6' },
    { name: 'Pending', value: 15, color: '#F59E0B' },
    { name: 'Cancelled', value: 10, color: '#EF4444' },
  ];

  // Document type distribution data
  const documentTypeData = [
    { name: 'TREC Forms', value: 40, color: '#8B5CF6' },
    { name: 'Resale Certificates', value: 25, color: '#3B82F6' },
    { name: 'Questionnaires', value: 20, color: '#EC4899' },
    { name: 'Inspections', value: 15, color: '#10B981' },
  ];

  // Statistics data
  const statsData = {
    currentMonth: {
      transactions: 156,
      revenue: '$42,750',
      avgCompletionTime: '3.2 days',
      pendingRequests: 24
    },
    previousMonth: {
      transactions: 142,
      revenue: '$38,900',
      avgCompletionTime: '3.5 days',
      pendingRequests: 18
    },
    yearToDate: {
      transactions: 872,
      revenue: '$235,400',
      avgCompletionTime: '3.4 days',
      completedRequests: 832
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick access cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resaleModules.map(module => (
          <Card key={module.id} className="hover:shadow-md transition-shadow cursor-pointer" 
                onClick={() => onNavigate(module.id)}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                {module.icon}
                <span className="bg-gray-100 px-2 py-1 rounded-md text-sm font-medium">{module.count}</span>
              </div>
              <CardTitle className="text-xl mt-2">{module.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{module.description}</CardDescription>
              <Button variant="link" className="mt-2 p-0" onClick={() => onNavigate(module.id)}>
                View {module.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics & Metrics */}
      <ResaleMetrics />

      {/* Performance Charts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Performance Metrics</CardTitle>
            <Tabs defaultValue="monthly" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="daily" onClick={() => setViewPeriod('daily')}>Daily</TabsTrigger>
                <TabsTrigger value="weekly" onClick={() => setViewPeriod('weekly')}>Weekly</TabsTrigger>
                <TabsTrigger value="monthly" onClick={() => setViewPeriod('monthly')}>Monthly</TabsTrigger>
                <TabsTrigger value="quarterly" onClick={() => setViewPeriod('quarterly')}>Quarterly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <CardDescription>
            Track resale document processing performance over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-80">
              <h3 className="text-lg font-semibold mb-3">Transactions by Document Type</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="TREC" fill="#8B5CF6" />
                  <Bar dataKey="Certificates" fill="#3B82F6" />
                  <Bar dataKey="Questionnaires" fill="#EC4899" />
                  <Bar dataKey="Inspections" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-80">
              <h3 className="text-lg font-semibold mb-3">Revenue & Remittance</h3>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Revenue" fill="#10B981" />
                  <Bar dataKey="Remittance" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribution Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
            <CardDescription>
              Current distribution of resale requests by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Type Distribution</CardTitle>
            <CardDescription>
              Distribution of processed documents by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={documentTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {documentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Statistics */}
      <ResaleStatCards stats={statsData} />

      {/* Trends */}
      <ResaleTrends />

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          onClick={() => navigate('/resale/reports')}
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          Generate Reports
        </Button>
        <Button 
          onClick={() => navigate('/resale/wizard')}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Resale Request
        </Button>
      </div>
    </div>
  );
};

export default ResaleOverview;
