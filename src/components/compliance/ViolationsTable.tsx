
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from 'date-fns';
import ViolationStatusBadge from './violations/ViolationStatusBadge';
import ViolationActions from './violations/ViolationActions';
import { useViolations } from './violations/useViolations';
import ViolationsTableSkeleton from './violations/ViolationsTableSkeleton';
import ViolationsEmptyState from './violations/ViolationsEmptyState';

interface ViolationsTableProps {
  associationId?: string;
}

const ViolationsTable: React.FC<ViolationsTableProps> = ({ associationId }) => {
  const { violations, loading, error } = useViolations(associationId);

  if (loading) {
    return <ViolationsTableSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!associationId) {
    return <ViolationsEmptyState message="Please select an association to view violations" />;
  }

  if (violations.length === 0) {
    return <ViolationsEmptyState message="No violations found for this association" />;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Violation Type</TableHead>
            <TableHead>Reported Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {violations.map((violation) => (
            <TableRow key={violation.id}>
              <TableCell>{violation.property}</TableCell>
              <TableCell>{violation.violation_type}</TableCell>
              <TableCell>
                {violation.reported_date ? 
                  formatDistanceToNow(new Date(violation.reported_date), { addSuffix: true }) :
                  'Unknown date'}
              </TableCell>
              <TableCell>
                <ViolationStatusBadge status={violation.status} />
              </TableCell>
              <TableCell>
                <ViolationActions violationId={violation.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ViolationsTable;
