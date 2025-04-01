
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Mail, 
  FileText, 
  Phone, 
  Check, 
  X, 
  A,
  Edit, 
  Clock, 
  Trash2, 
  RefreshCw,
  Paperclip 
} from "lucide-react";
import { toast } from "sonner";
import { LeadData } from './types';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LeadDocuments from './LeadDocuments';
import LeadFormDialog from './LeadFormDialog';

interface LeadRowActionsProps {
  lead: LeadData;
}

const LeadRowActions: React.FC<LeadRowActionsProps> = ({ lead }) => {
  const queryClient = useQueryClient();
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [documents, setDocuments] = useState(lead.uploaded_files || []);

  const updateLeadStatus = async (status: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          status, 
          lastcontactedat: new Date().toISOString(),
          updatedat: new Date().toISOString()
        })
        .eq('id', lead.id);
        
      if (error) throw error;
      
      toast.success(`Lead marked as ${status}`);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    } catch (err) {
      console.error('Error updating lead status:', err);
      toast.error('Failed to update lead status');
    }
  };

  const logContact = async (type: 'email' | 'phone' | 'proposal') => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ 
          lastcontactedat: new Date().toISOString(),
          lastcontacttype: type,
          updatedat: new Date().toISOString()
        })
        .eq('id', lead.id);
        
      if (error) throw error;

      let message = '';
      if (type === 'email') message = 'Email sent!';
      if (type === 'phone') message = 'Phone call logged';
      if (type === 'proposal') message = 'Proposal created';
      
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    } catch (err) {
      console.error(`Error logging ${type} contact:`, err);
      toast.error(`Failed to log ${type} contact`);
    }
  };

  const deleteLead = async () => {
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete ${lead.name}?`)) {
      return;
    }

    try {
      // If there are documents, delete them first
      if (lead.uploaded_files && lead.uploaded_files.length > 0) {
        const paths = lead.uploaded_files.map(doc => doc.path);
        await supabase.storage
          .from('documents')
          .remove(paths);
      }

      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', lead.id);
        
      if (error) throw error;
      
      toast.success(`Lead ${lead.name} deleted`);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    } catch (err) {
      console.error('Error deleting lead:', err);
      toast.error('Failed to delete lead');
    }
  };

  const scheduleFollowup = () => {
    // For now just show a toast, but this would typically open a dialog
    toast.info("Follow-up scheduling coming soon!");
  };

  const handleDocumentsUpdate = (updatedDocuments: any[]) => {
    setDocuments(updatedDocuments);
    queryClient.invalidateQueries({ queryKey: ['leads'] });
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => logContact('email')}>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => logContact('proposal')}>
            <FileText className="h-4 w-4 mr-2" />
            Create Proposal
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => logContact('phone')}>
            <Phone className="h-4 w-4 mr-2" />
            Log Call
          </DropdownMenuItem>
          <DropdownMenuItem onClick={scheduleFollowup}>
            <Clock className="h-4 w-4 mr-2" />
            Schedule Follow-up
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDocumentsOpen(true)}>
            <Paperclip className="h-4 w-4 mr-2" />
            View Documents ({documents.length})
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <LeadFormDialog lead={lead} buttonText="Edit Lead" buttonVariant="ghost" />
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
          <DropdownMenuItem onClick={deleteLead} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Lead
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={documentsOpen} onOpenChange={setDocumentsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Documents for {lead.name}</DialogTitle>
            <DialogDescription>
              View, download or delete documents attached to this lead.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <LeadDocuments 
              documents={documents} 
              leadId={lead.id} 
              canDelete={true}
              onDocumentsChange={handleDocumentsUpdate}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LeadRowActions;
