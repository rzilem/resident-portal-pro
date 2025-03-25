
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, ArrowUpDown, Search, FileText, Send } from 'lucide-react';

// Mock violation data
const mockViolations = [
  {
    id: 'v1',
    propertyAddress: '123 Oak St',
    ownerName: 'John Smith',
    violationType: 'Landscaping',
    reportDate: '2023-06-10',
    status: 'Open',
    priority: 'High',
    dueDate: '2023-06-24',
    description: 'Overgrown lawn and weeds in garden beds'
  },
  {
    id: 'v2',
    propertyAddress: '456 Maple Ave',
    ownerName: 'Sarah Johnson',
    violationType: 'Exterior Maintenance',
    reportDate: '2023-06-12',
    status: 'In Review',
    priority: 'Medium',
    dueDate: '2023-06-26',
    description: 'Peeling paint on front door and trim'
  },
  {
    id: 'v3',
    propertyAddress: '789 Pine Ln',
    ownerName: 'Robert Davis',
    violationType: 'Parking',
    reportDate: '2023-06-15',
    status: 'Second Notice',
    priority: 'Medium',
    dueDate: '2023-06-29',
    description: 'Recreational vehicle parked in driveway for more than 48 hours'
  },
  {
    id: 'v4',
    propertyAddress: '101 Cedar Rd',
    ownerName: 'Jennifer Wilson',
    violationType: 'Noise',
    reportDate: '2023-06-16',
    status: 'Final Notice',
    priority: 'High',
    dueDate: '2023-06-20',
    description: 'Loud music after 10pm on multiple occasions'
  },
  {
    id: 'v5',
    propertyAddress: '202 Elm St',
    ownerName: 'Michael Brown',
    violationType: 'Landscaping',
    reportDate: '2023-06-18',
    status: 'Open',
    priority: 'Low',
    dueDate: '2023-07-02',
    description: 'Dead tree needs to be removed from front yard'
  }
];

// Status badge colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open':
      return 'bg-blue-100 text-blue-800';
    case 'In Review':
      return 'bg-purple-100 text-purple-800';
    case 'Second Notice':
      return 'bg-amber-100 text-amber-800';
    case 'Final Notice':
      return 'bg-red-100 text-red-800';
    case 'Resolved':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Priority badge colors
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-800';
    case 'Medium':
      return 'bg-amber-100 text-amber-800';
    case 'Low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ViolationsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Filter violations based on search term
  const filteredViolations = mockViolations.filter(violation => 
    violation.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    violation.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    violation.violationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    violation.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle row selection
  const toggleRowSelection = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Toggle all rows selection
  const toggleAllRows = () => {
    if (selectedRows.length === filteredViolations.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredViolations.map(violation => violation.id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search violations..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {selectedRows.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedRows.length} selected
            </span>
            <Button size="sm" variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Notice
            </Button>
            <Button size="sm" variant="outline">
              <Send className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox 
                  checked={selectedRows.length === filteredViolations.length && filteredViolations.length > 0}
                  onCheckedChange={toggleAllRows}
                />
              </TableHead>
              <TableHead className="w-[200px]">
                <div className="flex items-center">
                  Property
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Violation Type</TableHead>
              <TableHead>Reported</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredViolations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No violations found
                </TableCell>
              </TableRow>
            ) : (
              filteredViolations.map((violation) => (
                <TableRow key={violation.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedRows.includes(violation.id)}
                      onCheckedChange={() => toggleRowSelection(violation.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{violation.propertyAddress}</TableCell>
                  <TableCell>{violation.ownerName}</TableCell>
                  <TableCell>{violation.violationType}</TableCell>
                  <TableCell>{new Date(violation.reportDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(violation.status)} variant="outline">
                      {violation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(violation.priority)} variant="outline">
                      {violation.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(violation.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Update Status</DropdownMenuItem>
                        <DropdownMenuItem>Send Notice</DropdownMenuItem>
                        <DropdownMenuItem>Log Communication</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ViolationsTable;
