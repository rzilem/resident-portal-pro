
import { workflowService } from '@/services/workflowService';
import { communicationService } from '@/services/communicationService';
import { emailService } from '@/services/emailService';
import { toast } from 'sonner';
import { useAssociationStore } from '@/stores/associationStore';

/**
 * Service to handle AI-initiated actions in the system
 */
export const aiActionService = {
  /**
   * Process an action request from the AI
   * @param actionType - Type of action to perform
   * @param actionParams - Parameters for the action
   * @returns Result of the action execution
   */
  async processAction(actionType: string, actionParams: Record<string, any>): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    console.log('AI Action Request:', { actionType, actionParams });
    
    try {
      switch (actionType.toLowerCase()) {
        case 'start_workflow':
          return await this.startWorkflow(actionParams);
        
        case 'send_message':
          return await this.sendCommunication(actionParams);
        
        case 'create_alert':
          return await this.createAlert(actionParams);
          
        case 'schedule_event':
          return await this.scheduleEvent(actionParams);
          
        default:
          return {
            success: false,
            message: `Unknown action type: ${actionType}`
          };
      }
    } catch (error) {
      console.error('Error processing AI action:', error);
      return {
        success: false,
        message: `Error processing action: ${error.message}`
      };
    }
  },
  
  /**
   * Start a workflow based on template or custom workflow
   */
  private async startWorkflow(params: Record<string, any>): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    const { workflowId, templateId, parameters } = params;
    
    try {
      let workflow;
      
      if (workflowId) {
        // Execute existing workflow
        workflow = await workflowService.getWorkflowById(workflowId);
        const result = await workflowService.executeWorkflow(workflowId, parameters);
        
        return {
          success: true,
          message: `Successfully started workflow: ${workflow.name}`,
          data: result
        };
      } else if (templateId) {
        // Create from template and execute
        workflow = await workflowService.createFromTemplate(templateId);
        const result = await workflowService.executeWorkflow(workflow.id, parameters);
        
        return {
          success: true,
          message: `Created and started workflow from template: ${workflow.name}`,
          data: result
        };
      } else {
        return {
          success: false,
          message: 'Either workflowId or templateId is required to start a workflow'
        };
      }
    } catch (error) {
      console.error('Error starting workflow:', error);
      return {
        success: false,
        message: `Failed to start workflow: ${error.message}`
      };
    }
  },
  
  /**
   * Send a communication (email, SMS, etc.)
   */
  private async sendCommunication(params: Record<string, any>): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    const { 
      type = 'email', 
      recipients, 
      subject, 
      content, 
      templateId
    } = params;
    
    if (!recipients || !recipients.length) {
      return {
        success: false,
        message: 'Recipients are required for sending communication'
      };
    }
    
    try {
      let messageContent = content;
      let messageSubject = subject;
      
      // If using a template, load it
      if (templateId && !content) {
        // In a real implementation, this would fetch the template content
        // For now, we'll just use some placeholder content
        messageContent = "This is a message generated from a template";
        messageSubject = "Message from template";
      }
      
      if (type === 'email') {
        if (!messageSubject) {
          return {
            success: false,
            message: 'Subject is required for email communications'
          };
        }
        
        // Send email to each recipient
        for (const recipient of recipients) {
          await emailService.sendEmail({
            to: recipient,
            subject: messageSubject,
            body: messageContent,
            isHtml: true
          });
        }
        
        return {
          success: true,
          message: `Successfully sent email to ${recipients.length} recipient(s)`,
          data: { recipients, subject: messageSubject }
        };
      } else if (type === 'sms') {
        // Mock SMS implementation
        console.log(`Sending SMS to ${recipients.join(', ')}: ${messageContent}`);
        
        return {
          success: true,
          message: `Successfully sent SMS to ${recipients.length} recipient(s)`,
          data: { recipients }
        };
      } else {
        return {
          success: false,
          message: `Unsupported communication type: ${type}`
        };
      }
    } catch (error) {
      console.error('Error sending communication:', error);
      return {
        success: false,
        message: `Failed to send communication: ${error.message}`
      };
    }
  },
  
  /**
   * Create an alert in the system
   */
  private async createAlert(params: Record<string, any>): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    const { title, description, category, severity = 'medium', propertyId } = params;
    
    if (!title) {
      return {
        success: false,
        message: 'Alert title is required'
      };
    }
    
    try {
      // In a real implementation, this would create an alert in the database
      // For now, we'll just mock it
      const alertData = {
        title,
        description: description || '',
        category: category || 'general',
        severity,
        propertyId,
        createdAt: new Date().toISOString(),
        status: 'new',
      };
      
      console.log('Creating alert:', alertData);
      
      // Show UI notification
      toast.warning(title, {
        description: description || 'New alert created by AI Assistant'
      });
      
      return {
        success: true,
        message: 'Alert created successfully',
        data: alertData
      };
    } catch (error) {
      console.error('Error creating alert:', error);
      return {
        success: false,
        message: `Failed to create alert: ${error.message}`
      };
    }
  },
  
  /**
   * Schedule an event on the calendar
   */
  private async scheduleEvent(params: Record<string, any>): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    const { title, start, end, description, type = 'general' } = params;
    
    if (!title || !start) {
      return {
        success: false,
        message: 'Event title and start time are required'
      };
    }
    
    try {
      // In a real implementation, this would create a calendar event
      // For now, we'll just mock it
      const eventData = {
        title,
        start: new Date(start).toISOString(),
        end: end ? new Date(end).toISOString() : undefined,
        description: description || '',
        type,
        createdAt: new Date().toISOString(),
      };
      
      console.log('Scheduling event:', eventData);
      
      // Show UI notification
      toast.success('Event Scheduled', {
        description: `"${title}" scheduled for ${new Date(start).toLocaleString()}`
      });
      
      return {
        success: true,
        message: 'Event scheduled successfully',
        data: eventData
      };
    } catch (error) {
      console.error('Error scheduling event:', error);
      return {
        success: false,
        message: `Failed to schedule event: ${error.message}`
      };
    }
  }
};
