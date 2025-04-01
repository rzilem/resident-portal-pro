
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Mail, FileText, Phone, Check, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { LeadData } from './types';
import { supabase } from '@/lib/supabase';

interface LeadRowActionsProps {
  lead: LeadData;
}

const LeadRowActions: React.FC<LeadRowActionsProps> = ({ lead }) => {
  const updateLeadStatus = async (status: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', lead.id);
        
      if (error) throw error;
      
      toast.success(`Lead marked as ${status}`);
      // In a real app, you'd want to refresh the leads list here
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error('Error updating lead status:', err);
      toast.error('Failed to update lead status');
    }
  };
  
  return (
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
        <DropdownMenuItem onClick={() => updateLeadStatus('closed-won')}>
          <Check className="h-4 w-4 mr-2" />
          Mark as Won
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateLeadStatus('closed-lost')}>
          <X className="h-4 w-4 mr-2" />
          Mark as Lost
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Leads
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LeadRowActions;
