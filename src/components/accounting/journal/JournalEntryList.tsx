
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pencil, Search, Filter, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

// Sample data for demonstration
const sampleJournalEntries = [
  {
    id: '1',
    date: new Date(2023, 5, 15),
    reference: 'JE-001',
    description: 'Paid office rent for June',
    debit: 1500,
    credit: 1500,
    status: 'posted',
  },
  {
    id: '2',
    date: new Date(2023, 5, 18),
    reference: 'JE-002',
    description: 'Received payment from client ABC Corp',
    debit: 3000,
    credit: 3000,
    status: 'posted',
  },
  {
    id: '3',
    date: new Date(2023, 5, 22),
    reference: 'JE-003',
    description: 'Purchased office supplies',
    debit: 450.75,
    credit: 450.75,
    status: 'draft',
  },
  {
    id: '4',
    date: new Date(2023, 5, 25),
    reference: 'JE-004',
    description: 'Paid utility bills',
    debit: 320.50,
    credit: 320.50,
    status: 'posted',
  },
  {
    id: '5',
    date: new Date(2023, 5, 28),
    reference: 'JE-005',
    description: 'Recorded monthly depreciation',
    debit: 875,
    credit: 875,
    status: 'draft',
  },
];

interface JournalEntryListProps {
  onEditEntry: (entry: any) => void;
}

const JournalEntryList: React.FC<JournalEntryListProps> = ({ onEditEntry }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredEntries = sampleJournalEntries.filter(entry => {
    const matchesSearch = 
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'posted':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="h-3 w-3 mr-1" />
            Posted
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Draft
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <X className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search journal entries..." 
              className="pl-8" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Filter size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Filter journal entries</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-2">
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="posted">Posted</option>
            <option value="draft">Draft</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No journal entries found
                </TableCell>
              </TableRow>
            ) : (
              filteredEntries.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {format(entry.date, 'MM/dd/yyyy')}
                  </TableCell>
                  <TableCell>
                    {entry.reference}
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">
                    {entry.description}
                  </TableCell>
                  <TableCell>
                    ${entry.debit.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {renderStatusBadge(entry.status)}
                  </TableCell>
                  <TableCell>
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onEditEntry(entry)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>Edit journal entry</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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

export default JournalEntryList;
