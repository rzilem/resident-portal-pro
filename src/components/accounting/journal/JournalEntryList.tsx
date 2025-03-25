
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JournalEntry } from '@/types/accounting';

interface JournalEntryListProps {
  onEditEntry: (entry: JournalEntry) => void;
}

const JournalEntryList: React.FC<JournalEntryListProps> = ({ onEditEntry }) => {
  // Mock data for demonstration
  const [entries] = useState<JournalEntry[]>([
    {
      id: 'JE-001',
      date: '2023-06-15',
      reference: 'JE-2023-001',
      description: 'Monthly rent accrual',
      status: 'posted',
      lines: [
        {
          id: 'JEL-001',
          accountId: '1',
          accountName: 'Accounts Receivable',
          debit: 5000,
          credit: 0
        },
        {
          id: 'JEL-002',
          accountId: '3',
          accountName: 'Rental Income',
          debit: 0,
          credit: 5000
        }
      ],
      createdAt: '2023-06-15T10:30:00Z',
      updatedAt: '2023-06-15T10:30:00Z'
    },
    {
      id: 'JE-002',
      date: '2023-06-20',
      reference: 'JE-2023-002',
      description: 'Office supplies purchase',
      status: 'draft',
      lines: [
        {
          id: 'JEL-003',
          accountId: '4',
          accountName: 'Office Supplies Expense',
          debit: 250,
          credit: 0
        },
        {
          id: 'JEL-004',
          accountId: '1',
          accountName: 'Cash',
          debit: 0,
          credit: 250
        }
      ],
      createdAt: '2023-06-20T14:15:00Z',
      updatedAt: '2023-06-20T14:15:00Z'
    }
  ]);

  const getStatusBadge = (status: 'draft' | 'posted' | 'void') => {
    switch(status) {
      case 'posted':
        return <Badge className="bg-green-500">Posted</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-500">Draft</Badge>;
      case 'void':
        return <Badge variant="outline">Void</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateTotal = (entry: JournalEntry) => {
    return entry.lines.reduce((sum, line) => sum + line.debit, 0);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search journal entries..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Calendar size={16} />
          </Button>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter size={16} />
          </Button>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="posted">Posted</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="void">Void</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map(entry => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.reference}</TableCell>
                <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell className="text-right">{formatCurrency(calculateTotal(entry))}</TableCell>
                <TableCell>{getStatusBadge(entry.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => onEditEntry(entry)}>View/Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default JournalEntryList;
