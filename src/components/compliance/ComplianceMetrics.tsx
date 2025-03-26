
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MetricsSkeleton from './metrics/MetricsSkeleton';
import ViolationStatusChart from './metrics/ViolationStatusChart';
import ViolationTypeChart from './metrics/ViolationTypeChart';
import { useComplianceMetrics } from './metrics/useComplianceMetrics';

interface ComplianceMetricsProps {
  associationId?: string;
}

const ComplianceMetrics: React.FC<ComplianceMetricsProps> = ({ associationId }) => {
  const { loading, error, statusData, typeData } = useComplianceMetrics(associationId);

  if (loading) {
    return <MetricsSkeleton />;
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
              <ViolationStatusChart data={statusData} />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-center">Top Violation Types</h3>
              <ViolationTypeChart data={typeData} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplianceMetrics;
