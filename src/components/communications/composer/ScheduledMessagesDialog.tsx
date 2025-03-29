
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarIcon, Clock, Users, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { workflowEventService } from '@/services/calendar/workflowEventService';
import { calendarEventService } from '@/services/calendar/calendarEventService';
import { toast } from 'sonner';

interface ScheduledMessagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ScheduledMessage {
  id: string;
  subject: string;
  content: string;
  recipients: string[];
  scheduledAt: string;
  eventId?: string;
}

const ScheduledMessagesDialog: React.FC<ScheduledMessagesDialogProps> = ({ open, onOpenChange }) => {
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    if (open) {
      loadScheduledMessages();
    }
  }, [open]);
  
  const loadScheduledMessages = () => {
    setIsLoading(true);
    try {
      // Get messages from local storage
      const storedMessages = JSON.parse(localStorage.getItem('scheduledMessages') || '[]') as ScheduledMessage[];
      
      // Get calendar events for these messages
      const events = calendarEventService.getAllEvents('admin', 'admin')
        .filter(event => event.type === 'workflow' && event.workflowId);
      
      // Combine the data
      const messagesWithEvents = storedMessages.map(message => {
        const event = events.find(e => e.workflowId === message.id);
        return {
          ...message,
          eventId: event?.id
        };
      });
      
      // Only show messages that haven't been sent yet
      const pendingMessages = messagesWithEvents.filter(message => {
        const event = events.find(e => e.workflowId === message.id);
        return !event?.metadata?.executed;
      });
      
      setScheduledMessages(pendingMessages);
    } catch (error) {
      console.error('Error loading scheduled messages:', error);
      toast.error('Failed to load scheduled messages');
    } finally {
      setIsLoading(false);
    }
  };
  
  const cancelScheduledMessage = (message: ScheduledMessage) => {
    try {
      if (message.eventId) {
        // Cancel the calendar event
        workflowEventService.cancelScheduledWorkflow(message.eventId);
        
        // Remove from local storage
        const storedMessages = JSON.parse(localStorage.getItem('scheduledMessages') || '[]');
        const updatedMessages = storedMessages.filter((m: ScheduledMessage) => m.id !== message.id);
        localStorage.setItem('scheduledMessages', JSON.stringify(updatedMessages));
        
        // Update state
        setScheduledMessages(prev => prev.filter(m => m.id !== message.id));
        
        toast.success(`Scheduled message "${message.subject}" cancelled`);
      }
    } catch (error) {
      console.error('Error cancelling scheduled message:', error);
      toast.error('Failed to cancel scheduled message');
    }
  };
  
  const renderRecipients = (recipients: string[]) => {
    if (recipients.length <= 2) {
      return recipients.join(', ');
    }
    return `${recipients.slice(0, 2).join(', ')} and ${recipients.length - 2} more`;
  };

  const handleRefresh = () => {
    loadScheduledMessages();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Scheduled Messages</DialogTitle>
          <DialogDescription>
            View and manage messages scheduled for future delivery
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-2 flex justify-end">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            Refresh
          </Button>
        </div>
        
        <ScrollArea className="flex-1 h-[400px] pr-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Clock className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2">Loading scheduled messages...</span>
            </div>
          ) : scheduledMessages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No scheduled messages</p>
              <p className="text-sm mt-2">Messages you schedule will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scheduledMessages.map(message => (
                <div 
                  key={message.id} 
                  className="border p-4 rounded-md hover:border-primary transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{message.subject}</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => cancelScheduledMessage(message)}
                      title="Cancel scheduled message"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>{format(new Date(message.scheduledAt), 'PPP p')}</span>
                    </div>
                    
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{renderRecipients(message.recipients)}</span>
                    </div>
                    
                    <div className="text-muted-foreground line-clamp-2">
                      {message.content.replace(/<[^>]*>/g, ' ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduledMessagesDialog;
