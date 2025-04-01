
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { PlusCircle, Search, RefreshCw } from "lucide-react";
import { LeadColumn } from './LeadColumnsSelector';
import LeadColumnsSelector from './LeadColumnsSelector';
import { LeadTableFilters } from './types';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface LeadTableToolbarProps {
  filters: LeadTableFilters;
  onFilterChange: (filters: Partial<LeadTableFilters>) => void;
  columns: LeadColumn[];
  onColumnsChange: (columns: LeadColumn[]) => void;
  onRefresh?: () => void;
}

const LeadTableToolbar: React.FC<LeadTableToolbarProps> = ({
  filters,
  onFilterChange,
  columns,
  onColumnsChange,
  onRefresh
}) => {
  const [addLeadOpen, setAddLeadOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      association_name: '',
      status: 'new'
    }
  });

  const handleAddLead = async (data: any) => {
    try {
      const { error } = await supabase
        .from('leads')
        .insert([{
          ...data,
          createdat: new Date().toISOString(),
        }]);
      
      if (error) throw error;
      
      toast.success('Lead added successfully');
      setAddLeadOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    } catch (err) {
      console.error('Error adding lead:', err);
      toast.error('Failed to add lead');
    }
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
      toast.success('Refreshing leads...');
    } else {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Refreshing leads...');
    }
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              className="pl-8"
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
            />
          </div>
          
          <Select 
            value={filters.statusFilter} 
            onValueChange={(value) => onFilterChange({ statusFilter: value })}
          >
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
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <LeadColumnsSelector 
            columns={columns} 
            onChange={onColumnsChange} 
          />
          
          <Button onClick={() => setAddLeadOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      <Dialog open={addLeadOpen} onOpenChange={setAddLeadOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>
              Add a new lead to your pipeline. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(handleAddLead)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input 
                  id="name" 
                  {...register('name', { required: true })} 
                  placeholder="John Doe"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  {...register('email', { required: true })} 
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  {...register('phone')} 
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  {...register('company')} 
                  placeholder="Company Name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="association_name">Association Name</Label>
                <Input 
                  id="association_name" 
                  {...register('association_name')} 
                  placeholder="Association Name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue="new" onValueChange={(val) => register('status').onChange({ target: { value: val } })}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setAddLeadOpen(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Lead'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadTableToolbar;
