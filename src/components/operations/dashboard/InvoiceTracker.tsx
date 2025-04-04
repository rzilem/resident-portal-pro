
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Search, SlidersHorizontal, FileDown } from 'lucide-react';

// Mock data for invoices
const invoicesData = [
  { id: 'INV-001', vendor: 'Landscaping Services Inc.', amount: 2500.00, dueDate: '2023-04-15', status: 'pending', association: 'Lakeside HOA', office: 'Austin' },
  { id: 'INV-002', vendor: 'Pool Maintenance Co.', amount: 1200.00, dueDate: '2023-04-18', status: 'approved', association: 'Westview Condos', office: 'Austin' },
  { id: 'INV-003', vendor: 'Security Systems Ltd.', amount: 3750.00, dueDate: '2023-04-20', status: 'pending', association: 'Oakridge Community', office: 'Round Rock' },
  { id: 'INV-004', vendor: 'Cleaning Services Pro', amount: 950.00, dueDate: '2023-04-22', status: 'paid', association: 'Cedar Heights', office: 'Austin' },
  { id: 'INV-005', vendor: 'Electrical Repairs LLC', amount: 1800.00, dueDate: '2023-04-25', status: 'overdue', association: 'Meadowbrook HOA', office: 'Round Rock' },
  { id: 'INV-006', vendor: 'Painting Experts Co.', amount: 4200.00, dueDate: '2023-04-28', status: 'pending', association: 'Highland Terrace', office: 'Austin' },
  { id: 'INV-007', vendor: 'Waste Management Inc.', amount: 1100.00, dueDate: '2023-04-30', status: 'approved', association: 'Sunset Villas', office: 'Round Rock' },
];

const InvoiceTracker: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [officeFilter, setOfficeFilter] = useState('all');
  
  // Filter invoices based on search and filters
  const filteredInvoices = invoicesData.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.association.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesOffice = officeFilter === 'all' || invoice.office === officeFilter;
    
    return matchesSearch && matchesStatus && matchesOffice;
  });
  
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'outline' | 'secondary' | 'destructive', label: string }> = {
      'pending': { variant: 'outline', label: 'Pending' },
      'approved': { variant: 'secondary', label: 'Approved' },
      'paid': { variant: 'default', label: 'Paid' },
      'overdue': { variant: 'destructive', label: 'Overdue' },
    };
    
    const config = statusConfig[status] || { variant: 'outline', label: status };
    
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={officeFilter} onValueChange={setOfficeFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Office" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Offices</SelectItem>
              <SelectItem value="Austin">Austin</SelectItem>
              <SelectItem value="Round Rock">Round Rock</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" size="icon">
          <FileDown className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Association</TableHead>
              <TableHead>Office</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id} className="cursor-pointer hover:bg-accent transition-colors">
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.vendor}</TableCell>
                <TableCell>${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>{invoice.association}</TableCell>
                <TableCell>{invoice.office}</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InvoiceTracker;
