
import { communicationService, Communication } from './communicationService';
import { emailService } from './emailService';
import { toast } from 'sonner';

// Interval handle for the checker
let checkInterval: number | null = null;

// Check for messages that need to be sent every minute
const SCHEDULED_MESSAGE_CHECK_INTERVAL = 60 * 1000; 

// Checks and executes any messages that are scheduled to be sent now or in the past
const checkAndExecuteDueMessages = async () => {
  try {
    // Get all scheduled messages
    const scheduledMessages = await communicationService.getScheduledCommunications();
    
    // Current time
    const now = new Date();
    
    // Find messages due to be sent
    const dueMessages = scheduledMessages.filter(msg => {
      if (!msg.scheduled_for) return false;
      
      const scheduledTime = new Date(msg.scheduled_for);
      return scheduledTime <= now;
    });
    
    console.log(`Found ${dueMessages.length} scheduled messages due for sending`);
    
    // Send each due message
    for (const message of dueMessages) {
      await sendScheduledMessage(message);
    }
  } catch (error) {
    console.error('Error checking scheduled messages:', error);
  }
};

// Sends a scheduled message
const sendScheduledMessage = async (message: Communication): Promise<boolean> => {
  try {
    console.log(`Sending scheduled message: ${message.id}`);
    
    // Extract recipients
    const recipients = message.recipients.map(r => r.recipient_email);
    
    if (recipients.length === 0) {
      console.warn('No recipients for message', message.id);
      return false;
    }
    
    // Send depending on message type
    let success = false;
    
    if (message.message_type === 'email') {
      // Send via email service
      success = await emailService.sendEmail({
        to: recipients.join(','),
        subject: message.subject,
        body: message.content,
        isHtml: message.format === 'html'
      });
    } else if (message.message_type === 'sms') {
      // For SMS, we'd have a different service here
      // This is just a placeholder
      console.log('SMS sending not yet implemented');
      success = true;
    }
    
    // If sent successfully, update the status
    if (success) {
      await communicationService.markAsSent(message.id);
      
      toast.success('Scheduled message sent', {
        description: `Message "${message.subject || 'SMS message'}" has been sent to ${recipients.length} recipient(s).`
      });
    }
    
    return success;
  } catch (error) {
    console.error('Error sending scheduled message:', error);
    return false;
  }
};

// Start checking for scheduled messages periodically
const startScheduledMessageChecker = () => {
  if (checkInterval) {
    clearInterval(checkInterval);
  }
  
  // Run once immediately
  checkAndExecuteDueMessages();
  
  // Then set up interval
  checkInterval = window.setInterval(
    checkAndExecuteDueMessages,
    SCHEDULED_MESSAGE_CHECK_INTERVAL
  );
  
  console.log('Started scheduled message checker');
  
  return () => {
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
  };
};

// Stop checking for scheduled messages
const stopScheduledMessageChecker = () => {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
    console.log('Stopped scheduled message checker');
  }
};

export const scheduledMessageService = {
  checkAndExecuteDueMessages,
  sendScheduledMessage
};

export {
  startScheduledMessageChecker,
  stopScheduledMessageChecker
};
