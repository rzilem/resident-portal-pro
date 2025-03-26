
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Association } from '@/types/association';
import { formatDate } from '@/utils/formatters';

interface AssociationMembersTabProps {
  association: Association;
}

const mockBoardMembers = [
  { id: 1, name: 'John Smith', position: 'President', email: 'john.smith@example.com', phone: '(555) 123-4567', startDate: '2022-01-15' },
  { id: 2, name: 'Sarah Johnson', position: 'Vice President', email: 'sarah.j@example.com', phone: '(555) 234-5678', startDate: '2022-01-15' },
  { id: 3, name: 'Michael Brown', position: 'Treasurer', email: 'mbrown@example.com', phone: '(555) 345-6789', startDate: '2022-02-01' },
  { id: 4, name: 'Emily Davis', position: 'Secretary', email: 'emily.d@example.com', phone: '(555) 456-7890', startDate: '2022-02-01' },
  { id: 5, name: 'Robert Wilson', position: 'Member at Large', email: 'rwilson@example.com', phone: '(555) 567-8901', startDate: '2022-03-15' },
];

const AssociationMembersTab: React.FC<AssociationMembersTabProps> = ({ association }) => {
  return (
    <div className="mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Board Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Start Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockBoardMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.position}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{formatDate(member.startDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssociationMembersTab;
