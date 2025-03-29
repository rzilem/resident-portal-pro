
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageTemplate, CompositionMessage } from '@/pages/communications/types';

export interface Communication {
  id: string;
  subject: string;
  content: string;
  message_type: 'email' | 'sms';
  format: 'plain' | 'html';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  scheduled_for?: string;
  created_at: string;
  updated_at: string;
  recipients: {
    id: string;
    recipient_email: string;
    recipient_type: string;
    status: string;
  }[];
}

export const communicationService = {
  // Save a new communication (draft or scheduled)
  saveMessage: async (
    message: CompositionMessage, 
    isScheduled: boolean = false, 
    scheduledDate?: Date
  ): Promise<string | null> => {
    try {
      const { subject, content, recipients } = message;
      
      // Determine if this is an email or SMS based on subject existence
      const messageType = subject ? 'email' : 'sms';
      
      // Create new communication record
      const { data: communication, error } = await supabase
        .from('communications')
        .insert({
          id: uuidv4(),
          subject,
          content,
          message_type: messageType as 'email' | 'sms',
          format: content.includes('<') ? 'html' : 'plain',
          status: isScheduled ? 'scheduled' : 'draft',
          scheduled_for: scheduledDate ? scheduledDate.toISOString() : null,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Error saving communication:', error);
        throw error;
      }
      
      // Add recipients
      if (recipients.length > 0) {
        const recipientRecords = recipients.map(email => ({
          id: uuidv4(),
          communication_id: communication.id,
          recipient_email: email,
          recipient_type: 'to',
          status: 'pending'
        }));
        
        const { error: recipientsError } = await supabase
          .from('communication_recipients')
          .insert(recipientRecords);
        
        if (recipientsError) {
          console.error('Error adding recipients:', recipientsError);
          throw recipientsError;
        }
      }
      
      return communication.id;
    } catch (error) {
      console.error('Error in saveMessage:', error);
      toast.error('Failed to save message', {
        description: error.message || 'An unknown error occurred'
      });
      return null;
    }
  },
  
  // Get all communications (drafts, scheduled, sent)
  getCommunications: async (): Promise<Communication[]> => {
    try {
      const { data: communications, error } = await supabase
        .from('communications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // For each communication, get its recipients
      const communicationsWithRecipients = await Promise.all(
        communications.map(async (comm) => {
          const { data: recipients, error: recipientsError } = await supabase
            .from('communication_recipients')
            .select('*')
            .eq('communication_id', comm.id);
          
          if (recipientsError) throw recipientsError;
          
          return {
            ...comm,
            // Cast message_type to ensure it's 'email' or 'sms'
            message_type: comm.message_type as 'email' | 'sms',
            recipients: recipients || []
          } as Communication;
        })
      );
      
      return communicationsWithRecipients;
    } catch (error) {
      console.error('Error fetching communications:', error);
      toast.error('Failed to load messages');
      return [];
    }
  },
  
  // Get scheduled communications
  getScheduledCommunications: async (): Promise<Communication[]> => {
    try {
      const { data, error } = await supabase
        .from('communications')
        .select('*')
        .eq('status', 'scheduled')
        .order('scheduled_for', { ascending: true });
      
      if (error) throw error;
      
      // For each communication, get its recipients
      const communicationsWithRecipients = await Promise.all(
        data.map(async (comm) => {
          const { data: recipients, error: recipientsError } = await supabase
            .from('communication_recipients')
            .select('*')
            .eq('communication_id', comm.id);
          
          if (recipientsError) throw recipientsError;
          
          return {
            ...comm,
            // Cast message_type to ensure it's 'email' or 'sms'
            message_type: comm.message_type as 'email' | 'sms',
            recipients: recipients || []
          } as Communication;
        })
      );
      
      return communicationsWithRecipients;
    } catch (error) {
      console.error('Error fetching scheduled communications:', error);
      toast.error('Failed to load scheduled messages');
      return [];
    }
  },
  
  // Cancel a scheduled communication
  cancelScheduledCommunication: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('communications')
        .update({ status: 'draft', scheduled_for: null })
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error canceling scheduled communication:', error);
      toast.error('Failed to cancel scheduled message');
      return false;
    }
  },
  
  // Mark a communication as sent
  markAsSent: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('communications')
        .update({ 
          status: 'sent',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update recipients
      const { error: recipientsError } = await supabase
        .from('communication_recipients')
        .update({ 
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('communication_id', id);
      
      if (recipientsError) throw recipientsError;
      
      return true;
    } catch (error) {
      console.error('Error marking communication as sent:', error);
      toast.error('Failed to update message status');
      return false;
    }
  },
  
  // Save a new template
  saveTemplate: async (template: MessageTemplate): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('communication_templates')
        .insert({
          id: uuidv4(),
          name: template.name,
          description: template.description,
          subject: template.subject,
          content: template.content,
          category: template.category,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select('id')
        .single();
      
      if (error) throw error;
      
      return data.id;
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
      return null;
    }
  },
  
  // Get all templates
  getTemplates: async (): Promise<MessageTemplate[]> => {
    try {
      const { data, error } = await supabase
        .from('communication_templates')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      return data.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description || '',
        subject: template.subject || '',
        content: template.content,
        category: template.category || 'General',
        createdAt: template.created_at,
        updatedAt: template.updated_at
      }));
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
      return [];
    }
  },
  
  // Update a template
  updateTemplate: async (template: MessageTemplate): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('communication_templates')
        .update({
          name: template.name,
          description: template.description,
          subject: template.subject,
          content: template.content,
          category: template.category,
          updated_at: new Date().toISOString()
        })
        .eq('id', template.id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template');
      return false;
    }
  },
  
  // Delete a template
  deleteTemplate: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('communication_templates')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
      return false;
    }
  }
};
