
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Edit, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface ViolationsTableProps {
  associationId?: string;
}

interface Violation {
  id: string;
  property: string;
  violation_type: string;
  reported_date: string;
  status: string;
}

const ViolationsTable: React.FC<ViolationsTableProps> = ({ associationId }) => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!associationId) {
      setLoading(false);
      return;
    }

    const fetchViolations = async () => {
      try {
        setLoading(true);
        
        // Fetch violations for the selected association
        const { data, error } = await supabase
          .from('violations')
          .select(`
            id,
            property_id,
            violation_type,
            reported_date,
            status,
            properties(address)
          `)
          .eq('association_id', associationId)
          .order('reported_date', { ascending: false });

        if (error) throw error;

        // Transform data for the table
        const formattedViolations = data?.map(item => ({
          id: item.id,
          property: item.properties?.address || 'Unknown Property',
          violation_type: item.violation_type || 'Unspecified',
          reported_date: item.reported_date,
          status: item.status || 'open'
        })) || [];

        setViolations(formattedViolations);
      } catch (err) {
        console.error('Error fetching violations:', err);
        setError('Failed to load violations');
      } finally {
        setLoading(false);
      }
    };

    fetchViolations();
  }, [associationId]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return <Badge variant="default">Open</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'scheduled':
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
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
            {Array(3).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                <TableCell><Skeleton className="h-8 w-20" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!associationId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please select an association to view violations</p>
      </div>
    );
  }

  if (violations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No violations found for this association</p>
      </div>
    );
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
              <TableCell>{getStatusBadge(violation.status)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Violation</DropdownMenuItem>
                      <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete Violation</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ViolationsTable;
