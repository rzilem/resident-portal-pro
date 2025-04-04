
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Calendar, Building2, User, Check } from 'lucide-react';

// Mock data for different request types
const requestTypeData: Record<string, any[]> = {
  all: [
    { id: 1, type: 'ARC Request', association: 'Lakeside HOA', submittedBy: 'John Doe', submittedDate: '2023-04-01', status: 'pending', description: 'Fence installation approval request' },
    { id: 2, type: 'Gate Access', association: 'Westview Condos', submittedBy: 'Jane Smith', submittedDate: '2023-04-02', status: 'approved', description: 'New gate access card request' },
    { id: 3, type: 'Pool Key', association: 'Oakridge Community', submittedBy: 'Mike Johnson', submittedDate: '2023-04-03', status: 'pending', description: 'Replacement pool key request' },
    { id: 4, type: 'General Inquiry', association: 'Cedar Heights', submittedBy: 'Sarah Williams', submittedDate: '2023-04-01', status: 'in-progress', description: 'Question about upcoming community event' },
    { id: 5, type: 'ARC Request', association: 'Meadowbrook HOA', submittedBy: 'David Brown', submittedDate: '2023-04-02', status: 'rejected', description: 'Solar panel installation request' },
  ],
  arc: [
    { id: 1, type: 'ARC Request', association: 'Lakeside HOA', submittedBy: 'John Doe', submittedDate: '2023-04-01', status: 'pending', description: 'Fence installation approval request' },
    { id: 5, type: 'ARC Request', association: 'Meadowbrook HOA', submittedBy: 'David Brown', submittedDate: '2023-04-02', status: 'rejected', description: 'Solar panel installation request' },
    { id: 6, type: 'ARC Request', association: 'Park Place', submittedBy: 'Emily Davis', submittedDate: '2023-04-03', status: 'approved', description: 'Deck extension approval request' },
    { id: 7, type: 'ARC Request', association: 'Riverside Estates', submittedBy: 'Robert Wilson', submittedDate: '2023-04-04', status: 'pending', description: 'Exterior paint color approval' },
  ],
  access: [
    { id: 2, type: 'Gate Access', association: 'Westview Condos', submittedBy: 'Jane Smith', submittedDate: '2023-04-02', status: 'approved', description: 'New gate access card request' },
    { id: 3, type: 'Pool Key', association: 'Oakridge Community', submittedBy: 'Mike Johnson', submittedDate: '2023-04-03', status: 'pending', description: 'Replacement pool key request' },
    { id: 8, type: 'Gate Access', association: 'Highland Terrace', submittedBy: 'Lisa Moore', submittedDate: '2023-04-04', status: 'pending', description: 'Additional gate remote request' },
    { id: 9, type: 'Pool Key', association: 'Sunset Villas', submittedBy: 'Thomas Lee', submittedDate: '2023-04-05', status: 'approved', description: 'New pool access key request' },
  ]
};

interface RecentRequestsListProps {
  type?: 'all' | 'arc' | 'access';
}

const RecentRequestsList: React.FC<RecentRequestsListProps> = ({ type = 'all' }) => {
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleRowClick = (request: any) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };
  
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'outline' | 'secondary' | 'destructive', label: string }> = {
      'pending': { variant: 'outline', label: 'Pending' },
      'in-progress': { variant: 'secondary', label: 'In Progress' },
      'approved': { variant: 'default', label: 'Approved' },
      'rejected': { variant: 'destructive', label: 'Rejected' },
    };
    
    const config = statusConfig[status] || { variant: 'outline', label: status };
    
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  // Get data based on the selected type
  const data = requestTypeData[type];
  
  return (
    <>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Association</TableHead>
            <TableHead>Submitted By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((request) => (
            <TableRow 
              key={request.id} 
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleRowClick(request)}
            >
              <TableCell className="font-medium">{request.type}</TableCell>
              <TableCell>{request.association}</TableCell>
              <TableCell>{request.submittedBy}</TableCell>
              <TableCell>{new Date(request.submittedDate).toLocaleDateString()}</TableCell>
              <TableCell>{getStatusBadge(request.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedRequest && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedRequest.type} Details</DialogTitle>
              <DialogDescription>
                {selectedRequest.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Association:</span>
                <span>{selectedRequest.association}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Submitted by:</span>
                <span>{selectedRequest.submittedBy}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Date:</span>
                <span>{new Date(selectedRequest.submittedDate).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Status:</span>
                {getStatusBadge(selectedRequest.status)}
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
              {selectedRequest.status === 'pending' && (
                <Button className="gap-2">
                  <Check className="h-4 w-4" /> Approve
                </Button>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default RecentRequestsList;
