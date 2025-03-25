
import { calendarEventService } from './calendarEventService';

export const workflowEventService = {
  // Create a workflow event
  createWorkflowEvent: (workflowId: string, title: string, start: Date, associationId: string) => {
    return calendarEventService.createEvent({
      title,
      description: `Scheduled workflow: ${title}`,
      start,
      type: 'workflow',
      associationId,
      accessLevel: 'admin',
      workflowId,
      color: '#8b5cf6'
    });
  }
};
