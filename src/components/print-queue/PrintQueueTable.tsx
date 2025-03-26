
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tag, Building } from 'lucide-react';
import { PrintJob } from '@/hooks/use-print-queue';

interface PrintQueueTableProps {
  jobs: PrintJob[];
  selectedJobs: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onSetCategoryFilter: (category: string) => void;
  onSetAssociationFilter: (id: string, name: string) => void;
}

const PrintQueueTable: React.FC<PrintQueueTableProps> = ({
  jobs,
  selectedJobs,
  onToggleSelect,
  onSelectAll,
  onSetCategoryFilter,
  onSetAssociationFilter
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'printing':
        return <Badge className="bg-blue-500">Printing</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={jobs.length > 0 && selectedJobs.length === jobs.length}
                onCheckedChange={() => onSelectAll()}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Document</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Association</TableHead>
            <TableHead>Pages</TableHead>
            <TableHead>Copies</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Certified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <TableRow key={job.id} className={selectedJobs.includes(job.id) ? "bg-blue-50" : ""}>
                <TableCell>
                  <Checkbox 
                    checked={selectedJobs.includes(job.id)}
                    onCheckedChange={() => onToggleSelect(job.id)}
                    aria-label={`Select ${job.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{job.name}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-xs"
                    onClick={() => onSetCategoryFilter(job.category)}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {job.category}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2 text-xs"
                    onClick={() => onSetAssociationFilter(job.associationId, job.associationName)}
                  >
                    <Building className="h-3 w-3 mr-1" />
                    {job.associationName}
                  </Button>
                </TableCell>
                <TableCell>{job.pageCount}</TableCell>
                <TableCell>{job.copies}</TableCell>
                <TableCell>{getStatusBadge(job.status)}</TableCell>
                <TableCell>{job.sendCertified ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No print jobs found in the queue.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PrintQueueTable;
