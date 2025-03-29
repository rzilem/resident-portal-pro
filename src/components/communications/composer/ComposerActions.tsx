
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useComposer } from './ComposerContext';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { workflowEventService } from '@/services/calendar/workflowEventService';
import { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';
import { Loader2, Send, Calendar, MessageSquare } from 'lucide-react';
import { emailService } from '@/services/emailService';

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
      
      // Generate a unique ID for this scheduled message
      const messageId = uuidv4();
      
      // Store the message details in local storage
      const scheduledMessageData = {
        id: messageId,
        subject,
        content,
        recipients: selectedRecipients,
        messageType,
        scheduledAt: scheduledDateTime.toISOString(),
      };
      
      // Get existing scheduled messages or initialize empty array
      const existingMessages = JSON.parse(localStorage.getItem('scheduledMessages') || '[]');
      existingMessages.push(scheduledMessageData);
      localStorage.setItem('scheduledMessages', JSON.stringify(existingMessages));
      
      // Create a calendar event for this scheduled message
      const calendarEvent: Partial<CalendarEvent> = {
        id: uuidv4(),
        title: `Scheduled: ${messageType === 'email' ? subject : 'SMS Message'}`,
        description: `Scheduled ${messageType} to ${selectedRecipients.length} recipients`,
        start: scheduledDateTime,
        end: new Date(scheduledDateTime.getTime() + 30 * 60000), // End 30 minutes later
        allDay: false,
        type: 'workflow',
        workflowId: messageId,
        accessLevel: 'admin', // Using accessLevel property instead of userId
        associationId: 'default', // Use a default association ID
        metadata: {
          scheduled: true,
          recipientCount: selectedRecipients.length,
          messageFormat: contentFormat,
          messageType: messageType
        }
      };
      
      // Add the event to the calendar
      await workflowEventService.createWorkflowEvent(
        messageId, 
        `Scheduled: ${messageType === 'email' ? subject : 'SMS Message'}`, 
        scheduledDateTime,
        'default' // Use a default association ID
      );
      
      setIsScheduled(true);
      toast.success(
        `${messageType.toUpperCase()} scheduled for ${format(scheduledDateTime, 'PPP p')}`,
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
      // Create a timestamp for the sent message
      const sentTimestamp = new Date().toISOString();
      
      // Attempt to send the message to each recipient
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
      
      // Store the sent message in history
      const sentMessageData = {
        id: uuidv4(),
        subject: messageType === 'email' ? subject : 'SMS Message',
        content,
        recipients: selectedRecipients,
        sentAt: sentTimestamp,
        status: successCount === selectedRecipients.length ? 'sent' : 'partial',
        successCount,
        totalCount: selectedRecipients.length,
        messageType
      };
      
      // Get existing sent messages or initialize empty array
      const sentMessages = JSON.parse(localStorage.getItem('sentMessages') || '[]');
      sentMessages.push(sentMessageData);
      localStorage.setItem('sentMessages', JSON.stringify(sentMessages));
      
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
