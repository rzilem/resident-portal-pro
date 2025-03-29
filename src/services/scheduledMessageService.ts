
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { emailService } from './emailService';

interface ScheduledMessage {
  id: string;
  subject: string;
  content: string;
  recipients: string[];
  messageType: 'email' | 'sms';
  scheduledAt: string;
}

export const scheduledMessageService = {
  /**
   * Execute a scheduled message
   */
  executeScheduledMessage: async (messageId: string): Promise<boolean> => {
    try {
      // Retrieve the scheduled message from Supabase
      const { data: messageData, error: messageError } = await supabase
        .from('communications')
        .select('*')
        .eq('id', messageId)
        .single();
      
      if (messageError) throw messageError;
      
      // Get recipients
      const { data: recipients, error: recipientsError } = await supabase
        .from('communication_recipients')
        .select('*')
        .eq('communication_id', messageId);
      
      if (recipientsError) throw recipientsError;
      
      // Send the message to each recipient
      for (const recipient of recipients) {
        if (messageData.message_type === 'email') {
          await emailService.sendEmail({
            to: recipient.recipient_email,
            subject: messageData.subject,
            body: messageData.content,
            isHtml: messageData.format === 'html'
          });
        } else {
          // Handle SMS sending - using console.log for now
          console.log(`Sending SMS to ${recipient.recipient_email}:`, messageData.content);
        }
        
        // Update recipient status
        await supabase
          .from('communication_recipients')
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString() 
          })
          .eq('id', recipient.id);
      }
      
      // Update message status
      await supabase
        .from('communications')
        .update({ 
          status: 'sent',
          updated_at: new Date().toISOString() 
        })
        .eq('id', messageId);
      
      toast.success(`Scheduled message sent to ${recipients.length} recipients`);
      
      return true;
    } catch (error) {
      console.error('Error executing scheduled message:', error);
      toast.error(`Failed to send scheduled message: ${error.message}`);
      return false;
    }
  },
  
  /**
   * Check for any scheduled messages that are due and execute them
   * This will be called by a client-side timer for demonstration purposes
   * In production, this would be done by a server-side cron job
   */
  checkAndExecuteDueMessages: async (): Promise<{ executed: number, success: boolean, error?: any }> => {
    try {
      const now = new Date();
      
      // Get all scheduled messages that are due
      const { data: dueMessages, error } = await supabase
        .from('communications')
        .select('*')
        .eq('status', 'scheduled')
        .lte('scheduled_for', now.toISOString());
      
      if (error) throw error;
      
      if (!dueMessages || dueMessages.length === 0) {
        return { executed: 0, success: true };
      }
      
      // Execute each due message
      let executedCount = 0;
      for (const message of dueMessages) {
        await this.executeScheduledMessage(message.id);
        executedCount++;
      }
      
      return { executed: executedCount, success: true };
    } catch (error) {
      console.error('Error checking for due messages:', error);
      return { executed: 0, success: false, error };
    }
  }
};

// Set up an interval to check for due messages every minute
// In a real app, this would be done server-side
let messageCheckInterval: number | null = null;

export const startScheduledMessageChecker = () => {
  if (messageCheckInterval) {
    return false;
  }
  
  messageCheckInterval = window.setInterval(() => {
    scheduledMessageService.checkAndExecuteDueMessages();
  }, 60000); // Check every minute
  
  return true;
};

export const stopScheduledMessageChecker = () => {
  if (messageCheckInterval) {
    window.clearInterval(messageCheckInterval);
    messageCheckInterval = null;
    return true;
  }
  
  return false;
};
