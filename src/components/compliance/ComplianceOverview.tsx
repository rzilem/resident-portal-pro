
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface ComplianceOverviewProps {
  associationId?: string;
}

const ComplianceOverview: React.FC<ComplianceOverviewProps> = ({ associationId }) => {
  const [loading, setLoading] = useState(true);
  const [complianceData, setComplianceData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!associationId) {
      setLoading(false);
      return;
    }

    const fetchComplianceOverview = async () => {
      try {
        setLoading(true);
        // Fetch compliance overview data from Supabase
        const { data, error } = await supabase
          .from('violations')
          .select('*')
          .eq('association_id', associationId);

        if (error) throw error;

        // Prepare summary data
        const summary = {
          totalViolations: data?.length || 0,
          openViolations: data?.filter(v => !v.resolved_date).length || 0,
          resolvedViolations: data?.filter(v => v.resolved_date).length || 0,
        };

        setComplianceData(summary);
      } catch (err) {
        console.error('Error fetching compliance overview:', err);
        setError('Failed to load compliance data');
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceOverview();
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
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compliance Overview</CardTitle>
          <CardDescription>Summary of compliance issues for the association</CardDescription>
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
        <CardTitle>Compliance Overview</CardTitle>
        <CardDescription>Summary of compliance issues for the association</CardDescription>
      </CardHeader>
      <CardContent>
        {!associationId ? (
          <div className="text-center py-4">
            <p>Please select an association to view compliance overview</p>
          </div>
        ) : complianceData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background rounded-lg p-4 border">
              <h3 className="text-lg font-medium">Total Violations</h3>
              <p className="text-3xl font-bold mt-2">{complianceData.totalViolations}</p>
            </div>
            <div className="bg-background rounded-lg p-4 border">
              <h3 className="text-lg font-medium">Open Issues</h3>
              <p className="text-3xl font-bold mt-2 text-amber-500">{complianceData.openViolations}</p>
            </div>
            <div className="bg-background rounded-lg p-4 border">
              <h3 className="text-lg font-medium">Resolved</h3>
              <p className="text-3xl font-bold mt-2 text-green-500">{complianceData.resolvedViolations}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p>No compliance data available for this association</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplianceOverview;
