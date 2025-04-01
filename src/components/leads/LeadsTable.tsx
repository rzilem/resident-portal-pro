
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, Search, MoreHorizontal, Mail, FileText, Phone, Check, X } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { LeadStatus } from "@/types/lead";
import { toast } from "sonner";

interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  status: LeadStatus;
  lastContactedAt?: string;
  createdAt: string;
}

const LeadsTable: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Mock leads data
  const leads: Lead[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      company: 'Acme Inc.',
      phone: '(555) 123-4567',
      status: 'new',
      createdAt: '2023-08-01T09:30:00Z',
      lastContactedAt: null,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@techinnovate.com',
      company: 'Tech Innovate',
      phone: '(555) 987-6543',
      status: 'contacted',
      createdAt: '2023-07-25T14:45:00Z',
      lastContactedAt: '2023-07-26T10:15:00Z',
    },
    {
      id: '3',
      name: 'Michael Davis',
      email: 'michael@startupfuture.co',
      company: 'Startup Future',
      phone: '(555) 567-8901',
      status: 'qualified',
      createdAt: '2023-07-15T11:20:00Z',
      lastContactedAt: '2023-07-28T13:30:00Z',
    },
    {
      id: '4',
      name: 'Linda Martinez',
      email: 'linda.m@globalcorp.com',
      company: 'Global Corp',
      phone: '(555) 234-5678',
      status: 'proposal',
      createdAt: '2023-07-10T16:00:00Z',
      lastContactedAt: '2023-07-30T09:45:00Z',
    },
    {
      id: '5',
      name: 'Robert Wilson',
      email: 'robert@enterprisetech.net',
      company: 'Enterprise Tech',
      phone: '(555) 345-6789',
      status: 'negotiation',
      createdAt: '2023-07-05T08:15:00Z',
      lastContactedAt: '2023-07-29T15:20:00Z',
    },
  ];
  
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      (lead.company && lead.company.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const getStatusBadge = (status: LeadStatus) => {
    const statusConfig = {
      'new': { label: 'New', class: 'bg-blue-100 text-blue-800' },
      'contacted': { label: 'Contacted', class: 'bg-yellow-100 text-yellow-800' },
      'qualified': { label: 'Qualified', class: 'bg-indigo-100 text-indigo-800' },
      'proposal': { label: 'Proposal', class: 'bg-purple-100 text-purple-800' },
      'negotiation': { label: 'Negotiation', class: 'bg-orange-100 text-orange-800' },
      'closed-won': { label: 'Closed (Won)', class: 'bg-green-100 text-green-800' },
      'closed-lost': { label: 'Closed (Lost)', class: 'bg-red-100 text-red-800' },
    };
    
    const config = statusConfig[status];
    
    return (
      <div className={`px-2 py-1 rounded-full text-xs inline-block ${config.class}`}>
        {config.label}
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="proposal">Proposal</SelectItem>
              <SelectItem value="negotiation">Negotiation</SelectItem>
              <SelectItem value="closed-won">Closed (Won)</SelectItem>
              <SelectItem value="closed-lost">Closed (Lost)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>
      
      {filteredLeads.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Contacted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.company || '-'}</TableCell>
                  <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  <TableCell>
                    {lead.lastContactedAt 
                      ? new Date(lead.lastContactedAt).toLocaleDateString() 
                      : 'Never'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => toast.success('Email sent!')}>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success('Creating new proposal')}>
                          <FileText className="h-4 w-4 mr-2" />
                          Create Proposal
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="h-4 w-4 mr-2" />
                          Log Call
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => toast.success('Lead marked as won!')}>
                          <Check className="h-4 w-4 mr-2" />
                          Mark as Won
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.success('Lead marked as lost!')}>
                          <X className="h-4 w-4 mr-2" />
                          Mark as Lost
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card className="p-8 flex flex-col items-center justify-center">
          <p className="text-muted-foreground mb-4">
            {search || statusFilter !== 'all'
              ? 'No leads match your search criteria'
              : 'No leads found'}
          </p>
          <Button>
            Add Your First Lead
          </Button>
        </Card>
      )}
    </div>
  );
};

export default LeadsTable;
