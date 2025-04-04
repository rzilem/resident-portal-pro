
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Clock, Calendar, Loader2 } from 'lucide-react';
import { useComposer } from './ComposerContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { communicationService } from '@/services/communicationService';

interface ComposerActionsProps {
  onSendMessage: (message: { subject: string; content: string; recipients: string[] }) => void;
}

const ComposerActions: React.FC<ComposerActionsProps> = ({ onSendMessage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  
  const { 
    subject, 
    content, 
    selectedRecipients,
    selectedCommunity,
    recipientType,
    format,
    messageType,
    scheduledDate,
    setScheduledDate,
    validateCanSend,
    previewContent
  } = useComposer();

  const handleSend = async () => {
    const validationResult = validateCanSend();
    if (!validationResult.valid) {
      toast.error(validationResult.error || 'Please complete all required fields');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Prepare the message data
      const messageData = {
        subject,
        content: previewContent || content,
        messageType,
        format,
        recipients: {
          type: recipientType,
          items: selectedRecipients
        },
        status: 'sent',
        scheduledFor: null
      };
      
      console.log('Sending message:', messageData);
      
      // Call the communicationService to send the message
      const result = await communicationService.sendMessage(messageData);
      
      if (!result) {
        throw new Error('Failed to send message');
      }
      
      // Call the onSendMessage function passed from parent
      if (onSendMessage) {
        onSendMessage({
          subject,
          content: previewContent || content,
          recipients: selectedRecipients
        });
      }
      
      toast.success('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchedule = async () => {
    const validationResult = validateCanSend();
    if (!validationResult.valid) {
      toast.error(validationResult.error || 'Please complete all required fields');
      return;
    }
    
    if (!scheduledDate) {
      toast.error('Please select a date and time to schedule this message');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Prepare the message data for scheduling
      const messageData = {
        subject,
        content: previewContent || content,
        messageType,
        format,
        recipients: {
          type: recipientType,
          items: selectedRecipients
        },
        status: 'scheduled',
        scheduledFor: scheduledDate
      };
      
      console.log('Scheduling message for:', scheduledDate, messageData);
      
      // Use the communication service to schedule the message
      const result = await communicationService.scheduleMessage(messageData);
      
      if (!result) {
        throw new Error('Failed to schedule message');
      }
      
      setIsScheduleDialogOpen(false);
      toast.success('Message scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling message:', error);
      toast.error('Failed to schedule message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openScheduleDialog = () => {
    const validationResult = validateCanSend();
    if (!validationResult.valid) {
      toast.error(validationResult.error || 'Please complete all required fields');
      return;
    }
    
    setIsScheduleDialogOpen(true);
  };

  return (
    <>
      <div className="flex justify-end gap-3 mt-6">
        <Button
          variant="outline"
          onClick={openScheduleDialog}
          disabled={isLoading}
        >
          <Clock className="h-4 w-4 mr-2" />
          Schedule
        </Button>
        
        <Button 
          onClick={handleSend}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Send Now
        </Button>
      </div>
      
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Message</DialogTitle>
            <DialogDescription>
              Choose when you'd like this message to be sent.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="schedule-date" className="text-sm font-medium">
                  Date and Time
                </label>
                <input
                  id="schedule-date"
                  type="datetime-local"
                  className="border rounded-md p-2"
                  value={scheduledDate ? scheduledDate.toISOString().slice(0, 16) : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setScheduledDate(new Date(e.target.value));
                    } else {
                      setScheduledDate(null);
                    }
                  }}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              disabled={!scheduledDate || isLoading} 
              onClick={handleSchedule}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Calendar className="h-4 w-4 mr-2" />
              )}
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ComposerActions;
