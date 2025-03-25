
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, Download, Mail } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from './utils/formatters';

interface BoardMembersReportProps {
  timeRange: string;
  association: string;
}

const BoardMembersReport = ({ timeRange, association }: BoardMembersReportProps) => {
  // Sample board members data
  const boardMembersData = [
    { id: 1, name: 'Robert Johnson', property: 'Cedar Point', unit: '310', position: 'President', startDate: '2022-01-05', email: 'robert@example.com', phone: '555-456-7890' },
    { id: 2, name: 'Sarah Miller', property: 'Pine Valley', unit: '220', position: 'Vice President', startDate: '2022-01-05', email: 'sarah@example.com', phone: '555-345-6789' },
    { id: 3, name: 'David Brown', property: 'Birchwood Court', unit: '115', position: 'Treasurer', startDate: '2022-01-05', email: 'david@example.com', phone: '555-876-5432' },
    { id: 4, name: 'Jennifer Garcia', property: 'Willow Heights', unit: '210', position: 'Secretary', startDate: '2022-01-05', email: 'jennifer@example.com', phone: '555-789-0123' },
    { id: 5, name: 'John Smith', property: 'Oakwood Residence', unit: '101', position: 'Member', startDate: '2022-01-05', email: 'john@example.com', phone: '555-123-4567' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          Board Members Directory
          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Directory
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Email Board
          </Button>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {boardMembersData.map((boardMember) => (
            <TableRow key={boardMember.id}>
              <TableCell className="font-medium">{boardMember.name}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  boardMember.position === 'President' ? 'bg-purple-100 text-purple-800' : 
                  boardMember.position === 'Vice President' ? 'bg-blue-100 text-blue-800' : 
                  boardMember.position === 'Treasurer' ? 'bg-green-100 text-green-800' : 
                  boardMember.position === 'Secretary' ? 'bg-amber-100 text-amber-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {boardMember.position}
                </span>
              </TableCell>
              <TableCell>{boardMember.property}</TableCell>
              <TableCell>{boardMember.unit}</TableCell>
              <TableCell>{formatDate(boardMember.startDate)}</TableCell>
              <TableCell>{boardMember.email}</TableCell>
              <TableCell>{boardMember.phone}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium">Current Term</h4>
            <p className="text-2xl font-bold mt-1">2023-2024</p>
            <p className="text-xs text-muted-foreground mt-1">Ends on 12/31/2024</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium">Board Size</h4>
            <p className="text-2xl font-bold mt-1">5 Members</p>
            <p className="text-xs text-muted-foreground mt-1">Full capacity</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium">Next Election</h4>
            <p className="text-2xl font-bold mt-1">Nov 15, 2024</p>
            <p className="text-xs text-muted-foreground mt-1">Annual meeting</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BoardMembersReport;
