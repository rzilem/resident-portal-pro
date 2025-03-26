
import { calendarEventService } from './calendarEventService';
import { CalendarEvent } from '@/types/calendar';
import { workflowService } from '@/services/workflowService';
import { toast } from 'sonner';

export const workflowEventService = {
  // Create a workflow event
  createWorkflowEvent: (workflowId: string, title: string, start: Date, associationId: string) => {
    try {
      // Get workflow details
      const workflow = workflowService.getWorkflowById(workflowId);
      
      // Create calendar event for the workflow
      const event = calendarEventService.createEvent({
        title: title || `Scheduled: ${workflow.name}`,
        description: `Scheduled workflow: ${workflow.name}`,
        start,
        type: 'workflow',
        associationId,
        accessLevel: 'admin',
        workflowId,
        color: '#8b5cf6' // Purple color for workflow events
      });
      
      // Log the workflow schedule
      console.log(`Workflow "${workflow.name}" scheduled for ${start.toLocaleString()}`);
      
      return event;
    } catch (error) {
      console.error('Error creating workflow event:', error);
      throw error;
    }
  },
  
  // Get all scheduled workflow events
  getScheduledWorkflows: (associationId?: string) => {
    try {
      // Get all calendar events
      const events = calendarEventService.getAllEvents('admin', 'admin', associationId);
      
      // Filter for workflow events
      return events.filter(event => event.type === 'workflow' && event.workflowId);
    } catch (error) {
      console.error('Error getting scheduled workflows:', error);
      return [];
    }
  },
  
  // Execute a scheduled workflow
  executeScheduledWorkflow: (eventId: string) => {
    try {
      // Get the event
      const event = calendarEventService.getEventById(eventId);
      
      if (!event.workflowId) {
        throw new Error('No workflow associated with this event');
      }
      
      // In a real implementation, this would trigger the workflow execution
      // For now, we'll just log it and update the event
      console.log(`Executing workflow: ${event.workflowId}`);
      
      // Update event to mark it as executed
      calendarEventService.updateEvent(eventId, {
        description: `${event.description} (Executed at ${new Date().toLocaleString()})`,
        executed: true
      });
      
      toast.success(`Workflow "${event.title}" executed successfully`);
      
      return true;
    } catch (error) {
      console.error('Error executing scheduled workflow:', error);
      toast.error(`Failed to execute workflow: ${error.message}`);
      return false;
    }
  },
  
  // Cancel a scheduled workflow
  cancelScheduledWorkflow: (eventId: string) => {
    try {
      // Get the event
      const event = calendarEventService.getEventById(eventId);
      
      if (!event.workflowId) {
        throw new Error('No workflow associated with this event');
      }
      
      // Delete the calendar event
      calendarEventService.deleteEvent(eventId);
      
      toast.success(`Scheduled workflow "${event.title}" has been canceled`);
      
      return true;
    } catch (error) {
      console.error('Error canceling scheduled workflow:', error);
      toast.error(`Failed to cancel workflow: ${error.message}`);
      return false;
    }
  }
};
