
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useComposer } from './ComposerContext';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { workflowEventService } from '@/services/calendar/workflowEventService';
import { CalendarEvent } from '@/types/calendar';
import { format } from 'date-fns';

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
    setIsScheduled
  } = useComposer();
  
  const [isSending, setIsSending] = useState(false);

  const validateMessage = () => {
    if (!subject.trim()) {
      toast.error('Please add a subject');
      return false;
    }
    
    if (!content.trim()) {
      toast.error('Please add content to your message');
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
        scheduledAt: scheduledDateTime.toISOString(),
      };
      
      // Get existing scheduled messages or initialize empty array
      const existingMessages = JSON.parse(localStorage.getItem('scheduledMessages') || '[]');
      existingMessages.push(scheduledMessageData);
      localStorage.setItem('scheduledMessages', JSON.stringify(existingMessages));
      
      // Create a calendar event for this scheduled message
      const calendarEvent: CalendarEvent = {
        id: uuidv4(),
        title: `Scheduled: ${subject}`,
        description: `Scheduled message to ${selectedRecipients.length} recipients`,
        start: scheduledDateTime,
        end: new Date(scheduledDateTime.getTime() + 30 * 60000), // End 30 minutes later
        allDay: false,
        type: 'workflow',
        workflowId: messageId,
        userId: 'admin', // In a real app, this would be the current user's ID
        associationId: 'admin', // In a real app, this would be the selected association ID
        metadata: {
          scheduled: true,
          recipientCount: selectedRecipients.length,
          messageFormat: contentFormat
        }
      };
      
      // Add the event to the calendar
      workflowEventService.scheduleWorkflowEvent(calendarEvent);
      
      setIsScheduled(true);
      toast.success(
        `Message scheduled for ${format(scheduledDateTime, 'PPP p')}`,
        {
          description: `To ${selectedRecipients.length} recipient${selectedRecipients.length > 1 ? 's' : ''}`
        }
      );
      
      return true;
    } catch (error) {
      console.error('Error scheduling message:', error);
      toast.error('Failed to schedule message');
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
        onSendMessage({ subject, content, recipients: selectedRecipients });
        toast.success('Message sent successfully');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
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
      >
        {isSending ? (
          <>
            <span className="mr-2">
              {scheduledSend ? 'Scheduling...' : 'Sending...'}
            </span>
          </>
        ) : (
          scheduledSend ? 'Schedule' : 'Send'
        )}
      </Button>
    </div>
  );
};

export default ComposerActions;
