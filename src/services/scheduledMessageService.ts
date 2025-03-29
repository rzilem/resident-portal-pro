
import { emailService } from './emailService';
import { calendarEventService } from './calendar/calendarEventService';
import { toast } from 'sonner';

export const scheduledMessageService = {
  /**
   * Execute a scheduled message from a calendar event
   */
  executeScheduledMessage: async (eventId: string) => {
    try {
      // Get the event
      const event = calendarEventService.getEventById(eventId);
      
      if (!event.workflowId) {
        throw new Error('No message ID associated with this event');
      }
      
      // Retrieve the scheduled message from storage
      // In a real app, this would come from a database
      const scheduledMessages = JSON.parse(localStorage.getItem('scheduledMessages') || '[]');
      const messageData = scheduledMessages.find((msg: any) => msg.id === event.workflowId);
      
      if (!messageData) {
        throw new Error('Scheduled message data not found');
      }
      
      // Send the message to each recipient
      for (const recipient of messageData.recipients) {
        await emailService.sendEmail({
          to: recipient,
          subject: messageData.subject,
          body: messageData.content,
          isHtml: messageData.content.includes('<') && messageData.content.includes('>')
        });
      }
      
      // Update event to mark it as executed
      calendarEventService.updateEvent(eventId, {
        description: `${event.description} (Sent at ${new Date().toLocaleString()})`,
        metadata: { 
          ...event.metadata,
          executed: true,
          executedAt: new Date().toISOString(),
          recipientCount: messageData.recipients.length
        }
      });
      
      // Remove from scheduled messages
      const updatedMessages = scheduledMessages.filter((msg: any) => msg.id !== event.workflowId);
      localStorage.setItem('scheduledMessages', JSON.stringify(updatedMessages));
      
      toast.success(`Scheduled message "${messageData.subject}" sent to ${messageData.recipients.length} recipients`);
      
      return true;
    } catch (error) {
      console.error('Error executing scheduled message:', error);
      toast.error(`Failed to send scheduled message: ${error.message}`);
      return false;
    }
  },
  
  /**
   * Check for any scheduled messages that are due and execute them
   * In a real app, this would be done by a cron job or scheduler
   */
  checkAndExecuteDueMessages: () => {
    try {
      const now = new Date();
      
      // Get all scheduled workflow events
      const scheduledEvents = calendarEventService.getAllEvents('admin', 'admin')
        .filter(event => 
          event.type === 'workflow' && 
          event.workflowId &&
          event.start <= now &&
          (!event.metadata?.executed)
        );
      
      if (scheduledEvents.length === 0) {
        return { executed: 0, success: true };
      }
      
      // Execute each due message
      let executedCount = 0;
      for (const event of scheduledEvents) {
        scheduledMessageService.executeScheduledMessage(event.id);
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
  }, 60000);
  
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
