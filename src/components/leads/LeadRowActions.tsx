
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
  Edit, 
  Clock, 
  Trash2, 
  RefreshCw,
  Paperclip,
  AlertCircle,
  Loader2
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
  DialogFooter,
} from "@/components/ui/dialog";
import LeadDocuments from './LeadDocuments';
import LeadFormDialog from './LeadFormDialog';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { TooltipButton } from "@/components/ui/tooltip-button";

interface LeadRowActionsProps {
  lead: LeadData;
}

const LeadRowActions: React.FC<LeadRowActionsProps> = ({ lead }) => {
  const queryClient = useQueryClient();
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [documents, setDocuments] = useState(lead.uploaded_files || []);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const updateLeadStatus = async (status: string) => {
    try {
      console.log(`Updating lead ${lead.id} status to ${status}`);
      const { error } = await supabase
        .from('leads')
        .update({ 
          status, 
          lastcontactedat: new Date().toISOString(),
          updatedat: new Date().toISOString()
        })
        .eq('id', lead.id);
        
      if (error) {
        console.error('Error updating lead status:', error);
        throw error;
      }
      
      toast.success(`Lead marked as ${status}`);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    } catch (err) {
      console.error('Error updating lead status:', err);
      toast.error('Failed to update lead status');
    }
  };

  const logContact = async (type: 'email' | 'phone' | 'proposal') => {
    try {
      console.log(`Logging contact for lead ${lead.id} with type ${type}`);
      const { error } = await supabase
        .from('leads')
        .update({ 
          lastcontactedat: new Date().toISOString(),
          lastcontacttype: type,
          updatedat: new Date().toISOString()
        })
        .eq('id', lead.id);
        
      if (error) {
        console.error(`Error logging ${type} contact:`, error);
        throw error;
      }

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

  const handleDeleteConfirm = () => {
    setDeleteError(null);
    setDeleteConfirmOpen(true);
  };

  const deleteLead = async () => {
    try {
      setIsDeleting(true);
      setDeleteError(null);
      console.log('Deleting lead:', lead.id);
      
      // If there are documents, delete them first
      if (lead.uploaded_files && lead.uploaded_files.length > 0) {
        console.log('Deleting associated documents first');
        for (const doc of lead.uploaded_files) {
          if (doc.path) {
            console.log('Deleting document:', doc.path);
            const { error: storageError } = await supabase.storage
              .from('documents')
              .remove([doc.path]);
              
            if (storageError) {
              console.warn('Error removing document from storage:', storageError);
              // Continue with deletion even if some documents fail to delete
            }
          }
        }
      }
      
      // Delete the lead record
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', lead.id);
        
      if (error) {
        console.error('Database error deleting lead:', error);
        setDeleteError(error.message || 'Unknown database error');
        throw error;
      }
      
      toast.success(`Lead "${lead.name}" deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setDeleteConfirmOpen(false);
    } catch (err: any) {
      console.error('Error deleting lead:', err);
      setDeleteError(err.message || 'Failed to delete lead. Please try again.');
      toast.error('Failed to delete lead. Please try again.');
      // Don't close the dialog so user can see the error
    } finally {
      setIsDeleting(false);
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
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="More options">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
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
          <DropdownMenuItem onClick={handleDeleteConfirm} className="text-destructive">
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
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this lead?</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex items-start gap-2 text-amber-600 mb-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>
                  This will permanently delete the lead "{lead.name}" and all associated documents. 
                  This action cannot be undone.
                </span>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {deleteError && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{deleteError}</span>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                deleteLead();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Lead
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LeadRowActions;
