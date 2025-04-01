import React, { useState, useEffect } from 'react';
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
import { PlusCircle, Search, MoreHorizontal, Mail, FileText, Phone, Check, X, Building, Users, Map } from "lucide-react";
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
import LeadColumnsSelector, { LeadColumn } from './LeadColumnsSelector';
import { useSettings } from '@/hooks/use-settings';
import { useCompanySettings } from '@/hooks/use-company-settings';

interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  status: LeadStatus;
  lastContactedAt?: string;
  createdAt: string;
  source?: string;
  association_name?: string;
  association_type?: string;
  unit_count?: number;
  city?: string;
  state?: string;
  has_pool?: boolean;
  has_gate?: boolean;
  has_onsite_management?: boolean;
}

const LeadsTable: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { preferences, updatePreference } = useSettings();
  const { settings } = useCompanySettings();
  
  const defaultColumns: LeadColumn[] = [
    { id: 'name', label: 'Name', checked: true },
    { id: 'email', label: 'Email', checked: true },
    { id: 'company', label: settings.companyName || 'Company', checked: true },
    { id: 'phone', label: 'Phone', checked: false },
    { id: 'status', label: 'Status', checked: true },
    { id: 'association_name', label: 'Association', checked: true },
    { id: 'association_type', label: 'Type', checked: false },
    { id: 'unit_count', label: 'Units', checked: false },
    { id: 'city', label: 'City', checked: false },
    { id: 'state', label: 'State', checked: false },
    { id: 'has_pool', label: 'Pool', checked: false },
    { id: 'has_gate', label: 'Gate', checked: false },
    { id: 'has_onsite_management', label: 'Onsite Mgmt', checked: false },
    { id: 'lastContacted', label: 'Last Contacted', checked: true },
    { id: 'source', label: 'Source', checked: false },
  ];
  
  const [columns, setColumns] = useState<LeadColumn[]>(defaultColumns);
  
  useEffect(() => {
    const savedColumns = preferences?.leadTableColumns as LeadColumn[] | undefined;
    if (savedColumns && savedColumns.length > 0) {
      setColumns(savedColumns);
    }
  }, [preferences]);
  
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
      source: 'Email Workflow',
      association_name: 'Riverdale HOA',
      association_type: 'HOA',
      unit_count: 75,
      city: 'Austin',
      state: 'TX',
      has_pool: true,
      has_gate: false,
      has_onsite_management: false
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
      source: 'Website',
      association_name: 'Lakeside Condos',
      association_type: 'Condo',
      unit_count: 120,
      city: 'Denver',
      state: 'CO',
      has_pool: true,
      has_gate: true,
      has_onsite_management: true
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
      source: 'Referral',
      association_name: 'Highland Community',
      association_type: 'Community',
      unit_count: 220,
      city: 'Seattle',
      state: 'WA',
      has_pool: false,
      has_gate: false,
      has_onsite_management: false
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
      source: 'Email Workflow',
      association_name: 'Oceanview Villas',
      association_type: 'HOA',
      unit_count: 85,
      city: 'Miami',
      state: 'FL',
      has_pool: true,
      has_gate: true,
      has_onsite_management: false
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
      source: 'LinkedIn',
      association_name: 'Mountain View Estates',
      association_type: 'Community',
      unit_count: 150,
      city: 'Portland',
      state: 'OR',
      has_pool: false,
      has_gate: true,
      has_onsite_management: true
    },
  ];
  
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      (lead.name?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (lead.email?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (lead.company?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (lead.association_name?.toLowerCase().includes(search.toLowerCase()) || false);
    
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

  const getBooleanBadge = (value: boolean | undefined) => {
    if (value === undefined) return '-';
    
    return value ? (
      <Badge variant="success" className="bg-green-100 text-green-800 hover:bg-green-200">Yes</Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-200">No</Badge>
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
        
        <div className="flex gap-2">
          <LeadColumnsSelector 
            columns={columns} 
            onChange={setColumns} 
          />
          
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>
      
      {filteredLeads.length > 0 ? (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.filter(col => col.checked).map(column => (
                  <TableHead key={column.id}>
                    {column.label}
                  </TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  {columns.find(c => c.id === 'name')?.checked && (
                    <TableCell className="font-medium">{lead.name}</TableCell>
                  )}
                  {columns.find(c => c.id === 'email')?.checked && (
                    <TableCell>{lead.email}</TableCell>
                  )}
                  {columns.find(c => c.id === 'company')?.checked && (
                    <TableCell>{lead.company || settings.companyName || '-'}</TableCell>
                  )}
                  {columns.find(c => c.id === 'phone')?.checked && (
                    <TableCell>{lead.phone || '-'}</TableCell>
                  )}
                  {columns.find(c => c.id === 'status')?.checked && (
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                  )}
                  {columns.find(c => c.id === 'association_name')?.checked && (
                    <TableCell>{lead.association_name || '-'}</TableCell>
                  )}
                  {columns.find(c => c.id === 'association_type')?.checked && (
                    <TableCell>{lead.association_type || '-'}</TableCell>
                  )}
                  {columns.find(c => c.id === 'unit_count')?.checked && (
                    <TableCell>{lead.unit_count || '-'}</TableCell>
                  )}
                  {columns.find(c => c.id === 'city')?.checked && (
                    <TableCell>{lead.city || '-'}</TableCell>
                  )}
                  {columns.find(c => c.id === 'state')?.checked && (
                    <TableCell>{lead.state || '-'}</TableCell>
                  )}
                  {columns.find(c => c.id === 'has_pool')?.checked && (
                    <TableCell>{getBooleanBadge(lead.has_pool)}</TableCell>
                  )}
                  {columns.find(c => c.id === 'has_gate')?.checked && (
                    <TableCell>{getBooleanBadge(lead.has_gate)}</TableCell>
                  )}
                  {columns.find(c => c.id === 'has_onsite_management')?.checked && (
                    <TableCell>{getBooleanBadge(lead.has_onsite_management)}</TableCell>
                  )}
                  {columns.find(c => c.id === 'lastContacted')?.checked && (
                    <TableCell>
                      {lead.lastContactedAt 
                        ? new Date(lead.lastContactedAt).toLocaleDateString() 
                        : 'Never'}
                    </TableCell>
                  )}
                  {columns.find(c => c.id === 'source')?.checked && (
                    <TableCell>{lead.source || '-'}</TableCell>
                  )}
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
