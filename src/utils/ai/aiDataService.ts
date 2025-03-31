
import { toast } from 'sonner';
import { aiActionService } from './aiActionService';
import { AIContext, AIMessage } from '@/types/ai';

/**
 * Service to handle AI data operations, including generating responses and managing context
 */
export const aiDataService = {
  
  /**
   * Generate a response from the AI based on user input and context
   * @param userMessage User's message to respond to
   * @param associationId Optional ID of the current association for context
   * @returns Generated AI response
   */
  async generateResponse(userMessage: string, associationId?: string): Promise<string> {
    console.log('Generating AI response for:', userMessage, { associationId });
    
    // Check if this is potentially an action request
    const actionRequest = this.detectActionRequest(userMessage);
    
    // If it's an action request, try to perform the action
    if (actionRequest.isActionRequest) {
      try {
        // Extract action parameters from the user message
        const params = this.extractActionParameters(userMessage, actionRequest.actionType);
        
        // Perform the action
        const actionResult = await aiActionService.processAction(actionRequest.actionType, params);
        
        if (actionResult.success) {
          return `✅ ${actionResult.message}`;
        } else {
          return `❌ ${actionResult.message}`;
        }
      } catch (error) {
        console.error('Error processing action in AI:', error);
        return `❌ Sorry, I couldn't perform that action: ${error.message}`;
      }
    }
    
    // For non-action requests, generate a normal response
    // In a real implementation, this would call an LLM API
    // For now, we'll generate a simple response based on the message
    
    try {
      const response = this.generateSimpleResponse(userMessage, associationId);
      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return 'I apologize, but I encountered an error processing your request. Please try again.';
    }
  },
  
  /**
   * Detect if a user message is requesting an action
   * @param message The user's message
   * @returns Object indicating if it's an action request and what type
   */
  detectActionRequest(message: string): { 
    isActionRequest: boolean; 
    actionType?: string;
    confidence?: number;
  } {
    const lowerMessage = message.toLowerCase();
    
    // Simple pattern matching to detect action requests
    // In a real implementation, this would use NLP or an LLM to classify the request
    
    // Check for workflow-related keywords
    if (
      (lowerMessage.includes('start') || lowerMessage.includes('run') || lowerMessage.includes('execute')) && 
      lowerMessage.includes('workflow')
    ) {
      return { 
        isActionRequest: true, 
        actionType: 'start_workflow',
        confidence: 0.9
      };
    }
    
    // Check for email-related keywords
    if (
      (lowerMessage.includes('send') || lowerMessage.includes('write')) && 
      (lowerMessage.includes('email') || lowerMessage.includes('message') || 
       lowerMessage.includes('communication') || lowerMessage.includes('notification'))
    ) {
      return { 
        isActionRequest: true, 
        actionType: 'send_message',
        confidence: 0.8
      };
    }
    
    // Check for alert-related keywords
    if (
      (lowerMessage.includes('create') || lowerMessage.includes('make') || lowerMessage.includes('add')) && 
      (lowerMessage.includes('alert') || lowerMessage.includes('warning') || lowerMessage.includes('notification'))
    ) {
      return { 
        isActionRequest: true, 
        actionType: 'create_alert',
        confidence: 0.7
      };
    }
    
    // Check for calendar/event-related keywords
    if (
      (lowerMessage.includes('schedule') || lowerMessage.includes('create') || lowerMessage.includes('add')) && 
      (lowerMessage.includes('event') || lowerMessage.includes('meeting') || 
       lowerMessage.includes('appointment') || lowerMessage.includes('calendar'))
    ) {
      return { 
        isActionRequest: true, 
        actionType: 'schedule_event',
        confidence: 0.8
      };
    }
    
    // Not an action request
    return { 
      isActionRequest: false,
      confidence: 0.5
    };
  },
  
  /**
   * Extract relevant parameters for an action from the user message
   */
  extractActionParameters(message: string, actionType: string): Record<string, any> {
    // In a real implementation, this would use NLP or an LLM to extract structured parameters
    // For this demo, we'll use simple pattern matching and defaults
    
    const lowerMessage = message.toLowerCase();
    
    switch(actionType) {
      case 'start_workflow':
        return this.extractWorkflowParameters(message);
        
      case 'send_message':
        return this.extractCommunicationParameters(message);
        
      case 'create_alert':
        return this.extractAlertParameters(message);
        
      case 'schedule_event':
        return this.extractEventParameters(message);
        
      default:
        return {};
    }
  },
  
  /**
   * Extract workflow parameters from a message
   */
  extractWorkflowParameters(message: string): Record<string, any> {
    const lowerMessage = message.toLowerCase();
    let templateId = '';
    
    // Try to determine what type of workflow based on keywords
    if (lowerMessage.includes('violation') || lowerMessage.includes('compliance')) {
      templateId = 'violation-workflow';
    } else if (lowerMessage.includes('maintenance') || lowerMessage.includes('repair')) {
      templateId = 'maintenance-workflow';
    } else if (lowerMessage.includes('onboarding') || lowerMessage.includes('new resident')) {
      templateId = 'onboarding-workflow';
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('invoice')) {
      templateId = 'payment-workflow';
    } else {
      templateId = 'general-workflow';
    }
    
    return {
      templateId,
      parameters: {
        initiatedBy: 'ai-assistant',
        initiatedAt: new Date().toISOString()
      }
    };
  },
  
  /**
   * Extract communication parameters from a message
   */
  extractCommunicationParameters(message: string): Record<string, any> {
    const lowerMessage = message.toLowerCase();
    let recipients = [];
    let subject = '';
    let content = '';
    let type = 'email';
    
    // Determine communication type
    if (lowerMessage.includes('sms') || lowerMessage.includes('text message')) {
      type = 'sms';
    }
    
    // Try to extract recipients
    if (lowerMessage.includes('to residents')) {
      recipients = ['all-residents@example.com'];
    } else if (lowerMessage.includes('to board')) {
      recipients = ['board-members@example.com'];
    } else if (lowerMessage.includes('to everyone') || lowerMessage.includes('to all')) {
      recipients = ['all-members@example.com'];
    } else {
      // Default recipients if we can't extract specifics
      recipients = ['community-members@example.com'];
    }
    
    // Extract subject and content - in a real implementation this would be more sophisticated
    // using NLP to extract the actual message content
    
    // Simple extraction of the subject by looking for "about" or similar phrases
    const aboutMatch = message.match(/(?:about|regarding|subject:)\s+(.*?)(?:\.|\n|$)/i);
    if (aboutMatch && aboutMatch[1]) {
      subject = aboutMatch[1].trim();
    } else {
      // Use first ~5 words as subject
      const words = message.split(' ');
      subject = words.slice(0, Math.min(5, words.length)).join(' ') + '...';
    }
    
    // Use the original message as content, removing action keywords
    content = message
      .replace(/send (an |a )?(email|message|notification)/i, '')
      .replace(/to (residents|board|everyone|all)/i, '')
      .replace(/about|regarding|subject:/i, '')
      .trim();
    
    if (content.length < 10) {
      content = `This is an automated message regarding ${subject}`;
    }
    
    return {
      type,
      recipients,
      subject,
      content
    };
  },
  
  /**
   * Extract alert parameters from a message
   */
  extractAlertParameters(message: string): Record<string, any> {
    const lowerMessage = message.toLowerCase();
    let title = '';
    let description = '';
    let category = 'general';
    let severity = 'medium';
    
    // Try to determine category based on keywords
    if (lowerMessage.includes('maintenance') || lowerMessage.includes('repair') || lowerMessage.includes('broken')) {
      category = 'maintenance';
    } else if (lowerMessage.includes('security') || lowerMessage.includes('safety')) {
      category = 'security';
      severity = 'high';
    } else if (lowerMessage.includes('event') || lowerMessage.includes('community')) {
      category = 'community';
      severity = 'low';
    } else if (lowerMessage.includes('urgent') || lowerMessage.includes('emergency')) {
      severity = 'critical';
    }
    
    // Extract title - use the specific item or issue mentioned
    const brokenMatch = message.match(/broken\s+(\w+)/i);
    const alertForMatch = message.match(/alert\s+for\s+(.+?)(?:\.|\n|$)/i);
    const aboutMatch = message.match(/about\s+(.+?)(?:\.|\n|$)/i);
    
    if (brokenMatch) {
      title = `Broken ${brokenMatch[1]}`;
      
      // Extract location information
      const locationMatch = message.match(/in\s+the\s+(.+?)(?:\.|\n|area|$)/i);
      if (locationMatch) {
        title += ` in the ${locationMatch[1]} area`;
      }
    } else if (alertForMatch) {
      title = alertForMatch[1].trim();
    } else if (aboutMatch) {
      title = aboutMatch[1].trim();
    } else {
      // Just use first X characters
      title = message.substring(0, Math.min(60, message.length));
    }
    
    // Use remainder as description or generate a description
    if (title && message.length > title.length + 10) {
      description = message.replace(title, '').trim();
      if (description.startsWith('for') || description.startsWith('about')) {
        description = description.substring(4).trim();
      }
    } else {
      // Generate a description based on title
      description = `Please address the issue: ${title}`;
    }
    
    return {
      title,
      description,
      category,
      severity
    };
  },
  
  /**
   * Extract event parameters from a message
   */
  extractEventParameters(message: string): Record<string, any> {
    const lowerMessage = message.toLowerCase();
    let title = '';
    let description = '';
    let start = new Date();
    let end: Date | undefined = undefined;
    let type = 'general';
    
    // Try to determine event type based on keywords
    if (lowerMessage.includes('maintenance') || lowerMessage.includes('repair')) {
      type = 'maintenance';
    } else if (lowerMessage.includes('board') && lowerMessage.includes('meeting')) {
      type = 'board-meeting';
    } else if (lowerMessage.includes('social') || lowerMessage.includes('party')) {
      type = 'social';
    }
    
    // Extract title - use first part of message
    const firstPart = message.split(/for|on|at/i)[0].trim();
    if (firstPart.length > 5) {
      title = firstPart;
    } else {
      title = `${type.charAt(0).toUpperCase() + type.slice(1)} Event`;
    }
    
    // Try to extract date information - in a real implementation, this would use
    // a proper date/time parser like Chronic or a specialized library
    try {
      // Look for date markers
      const datePattern = /(today|tomorrow|next (monday|tuesday|wednesday|thursday|friday|saturday|sunday)|in \d+ days?|(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]* \d+)/i;
      const dateMatch = message.match(datePattern);
      
      if (dateMatch) {
        if (dateMatch[0].toLowerCase() === 'today') {
          start = new Date();
        } else if (dateMatch[0].toLowerCase() === 'tomorrow') {
          start = new Date();
          start.setDate(start.getDate() + 1);
        } else if (dateMatch[0].toLowerCase().startsWith('next ')) {
          // Handle "next X" day of week
          const dayOfWeek = dateMatch[0].substring(5).toLowerCase();
          const daysMap: Record<string, number> = {
            'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 
            'friday': 5, 'saturday': 6, 'sunday': 0
          };
          
          start = new Date();
          const currentDay = start.getDay();
          const targetDay = daysMap[dayOfWeek];
          const daysToAdd = (targetDay + 7 - currentDay) % 7;
          
          start.setDate(start.getDate() + daysToAdd);
        } else if (dateMatch[0].toLowerCase().startsWith('in ')) {
          // Handle "in X days"
          const daysMatch = dateMatch[0].match(/\d+/);
          if (daysMatch) {
            const daysToAdd = parseInt(daysMatch[0], 10);
            start = new Date();
            start.setDate(start.getDate() + daysToAdd);
          }
        }
        
        // Set it to a reasonable hour if no specific time
        if (!message.match(/at \d{1,2}(:\d{2})?\s*(am|pm)/i)) {
          start.setHours(10, 0, 0, 0);
        }
      } else {
        // Default to tomorrow at 10am if we can't parse a date
        start = new Date();
        start.setDate(start.getDate() + 1);
        start.setHours(10, 0, 0, 0);
      }
      
      // Try to extract time information
      const timePattern = /at\s+(\d{1,2})(:\d{2})?\s*(am|pm)/i;
      const timeMatch = message.match(timePattern);
      
      if (timeMatch) {
        let hours = parseInt(timeMatch[1], 10);
        const minutes = timeMatch[2] ? parseInt(timeMatch[2].substring(1), 10) : 0;
        const period = timeMatch[3].toLowerCase();
        
        // Convert to 24-hour format
        if (period === 'pm' && hours < 12) {
          hours += 12;
        } else if (period === 'am' && hours === 12) {
          hours = 0;
        }
        
        start.setHours(hours, minutes, 0, 0);
      }
      
      // Set an end time 1 hour later by default
      end = new Date(start);
      end.setHours(end.getHours() + 1);
      
    } catch (error) {
      console.error('Error parsing date from message:', error);
      // Use defaults if we can't parse the date
      start = new Date();
      start.setDate(start.getDate() + 1);
      start.setHours(10, 0, 0, 0);
      
      end = new Date(start);
      end.setHours(end.getHours() + 1);
    }
    
    // Extract description - use rest of message after date/time info
    description = message.replace(/schedule|create|add|event|meeting|appointment/gi, '')
                         .replace(/on|for|next (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/gi, '')
                         .replace(/at \d{1,2}(:\d{2})?\s*(am|pm)/i, '')
                         .replace(/tomorrow|today|in \d+ days/i, '')
                         .trim();
    
    if (description.length < 5) {
      description = `${title} scheduled by AI Assistant`;
    }
    
    return {
      title,
      description,
      start: start.toISOString(),
      end: end?.toISOString(),
      type
    };
  },
  
  /**
   * Generate a simple response for testing purposes
   * @param message The user's message
   * @param associationId Optional association ID for context
   * @returns A simple AI response
   */
  generateSimpleResponse(message: string, associationId?: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Simple pattern matching for common questions
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! How can I assist you with your community management today?";
    }
    
    if (lowerMessage.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with?";
    }
    
    if (lowerMessage.includes('who are you') || lowerMessage.includes('what can you do')) {
      return "I'm your Community AI Assistant. I can help with information about your association, " +
             "answer questions, and perform actions like sending emails, creating alerts, " +
             "scheduling events, and starting workflows. Just let me know what you need!";
    }
    
    if (lowerMessage.includes('help')) {
      return "I can help with various community management tasks. Try asking me things like:\n\n" +
             "- Send an email to all residents about the upcoming meeting\n" +
             "- Schedule a board meeting for next Tuesday at 7 PM\n" +
             "- Create an alert for the broken fence in the north area\n" +
             "- Start a maintenance workflow for unit 1234\n" +
             "- What's the status of the pool renovation?\n" +
             "- How many residents do we have?";
    }
    
    // Create a generic response for other queries
    return "I understand you're asking about " + message.substring(0, 30).toLowerCase() + 
           "... In a full implementation, I would connect to a large language model to provide " +
           "a detailed response based on your association's data. For now, please try asking me " +
           "to perform an action like 'send an email' or 'create an alert'.";
  }
};
