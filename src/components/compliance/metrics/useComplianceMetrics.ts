
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ViolationRow, MetricData } from '@/types/compliance';

interface StatusColors {
  [key: string]: string;
}

interface UseComplianceMetricsResult {
  loading: boolean;
  error: string | null;
  statusData: MetricData[];
  typeData: MetricData[];
}

export const useComplianceMetrics = (associationId?: string): UseComplianceMetricsResult => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusData, setStatusData] = useState<MetricData[]>([]);
  const [typeData, setTypeData] = useState<MetricData[]>([]);

  const statusColors: StatusColors = {
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

  return { loading, error, statusData, typeData };
};
