
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Download } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { PropertyColumn } from '@/components/properties/PropertyColumnsSelector';

interface ARCReportProps {
  timeRange: string;
  association: string;
  onExport: (columns: PropertyColumn[]) => void;
}

const ARCReport = ({ timeRange, association, onExport }: ARCReportProps) => {
  // Sample ARC request data
  const arcRequestData = [
    { id: 'ARC-001', property: 'Oakwood Residence', type: 'Exterior Paint', status: 'Approved', submitDate: '2023-05-10', decisionDate: '2023-05-20' },
    { id: 'ARC-002', property: 'Willow Heights', type: 'Fence Installation', status: 'Pending', submitDate: '2023-06-05', decisionDate: null },
    { id: 'ARC-003', property: 'Cedar Point', type: 'Roof Replacement', status: 'Approved', submitDate: '2023-06-12', decisionDate: '2023-06-25' },
    { id: 'ARC-004', property: 'Maple Grove', type: 'Landscaping', status: 'Denied', submitDate: '2023-06-18', decisionDate: '2023-06-28' },
    { id: 'ARC-005', property: 'Birchwood Court', type: 'Solar Panels', status: 'Approved', submitDate: '2023-07-01', decisionDate: '2023-07-15' },
    { id: 'ARC-006', property: 'Pine Valley', type: 'Driveway Extension', status: 'Pending', submitDate: '2023-07-10', decisionDate: null },
  ];

  // Default columns for exporting
  const defaultColumns: PropertyColumn[] = [
    { id: 'name', label: 'Property Name', checked: true },
    { id: 'location', label: 'Location', checked: true },
    { id: 'units', label: 'Units', checked: true },
    { id: 'status', label: 'Status', checked: true },
    { id: 'foundedDate', label: 'Founded Date', checked: true },
  ];

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          Architectural Review Committee (ARC) Report
          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </h3>
        <Button variant="outline" size="sm" onClick={() => onExport(defaultColumns)}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request ID</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Request Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submit Date</TableHead>
            <TableHead>Decision Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {arcRequestData.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.id}</TableCell>
              <TableCell>{request.property}</TableCell>
              <TableCell>{request.type}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  request.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                  request.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {request.status}
                </span>
              </TableCell>
              <TableCell>{formatDate(request.submitDate)}</TableCell>
              <TableCell>{formatDate(request.decisionDate)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium">Total Requests</h4>
            <p className="text-2xl font-bold mt-1">6</p>
            <p className="text-xs text-muted-foreground mt-1">Last 90 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium">Approval Rate</h4>
            <p className="text-2xl font-bold mt-1">75%</p>
            <p className="text-xs text-green-600 mt-1">+5% from last quarter</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium">Avg. Turnaround</h4>
            <p className="text-2xl font-bold mt-1">12 days</p>
            <p className="text-xs text-green-600 mt-1">-2 days from last quarter</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6 p-4 bg-muted/50 rounded-md">
        <h4 className="text-base font-medium mb-2">ARC Request Insights</h4>
        <p className="text-sm">
          Exterior modifications continue to be the most common request type this quarter. The ARC committee has improved its average response time by 2 days compared to the previous quarter, with most requests now receiving decisions within 12 days of submission.
        </p>
      </div>
    </div>
  );
};

export default ARCReport;
