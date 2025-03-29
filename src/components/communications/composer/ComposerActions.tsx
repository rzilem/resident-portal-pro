
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Send, Clock } from 'lucide-react';
import { useComposer } from './ComposerContext';
import { toast } from 'sonner';
import { workflowEventService } from '@/services/calendar/workflowEventService';
import { v4 as uuid } from 'uuid';

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
  } = useComposer();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateMessage = () => {
    if (!subject.trim()) {
      toast.error('Please enter a subject');
      return false;
    }
    
    if (!content.trim()) {
      toast.error('Please enter a message');
      return false;
    }

    if (selectedRecipients.length === 0) {
      toast.error('Please select at least one recipient');
      return false;
    }

    if (scheduledSend) {
      if (!scheduledDate) {
        toast.error('Please select a date for scheduled sending');
        return false;
      }

      if (!scheduledTime) {
        toast.error('Please select a time for scheduled sending');
        return false;
      }
    }

    return true;
  };

  const handleSendMessage = async () => {
    if (!validateMessage()) return;
    
    setIsSubmitting(true);
    
    try {
      // If scheduled, create a calendar event for it
      if (scheduledSend && scheduledDate && scheduledTime) {
        const [hours, minutes] = scheduledTime.replace(/\s*(AM|PM)$/i, '')
          .split(':')
          .map(part => parseInt(part, 10));
          
        const isPM = scheduledTime.toLowerCase().includes('pm');
        
        const scheduledDateTime = new Date(scheduledDate);
        scheduledDateTime.setHours(
          isPM && hours !== 12 ? hours + 12 : (hours === 12 && !isPM ? 0 : hours),
          minutes,
          0,
          0
        );
        
        // Check if the scheduled time is in the past
        if (scheduledDateTime <= new Date()) {
          toast.error('Cannot schedule a message in the past');
          setIsSubmitting(false);
          return;
        }
        
        // Create a workflow event for the message
        const messageId = uuid();
        const messageData = {
          id: messageId,
          subject,
          content,
          recipients: selectedRecipients,
          scheduledAt: scheduledDateTime.toISOString()
        };
        
        // Store message data in localStorage for demonstration
        const scheduledMessages = JSON.parse(localStorage.getItem('scheduledMessages') || '[]');
        scheduledMessages.push(messageData);
        localStorage.setItem('scheduledMessages', JSON.stringify(scheduledMessages));
        
        // Create calendar event
        workflowEventService.createWorkflowEvent(
          messageId, // Using message ID as workflow ID
          `Scheduled: ${subject}`,
          scheduledDateTime,
          'assoc-1' // Default association ID - in a real app, would use the selected community
        );
        
        toast.success(`Message scheduled for ${scheduledDateTime.toLocaleString()}`);
      } else {
        // Send message immediately
        onSendMessage({
          subject,
          content,
          recipients: selectedRecipients,
        });
      }
    } catch (error) {
      console.error('Error scheduling/sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = () => {
    if (!subject.trim() && !content.trim()) {
      toast.error('Cannot save empty draft');
      return;
    }
    
    // Store draft in localStorage for demonstration
    const draft = {
      id: uuid(),
      subject,
      content,
      recipients: selectedRecipients,
      savedAt: new Date().toISOString()
    };
    
    const drafts = JSON.parse(localStorage.getItem('messageDrafts') || '[]');
    drafts.push(draft);
    localStorage.setItem('messageDrafts', JSON.stringify(drafts));
    
    toast.success('Draft saved successfully');
  };

  return (
    <div className="flex justify-end space-x-2">
      <Button 
        type="button" 
        variant="outline"
        onClick={handleSaveAsDraft}
      >
        <Copy className="mr-2 h-4 w-4" />
        Save as Draft
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        onClick={handleSendMessage}
      >
        {scheduledSend ? <Clock className="mr-2 h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
        {isSubmitting ? 'Sending...' : scheduledSend ? 'Schedule Message' : 'Send Message'}
      </Button>
    </div>
  );
};

export default ComposerActions;
