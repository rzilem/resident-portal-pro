
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Communication } from '@/types/resident';

interface CommunicationsTabProps {
  communications?: Communication[];
}

const CommunicationsTab: React.FC<CommunicationsTabProps> = ({ communications }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Communication History</CardTitle>
          <CardDescription>
            Record of all communications with this resident
          </CardDescription>
        </div>
        <Button>
          <MessageCircle className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </CardHeader>
      <CardContent>
        {communications && communications.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communications.map((comm, i) => (
                <TableRow key={i}>
                  <TableCell>{comm.date}</TableCell>
                  <TableCell>{comm.type}</TableCell>
                  <TableCell>{comm.subject}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      comm.status === 'Opened' ? 'bg-green-100 text-green-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {comm.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No communication history available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CommunicationsTab;
