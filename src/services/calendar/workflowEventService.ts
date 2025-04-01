
import { supabase } from '@/lib/supabase';
import { CalendarEvent } from '@/types/calendar';

export const workflowEventService = {
  // Get all scheduled workflows
  getScheduledWorkflows: async (associationId?: string) => {
    try {
      let query = supabase
        .from('calendar_events')
        .select('*')
        .eq('event_type', 'workflow');
      
      if (associationId) {
        query = query.eq('association_id', associationId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as CalendarEvent[];
    } catch (error) {
      console.error('Error fetching scheduled workflows:', error);
      throw error;
    }
  },
  
  // Create a new workflow event
  createWorkflowEvent: async (
    workflowId: string, 
    title: string, 
    scheduledDateTime: Date,
    associationId: string
  ) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const event = {
        title,
        description: `Automated workflow: ${title}`,
        start_time: scheduledDateTime.toISOString(),
        event_type: 'workflow',
        association_id: associationId,
        workflow_id: workflowId,
        created_by: user.user?.id,
        access_level: 'admin',
        all_day: true
      };
      
      const { data, error } = await supabase
        .from('calendar_events')
        .insert([event])
        .select()
        .single();
      
      if (error) throw error;
      return data as CalendarEvent;
    } catch (error) {
      console.error('Error creating workflow event:', error);
      throw error;
    }
  },
  
  // Cancel a scheduled workflow
  cancelScheduledWorkflow: async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId)
        .eq('event_type', 'workflow');
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error canceling scheduled workflow:', error);
      throw error;
    }
  },
  
  // Execute a scheduled workflow (placeholder implementation)
  executeScheduledWorkflow: async (eventId: string) => {
    try {
      // In a real implementation, this would trigger the workflow execution
      // For now, we'll just mark it as executed in metadata
      
      const { data, error } = await supabase
        .from('calendar_events')
        .update({
          metadata: {
            executed: true,
            executed_at: new Date().toISOString()
          }
        })
        .eq('id', eventId)
        .eq('event_type', 'workflow')
        .select()
        .single();
      
      if (error) throw error;
      return data as CalendarEvent;
    } catch (error) {
      console.error('Error executing scheduled workflow:', error);
      throw error;
    }
  }
};
