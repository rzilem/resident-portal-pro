
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ViolationsTableProps {
  associationId?: string;
}

const ViolationsTable: React.FC<ViolationsTableProps> = ({ associationId }) => {
  // In a real app, you would use the associationId to fetch data
  const hasViolations = Boolean(associationId); // just for demo

  return (
    <div>
      {hasViolations ? (
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
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                {associationId ? (
                  <p>Showing violations for association ID: {associationId}</p>
                ) : (
                  <p>Please select an association to view violations</p>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No violations found</p>
        </div>
      )}
    </div>
  );
};

export default ViolationsTable;
