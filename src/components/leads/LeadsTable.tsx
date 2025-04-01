
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  UserPlus, 
  MoreHorizontal, 
  Mail, 
  FileText, 
  Trash, 
  Phone
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  proposalId?: string;
  proposalName?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  createdAt: string;
  lastViewed?: string;
}

const statusColors = {
  'new': 'bg-blue-100 text-blue-800',
  'contacted': 'bg-purple-100 text-purple-800',
  'qualified': 'bg-green-100 text-green-800',
  'proposal': 'bg-yellow-100 text-yellow-800',
  'negotiation': 'bg-orange-100 text-orange-800',
  'closed-won': 'bg-emerald-100 text-emerald-800',
  'closed-lost': 'bg-red-100 text-red-800'
};

const LeadsTable: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showAddLeadDialog, setShowAddLeadDialog] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    company: '',
    status: 'new'
  });
  
  // Get leads from localStorage (in a real app, this would be from your API)
  const leadsFromStorage = JSON.parse(localStorage.getItem('leads') || '[]');
  
  // Add some demo data if no leads exist
  const leads: Lead[] = leadsFromStorage.length > 0 ? leadsFromStorage : [
    {
      id: 'lead-1',
      name: 'John Smith',
      email: 'john@example.com',
      company: 'ABC Corporation',
      status: 'new',
      createdAt: new Date().toISOString(),
      lastViewed: new Date().toISOString()
    },
    {
      id: 'lead-2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      company: 'XYZ Inc',
      status: 'contacted',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      lastViewed: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'lead-3',
      name: 'Michael Brown',
      email: 'michael@example.com',
      company: 'Acme LLC',
      status: 'qualified',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      lastViewed: new Date(Date.now() - 172800000).toISOString()
    }
  ];
  
  // Save demo data to localStorage if it didn't exist
  if (leadsFromStorage.length === 0) {
    localStorage.setItem('leads', JSON.stringify(leads));
  }
  
  // Filter leads based on search term
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(search.toLowerCase()) ||
    lead.email.toLowerCase().includes(search.toLowerCase()) ||
    lead.company.toLowerCase().includes(search.toLowerCase())
  );
  
  const handleAddLead = () => {
    if (!newLead.name || !newLead.email) {
      toast.error('Name and email are required');
      return;
    }
    
    const lead: Lead = {
      id: `lead-${Date.now()}`,
      name: newLead.name,
      email: newLead.email,
      company: newLead.company,
      status: newLead.status as Lead['status'],
      createdAt: new Date().toISOString()
    };
    
    const updatedLeads = [...leads, lead];
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
    
    setShowAddLeadDialog(false);
    setNewLead({
      name: '',
      email: '',
      company: '',
      status: 'new'
    });
    
    toast.success('Lead added successfully');
  };
  
  const handleStatusChange = (leadId: string, newStatus: Lead['status']) => {
    const updatedLeads = leads.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus } : lead
    );
    
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
    toast.success(`Lead status updated to ${newStatus}`);
  };
  
  const handleDeleteLead = (leadId: string) => {
    const updatedLeads = leads.filter(lead => lead.id !== leadId);
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
    toast.success('Lead deleted successfully');
  };
  
  const handleSendEmail = (lead: Lead) => {
    // In a real app, this would open an email composer or trigger an email workflow
    toast.success(`Email dialog would open for ${lead.name}`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Dialog open={showAddLeadDialog} onOpenChange={setShowAddLeadDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Lead</DialogTitle>
              <DialogDescription>
                Enter the details of the potential client.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={newLead.company}
                  onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                  placeholder="Company Name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newLead.status} 
                  onValueChange={(value) => setNewLead({ ...newLead, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
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
            </div>
            
            <DialogFooter>
              <Button onClick={handleAddLead}>
                Add Lead
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle>Active Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[lead.status]}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1).replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleSendEmail(lead)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/lead-details/${lead.id}`)}>
                            <Phone className="h-4 w-4 mr-2" />
                            Contact
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/leads/proposal-creator')}>
                            <FileText className="h-4 w-4 mr-2" />
                            Create Proposal
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteLead(lead.id)}>
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Lead
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No leads found. Add your first lead to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadsTable;
