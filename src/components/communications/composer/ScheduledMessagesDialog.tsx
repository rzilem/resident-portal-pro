
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CalendarIcon, Clock, Users, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { communicationService, Communication } from '@/services/communicationService';

interface ScheduledMessagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ScheduledMessagesDialog: React.FC<ScheduledMessagesDialogProps> = ({ open, onOpenChange }) => {
  const [scheduledMessages, setScheduledMessages] = useState<Communication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    if (open) {
      loadScheduledMessages();
    }
  }, [open]);
  
  const loadScheduledMessages = async () => {
    setIsLoading(true);
    try {
      const messages = await communicationService.getScheduledCommunications();
      setScheduledMessages(messages);
    } catch (error) {
      console.error('Error loading scheduled messages:', error);
      toast.error('Failed to load scheduled messages');
    } finally {
      setIsLoading(false);
    }
  };
  
  const cancelScheduledMessage = async (message: Communication) => {
    try {
      const success = await communicationService.cancelScheduledCommunication(message.id);
      
      if (success) {
        setScheduledMessages(prev => prev.filter(m => m.id !== message.id));
        toast.success(`Scheduled message "${message.subject}" cancelled`);
      }
    } catch (error) {
      console.error('Error cancelling scheduled message:', error);
      toast.error('Failed to cancel scheduled message');
    }
  };
  
  const renderRecipients = (recipients: any[]) => {
    if (recipients.length <= 2) {
      return recipients.map(r => r.recipient_email).join(', ');
    }
    return `${recipients.slice(0, 2).map(r => r.recipient_email).join(', ')} and ${recipients.length - 2} more`;
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
                    <h3 className="font-medium">{message.subject || 'SMS Message'}</h3>
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
                      <span>{format(new Date(message.scheduled_for), 'PPP p')}</span>
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
