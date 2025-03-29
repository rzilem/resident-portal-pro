
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useComposer } from './ComposerContext';
import { toast } from 'sonner';
import { Loader2, Send, Calendar, MessageSquare } from 'lucide-react';
import { emailService } from '@/services/emailService';
import { communicationService } from '@/services/communicationService';
import { supabase } from '@/integrations/supabase/client';

interface ComposerActionsProps {
  onSendMessage: (message: { subject: string; content: string; recipients: string[] }) => void;
}

const ComposerActions: React.FC<ComposerActionsProps> = ({ onSendMessage }) => {
  const { 
    subject, 
    content, 
    selectedRecipients,
    scheduledSend,
    scheduledDate,
    scheduledTime,
    format: contentFormat,
    messageType,
    setIsScheduled
  } = useComposer();
  
  const [isSending, setIsSending] = useState(false);

  const validateMessage = () => {
    // For SMS, subject is optional
    if (messageType === 'email' && !subject.trim()) {
      toast.error('Please add a subject');
      return false;
    }
    
    if (!content.trim()) {
      toast.error(`Please add content to your ${messageType === 'email' ? 'email' : 'SMS message'}`);
      return false;
    }
    
    if (selectedRecipients.length === 0) {
      toast.error('Please select at least one recipient');
      return false;
    }
    
    if (scheduledSend && !scheduledDate) {
      toast.error('Please select a date for your scheduled message');
      return false;
    }
    
    if (scheduledSend && !scheduledTime) {
      toast.error('Please select a time for your scheduled message');
      return false;
    }

    // Check SMS character limits
    if (messageType === 'sms' && content.length > 480) {
      toast.error('SMS content exceeds maximum length (480 characters)');
      return false;
    }
    
    return true;
  };

  const scheduleMessage = async () => {
    if (!scheduledDate) return false;
    
    try {
      // Create a scheduled date by combining the date and time
      const timeComponents = scheduledTime.split(':');
      const hour = parseInt(timeComponents[0], 10);
      const minute = parseInt(timeComponents[1], 10);
      
      const scheduledDateTime = new Date(scheduledDate);
      scheduledDateTime.setHours(hour, minute, 0, 0);
      
      // Check if the scheduled time is in the past
      if (scheduledDateTime <= new Date()) {
        toast.error('Scheduled time cannot be in the past');
        return false;
      }
      
      // Save the message to the database as scheduled
      const messageId = await communicationService.saveMessage(
        { subject, content, recipients: selectedRecipients },
        true,
        scheduledDateTime
      );
      
      if (!messageId) {
        throw new Error('Failed to save scheduled message');
      }
      
      setIsScheduled(true);
      toast.success(
        `${messageType.toUpperCase()} scheduled for ${scheduledDateTime.toLocaleString()}`,
        {
          description: `To ${selectedRecipients.length} recipient${selectedRecipients.length > 1 ? 's' : ''}`
        }
      );
      
      return true;
    } catch (error) {
      console.error('Error scheduling message:', error);
      toast.error(`Failed to schedule ${messageType}`);
      return false;
    }
  };

  const sendImmediateMessage = async () => {
    try {
      // Check if the user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to send messages');
        return false;
      }
      
      // Save the message to the database
      const messageId = await communicationService.saveMessage(
        { subject, content, recipients: selectedRecipients },
        false
      );
      
      if (!messageId) {
        throw new Error('Failed to save message');
      }
      
      // Send the message to each recipient
      let successCount = 0;
      
      for (const recipient of selectedRecipients) {
        try {
          if (messageType === 'email') {
            // Send email
            const sent = await emailService.sendEmail({
              to: recipient,
              subject: subject,
              body: content,
              isHtml: contentFormat === 'html'
            });
            
            if (sent) successCount++;
          } else {
            // Send SMS - mock implementation using console.log
            console.log(`Sending SMS to ${recipient}:`, content);
            
            // In a real implementation, this would use an SMS service API
            // For demo purposes, we'll simulate success
            successCount++;
          }
        } catch (recipientError) {
          console.error(`Failed to send ${messageType} to ${recipient}:`, recipientError);
        }
      }
      
      // Update message status
      if (successCount > 0) {
        await communicationService.markAsSent(messageId);
      }
      
      // Show appropriate toast based on success rate
      if (successCount === selectedRecipients.length) {
        toast.success(
          `${messageType.toUpperCase()} sent successfully`, 
          { description: `Sent to ${successCount} recipient${successCount > 1 ? 's' : ''}` }
        );
        return true;
      } else if (successCount > 0) {
        toast.warning(
          `${messageType.toUpperCase()} partially sent`,
          { description: `Sent to ${successCount} of ${selectedRecipients.length} recipients` }
        );
        return false;
      } else {
        toast.error(
          `Failed to send ${messageType.toUpperCase()}`,
          { description: 'No recipients received the message' }
        );
        return false;
      }
    } catch (error) {
      console.error(`Error sending ${messageType}:`, error);
      toast.error(`Failed to send ${messageType}`);
      return false;
    }
  };

  const handleSend = async () => {
    if (!validateMessage()) return;
    
    setIsSending(true);
    
    try {
      if (scheduledSend) {
        // Schedule the message for later
        const scheduled = await scheduleMessage();
        if (scheduled) {
          // Reset the composer or navigate away
          onSendMessage({ subject, content, recipients: selectedRecipients });
        }
      } else {
        // Send the message immediately
        const sent = await sendImmediateMessage();
        if (sent) {
          onSendMessage({ subject, content, recipients: selectedRecipients });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(`Failed to send ${messageType}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex justify-end space-x-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => {
          // This would typically reset the form or navigate away
          toast.info('Message discarded');
        }}
      >
        Discard
      </Button>
      
      <Button 
        type="submit"
        onClick={handleSend}
        disabled={isSending}
        className="gap-2"
      >
        {isSending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>
              {scheduledSend ? 'Scheduling...' : 'Sending...'}
            </span>
          </>
        ) : (
          <>
            {scheduledSend ? 
              <Calendar className="h-4 w-4" /> : 
              messageType === 'email' ? 
                <Send className="h-4 w-4" /> : 
                <MessageSquare className="h-4 w-4" />
            }
            <span>
              {scheduledSend ? 'Schedule' : `Send ${messageType.toUpperCase()}`}
            </span>
          </>
        )}
      </Button>
    </div>
  );
};

export default ComposerActions;
