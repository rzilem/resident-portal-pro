
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { ViolationRow } from '@/types/compliance';

interface ComplianceMetricsProps {
  associationId?: string;
}

interface MetricData {
  name: string;
  value: number;
  color: string;
}

const ComplianceMetrics: React.FC<ComplianceMetricsProps> = ({ associationId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusData, setStatusData] = useState<MetricData[]>([]);
  const [typeData, setTypeData] = useState<MetricData[]>([]);

  const statusColors = {
    open: '#f59e0b',
    pending: '#3b82f6',
    scheduled: '#6366f1',
    resolved: '#10b981',
    cancelled: '#6b7280',
    default: '#d1d5db'
  };

  const typeColors = [
    '#7c3aed',
    '#ec4899',
    '#f43f5e',
    '#8b5cf6',
    '#0ea5e9',
    '#14b8a6',
    '#84cc16',
    '#eab308'
  ];

  useEffect(() => {
    if (!associationId) {
      setLoading(false);
      return;
    }

    const fetchComplianceMetrics = async () => {
      try {
        setLoading(true);
        // Fetch violations data from Supabase
        const { data, error } = await supabase
          .from('violations')
          .select('status, violation_type')
          .eq('association_id', associationId);

        if (error) throw error;

        if (!data || data.length === 0) {
          setStatusData([]);
          setTypeData([]);
          setLoading(false);
          return;
        }

        // Process status metrics
        const statusCounts: Record<string, number> = {};
        data.forEach((item: ViolationRow) => {
          const status = item.status?.toLowerCase() || 'unknown';
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });

        const statusMetrics = Object.entries(statusCounts).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
          color: (statusColors as any)[name] || statusColors.default
        }));

        // Process violation type metrics
        const typeCounts: Record<string, number> = {};
        data.forEach((item: ViolationRow) => {
          const type = item.violation_type || 'unspecified';
          typeCounts[type] = (typeCounts[type] || 0) + 1;
        });

        const typeMetrics = Object.entries(typeCounts)
          .map(([name, value], index) => ({
            name,
            value,
            color: typeColors[index % typeColors.length]
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5); // Top 5 violation types
        
        setStatusData(statusMetrics);
        setTypeData(typeMetrics);
      } catch (err) {
        console.error('Error fetching compliance metrics:', err);
        setError('Failed to load metrics data');
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceMetrics();
  }, [associationId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
          <CardDescription><Skeleton className="h-4 w-64" /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compliance Metrics</CardTitle>
          <CardDescription>Analytics and statistics for compliance issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-500">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Metrics</CardTitle>
        <CardDescription>Analytics and statistics for compliance issues</CardDescription>
      </CardHeader>
      <CardContent>
        {!associationId ? (
          <div className="text-center py-4">
            <p>Please select an association to view compliance metrics</p>
          </div>
        ) : statusData.length === 0 && typeData.length === 0 ? (
          <div className="text-center py-4">
            <p>No compliance data available for this association</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4 text-center">Violations by Status</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-center">Top Violation Types</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => 
                        `${name.length > 10 ? name.substring(0, 10) + '...' : name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplianceMetrics;
