
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetricData } from '@/types/compliance';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart, 
  PieChart, 
  Pie, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';

interface ComplianceMetricsProps {
  associationId?: string;
}

const ComplianceMetrics: React.FC<ComplianceMetricsProps> = ({ associationId }) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [statusData, setStatusData] = useState<MetricData[]>([]);
  const [typeData, setTypeData] = useState<MetricData[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    if (!associationId) {
      setLoading(false);
      return;
    }

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        
        // In a real application, we would fetch real data from the database
        // For now, we'll use mock data
        
        // Mock status data
        setStatusData([
          { name: 'Open', value: 12, color: '#ef4444' },
          { name: 'In Progress', value: 8, color: '#f59e0b' },
          { name: 'Resolved', value: 24, color: '#10b981' },
          { name: 'Dismissed', value: 4, color: '#6b7280' },
        ]);
        
        // Mock type data
        setTypeData([
          { name: 'Architectural', value: 15, color: '#3b82f6' },
          { name: 'Landscaping', value: 12, color: '#10b981' },
          { name: 'Parking', value: 8, color: '#f59e0b' },
          { name: 'Noise', value: 6, color: '#6366f1' },
          { name: 'Pets', value: 4, color: '#ec4899' },
          { name: 'Trash', value: 3, color: '#6b7280' },
        ]);
        
        // Mock monthly data
        setMonthlyData([
          { name: 'Jan', reported: 5, resolved: 3 },
          { name: 'Feb', reported: 8, resolved: 6 },
          { name: 'Mar', reported: 12, resolved: 10 },
          { name: 'Apr', reported: 10, resolved: 8 },
          { name: 'May', reported: 7, resolved: 9 },
          { name: 'Jun', reported: 15, resolved: 12 },
        ]);
      } catch (err) {
        console.error('Error fetching compliance metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [associationId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-6 w-40" /></CardTitle>
          <CardDescription><Skeleton className="h-4 w-64" /></CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!associationId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compliance Metrics</CardTitle>
          <CardDescription>
            Visual analytics of compliance and violation data
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-6">
            <p>Please select an association to view compliance metrics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Metrics</CardTitle>
        <CardDescription>
          Visual analytics of compliance and violation data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="overview" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Status Overview</TabsTrigger>
            <TabsTrigger value="type">Violation Types</TabsTrigger>
            <TabsTrigger value="trend">Monthly Trends</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 h-[400px]">
            <TabsContent value="overview" className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} violations`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="type" className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={typeData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip formatter={(value: number) => [`${value} violations`, 'Count']} />
                  <Legend />
                  <Bar dataKey="value" name="Violations">
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="trend" className="h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reported" name="Reported" fill="#f59e0b" />
                  <Bar dataKey="resolved" name="Resolved" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-md">
          <h4 className="text-base font-medium mb-2">Key Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm">
                <strong>Status Distribution:</strong> {Math.round((statusData.find(d => d.name === 'Resolved')?.value || 0) / statusData.reduce((sum, d) => sum + d.value, 0) * 100)}% of violations have been resolved, with {statusData.find(d => d.name === 'Open')?.value} still open.
              </p>
            </div>
            <div>
              <p className="text-sm">
                <strong>Top Violation Types:</strong> {typeData[0]?.name} violations are the most common, followed by {typeData[1]?.name}.
              </p>
            </div>
            <div>
              <p className="text-sm">
                <strong>Monthly Trend:</strong> Violation reports {monthlyData[monthlyData.length - 1]?.reported > monthlyData[monthlyData.length - 2]?.reported ? 'increased' : 'decreased'} in the last month, while resolutions {monthlyData[monthlyData.length - 1]?.resolved > monthlyData[monthlyData.length - 2]?.resolved ? 'increased' : 'decreased'}.
              </p>
            </div>
            <div>
              <p className="text-sm">
                <strong>Resolution Rate:</strong> The average resolution rate is {Math.round(monthlyData.reduce((sum, d) => sum + d.resolved, 0) / monthlyData.reduce((sum, d) => sum + d.reported, 0) * 100)}% over the displayed period.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceMetrics;
