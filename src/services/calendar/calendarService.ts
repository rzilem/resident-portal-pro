
import { supabase } from '@/lib/supabase';
import { CalendarEvent, CalendarAccessLevel, CalendarEventType } from '@/types/calendar';
import { v4 as uuid } from 'uuid';

export const calendarEventService = {
  // Get all calendar events based on user's access level
  getAllEvents: async (userId: string, userAccessLevel: CalendarAccessLevel, associationId?: string) => {
    try {
      let query = supabase
        .from('calendar_events')
        .select('*');
      
      // Filter by association if specified
      if (associationId) {
        query = query.eq('association_id', associationId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map database fields to CalendarEvent type
      const formattedEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: new Date(event.start_time),
        end: event.end_time ? new Date(event.end_time) : undefined,
        allDay: event.all_day,
        location: event.location,
        type: event.event_type as CalendarEventType,
        associationId: event.association_id,
        createdBy: event.created_by,
        accessLevel: event.access_level as CalendarAccessLevel,
        color: event.color,
        recurring: event.recurring_pattern,
        workflowId: event.workflow_id,
        metadata: event.metadata
      }));
      
      return formattedEvents as CalendarEvent[];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  },

  // Get events for a specific date range
  getEventsByDateRange: async (
    start: Date, 
    end: Date,
    userId: string,
    userAccessLevel: CalendarAccessLevel,
    associationId?: string
  ) => {
    try {
      let query = supabase
        .from('calendar_events')
        .select('*')
        .gte('start_time', start.toISOString())
        .lte('start_time', end.toISOString());
      
      if (associationId) {
        query = query.eq('association_id', associationId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map database fields to CalendarEvent type
      const formattedEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: new Date(event.start_time),
        end: event.end_time ? new Date(event.end_time) : undefined,
        allDay: event.all_day,
        location: event.location,
        type: event.event_type as CalendarEventType,
        associationId: event.association_id,
        createdBy: event.created_by,
        accessLevel: event.access_level as CalendarAccessLevel,
        color: event.color,
        recurring: event.recurring_pattern,
        workflowId: event.workflow_id,
        metadata: event.metadata
      }));
      
      return formattedEvents as CalendarEvent[];
    } catch (error) {
      console.error('Error fetching calendar events by date range:', error);
      throw error;
    }
  },

  // Get events by type
  getEventsByType: async (
    type: CalendarEventType,
    userId: string,
    userAccessLevel: CalendarAccessLevel,
    associationId?: string
  ) => {
    try {
      let query = supabase
        .from('calendar_events')
        .select('*')
        .eq('event_type', type);
      
      if (associationId) {
        query = query.eq('association_id', associationId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map database fields to CalendarEvent type
      const formattedEvents = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: new Date(event.start_time),
        end: event.end_time ? new Date(event.end_time) : undefined,
        allDay: event.all_day,
        location: event.location,
        type: event.event_type as CalendarEventType,
        associationId: event.association_id,
        createdBy: event.created_by,
        accessLevel: event.access_level as CalendarAccessLevel,
        color: event.color,
        recurring: event.recurring_pattern,
        workflowId: event.workflow_id,
        metadata: event.metadata
      }));
      
      return formattedEvents as CalendarEvent[];
    } catch (error) {
      console.error('Error fetching events by type:', error);
      throw error;
    }
  },

  // Get event by ID
  getEventById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      // Map database fields to CalendarEvent type
      const formattedEvent = {
        id: data.id,
        title: data.title,
        description: data.description,
        start: new Date(data.start_time),
        end: data.end_time ? new Date(data.end_time) : undefined,
        allDay: data.all_day,
        location: data.location,
        type: data.event_type as CalendarEventType,
        associationId: data.association_id,
        createdBy: data.created_by,
        accessLevel: data.access_level as CalendarAccessLevel,
        color: data.color,
        recurring: data.recurring_pattern,
        workflowId: data.workflow_id,
        metadata: data.metadata
      };
      
      return formattedEvent as CalendarEvent;
    } catch (error) {
      console.error('Error fetching event by ID:', error);
      throw error;
    }
  },

  // Create a new event
  createEvent: async (event: Omit<CalendarEvent, 'id'>) => {
    try {
      // Convert from CalendarEvent type to database schema
      const dbEvent = {
        title: event.title,
        description: event.description,
        start_time: event.start instanceof Date ? event.start.toISOString() : event.start,
        end_time: event.end ? (event.end instanceof Date ? event.end.toISOString() : event.end) : null,
        all_day: event.allDay,
        location: event.location,
        event_type: event.type,
        association_id: event.associationId,
        created_by: event.createdBy,
        access_level: event.accessLevel,
        color: event.color,
        recurring_pattern: event.recurring,
        workflow_id: event.workflowId,
        metadata: event.metadata
      };
      
      const { data, error } = await supabase
        .from('calendar_events')
        .insert([dbEvent])
        .select()
        .single();
      
      if (error) throw error;
      
      // Map database response back to CalendarEvent type
      const formattedEvent = {
        id: data.id,
        title: data.title,
        description: data.description,
        start: new Date(data.start_time),
        end: data.end_time ? new Date(data.end_time) : undefined,
        allDay: data.all_day,
        location: data.location,
        type: data.event_type as CalendarEventType,
        associationId: data.association_id,
        createdBy: data.created_by,
        accessLevel: data.access_level as CalendarAccessLevel,
        color: data.color,
        recurring: data.recurring_pattern,
        workflowId: data.workflow_id,
        metadata: data.metadata
      };
      
      return formattedEvent as CalendarEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Update an existing event
  updateEvent: async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      // Convert from CalendarEvent type to database schema
      const dbUpdates: any = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.start !== undefined) {
        dbUpdates.start_time = updates.start instanceof Date 
          ? updates.start.toISOString() 
          : updates.start;
      }
      if (updates.end !== undefined) {
        dbUpdates.end_time = updates.end instanceof Date 
          ? updates.end.toISOString() 
          : updates.end;
      }
      if (updates.allDay !== undefined) dbUpdates.all_day = updates.allDay;
      if (updates.location !== undefined) dbUpdates.location = updates.location;
      if (updates.type !== undefined) dbUpdates.event_type = updates.type;
      if (updates.associationId !== undefined) dbUpdates.association_id = updates.associationId;
      if (updates.accessLevel !== undefined) dbUpdates.access_level = updates.accessLevel;
      if (updates.color !== undefined) dbUpdates.color = updates.color;
      if (updates.recurring !== undefined) dbUpdates.recurring_pattern = updates.recurring;
      if (updates.workflowId !== undefined) dbUpdates.workflow_id = updates.workflowId;
      if (updates.metadata !== undefined) dbUpdates.metadata = updates.metadata;

      const { data, error } = await supabase
        .from('calendar_events')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Map database response back to CalendarEvent type
      const formattedEvent = {
        id: data.id,
        title: data.title,
        description: data.description,
        start: new Date(data.start_time),
        end: data.end_time ? new Date(data.end_time) : undefined,
        allDay: data.all_day,
        location: data.location,
        type: data.event_type as CalendarEventType,
        associationId: data.association_id,
        createdBy: data.created_by,
        accessLevel: data.access_level as CalendarAccessLevel,
        color: data.color,
        recurring: data.recurring_pattern,
        workflowId: data.workflow_id,
        metadata: data.metadata
      };
      
      return formattedEvent as CalendarEvent;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  // Delete an event
  deleteEvent: async (id: string) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  // Create a workflow event (placeholder implementation, would be expanded in real usage)
  createWorkflowEvent: async (workflowId: string, title: string, start: Date, associationId: string) => {
    try {
      const event = {
        title,
        description: `Automated workflow: ${title}`,
        start_time: start.toISOString(),
        event_type: 'workflow' as CalendarEventType,
        association_id: associationId,
        workflow_id: workflowId,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        access_level: 'admin' as CalendarAccessLevel,
        all_day: true
      };

      const { data, error } = await supabase
        .from('calendar_events')
        .insert([event])
        .select()
        .single();
      
      if (error) throw error;
      
      // Map database response back to CalendarEvent type
      const formattedEvent = {
        id: data.id,
        title: data.title,
        description: data.description,
        start: new Date(data.start_time),
        end: data.end_time ? new Date(data.end_time) : undefined,
        allDay: data.all_day,
        location: data.location,
        type: data.event_type as CalendarEventType,
        associationId: data.association_id,
        createdBy: data.created_by,
        accessLevel: data.access_level as CalendarAccessLevel,
        color: data.color,
        recurring: data.recurring_pattern,
        workflowId: data.workflow_id,
        metadata: data.metadata
      };
      
      return formattedEvent as CalendarEvent;
    } catch (error) {
      console.error('Error creating workflow event:', error);
      throw error;
    }
  },

  // Get user calendar settings
  getUserCalendarSettings: async (userId: string, associationId?: string) => {
    try {
      let query = supabase
        .from('calendar_settings')
        .select('*')
        .eq('user_id', userId);
      
      if (associationId) {
        query = query.eq('association_id', associationId);
      }
      
      const { data, error } = await query.single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      
      return data;
    } catch (error) {
      console.error('Error fetching user calendar settings:', error);
      throw error;
    }
  },

  // Save user calendar settings
  saveUserCalendarSettings: async (settings: any) => {
    try {
      const { data: existing } = await supabase
        .from('calendar_settings')
        .select('*')
        .eq('user_id', settings.user_id)
        .maybeSingle();
      
      if (existing) {
        // Update existing settings
        const { data, error } = await supabase
          .from('calendar_settings')
          .update(settings)
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Insert new settings
        const { data, error } = await supabase
          .from('calendar_settings')
          .insert([settings])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error saving user calendar settings:', error);
      throw error;
    }
  }
};
