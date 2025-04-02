
import { v4 as uuid } from 'uuid';
import { CalendarEvent, CalendarEventType, CalendarAccessLevel } from '@/types/calendar';
import { calendarEvents } from './calendarEvents';
import { supabase } from '@/integrations/supabase/client';

export const calendarEventService = {
  // Get all calendar events based on user's access level
  getAllEvents: async (userId: string, userAccessLevel: CalendarAccessLevel, associationId?: string) => {
    console.log(`Fetching all events for user ${userId}, access level ${userAccessLevel}, association ${associationId || 'global view'}`);
    
    try {
      let query = supabase
        .from('calendar_events')
        .select('*');
      
      // Filter by association if specified
      if (associationId) {
        query = query.eq('association_id', associationId).or('association_id.is.null');
      }
      
      const { data: events, error } = await query;
      
      if (error) {
        console.error('Error fetching calendar events from Supabase:', error);
        throw error;
      }
      
      // Filter by access level (we'll still do this client-side for now)
      const filteredEvents = events.filter(event => {
        const levels: Record<CalendarAccessLevel, CalendarAccessLevel[]> = {
          'public': ['public', 'residents', 'committee', 'board', 'admin'],
          'residents': ['residents', 'committee', 'board', 'admin'],
          'committee': ['committee', 'board', 'admin'],
          'board': ['board', 'admin'],
          'admin': ['admin']
        };
        
        return levels[event.access_level].includes(userAccessLevel);
      });
      
      console.log(`Fetched ${filteredEvents.length} events from Supabase`);
      return filteredEvents as CalendarEvent[];
    } catch (error) {
      console.error('Error in getAllEvents:', error);
      // Fallback to local events in case of error
      console.log('Falling back to local event data');
      
      let filteredEvents = calendarEvents;
      
      // Filter by association if specified
      if (associationId) {
        filteredEvents = filteredEvents.filter(event => 
          event.associationId === associationId || event.associationId === undefined
        );
      }
      
      // Filter by access level
      const result = filteredEvents.filter(event => {
        const levels: Record<CalendarAccessLevel, CalendarAccessLevel[]> = {
          'public': ['public', 'residents', 'committee', 'board', 'admin'],
          'residents': ['residents', 'committee', 'board', 'admin'],
          'committee': ['committee', 'board', 'admin'],
          'board': ['board', 'admin'],
          'admin': ['admin']
        };
        
        return levels[event.accessLevel].includes(userAccessLevel);
      });
      
      return result;
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
    console.log(`Fetching events by date range for ${associationId ? `association ${associationId}` : 'global view'}`);
    console.log(`Fetching events from ${start.toISOString()} to ${end.toISOString()}`);
    
    try {
      let query = supabase
        .from('calendar_events')
        .select('*')
        .gte('start_time', start.toISOString())
        .lte('start_time', end.toISOString());
      
      // Filter by association if specified
      if (associationId) {
        query = query.eq('association_id', associationId).or('association_id.is.null');
      }
      
      const { data: events, error } = await query;
      
      if (error) {
        console.error('Error fetching calendar events by date range from Supabase:', error);
        throw error;
      }
      
      // Filter by access level (we'll still do this client-side for now)
      const filteredEvents = events.filter(event => {
        const levels: Record<CalendarAccessLevel, CalendarAccessLevel[]> = {
          'public': ['public', 'residents', 'committee', 'board', 'admin'],
          'residents': ['residents', 'committee', 'board', 'admin'],
          'committee': ['committee', 'board', 'admin'],
          'board': ['board', 'admin'],
          'admin': ['admin']
        };
        
        return levels[event.access_level].includes(userAccessLevel);
      });
      
      // Map the database column names to our client-side model
      const mappedEvents = filteredEvents.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: new Date(event.start_time),
        end: event.end_time ? new Date(event.end_time) : undefined,
        type: event.event_type as CalendarEventType,
        associationId: event.association_id,
        accessLevel: event.access_level as CalendarAccessLevel,
        color: event.color,
        workflowId: event.workflow_id,
        allDay: event.all_day,
        location: event.location,
        createdBy: event.created_by,
        metadata: event.metadata
      }));
      
      console.log(`Fetched ${mappedEvents.length} events for date range from Supabase`);
      return mappedEvents;
    } catch (error) {
      console.error('Error in getEventsByDateRange:', error);
      // Fallback to local events in case of error
      console.log('Falling back to local event data for date range');
      
      // Get all events for the user first
      const events = await calendarEventService.getAllEvents(userId, userAccessLevel, associationId);
      
      // Then filter by date range
      const filtered = events.filter(event => {
        const eventStart = typeof event.start === 'string' ? new Date(event.start) : event.start;
        const eventEnd = event.end 
          ? (typeof event.end === 'string' ? new Date(event.end) : event.end) 
          : eventStart;
        
        return (
          (eventStart >= start && eventStart <= end) || // Starts within range
          (eventEnd && eventEnd >= start && eventEnd <= end) || // Ends within range
          (eventStart <= start && eventEnd && eventEnd >= end) // Spans the entire range
        );
      });
      
      return filtered;
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
      
      // Filter by association if specified
      if (associationId) {
        query = query.eq('association_id', associationId).or('association_id.is.null');
      }
      
      const { data: events, error } = await query;
      
      if (error) {
        console.error(`Error fetching ${type} events from Supabase:`, error);
        throw error;
      }
      
      // Filter by access level (we'll still do this client-side for now)
      const filteredEvents = events.filter(event => {
        const levels: Record<CalendarAccessLevel, CalendarAccessLevel[]> = {
          'public': ['public', 'residents', 'committee', 'board', 'admin'],
          'residents': ['residents', 'committee', 'board', 'admin'],
          'committee': ['committee', 'board', 'admin'],
          'board': ['board', 'admin'],
          'admin': ['admin']
        };
        
        return levels[event.access_level].includes(userAccessLevel);
      });
      
      // Map the database column names to our client-side model
      const mappedEvents = filteredEvents.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        start: new Date(event.start_time),
        end: event.end_time ? new Date(event.end_time) : undefined,
        type: event.event_type as CalendarEventType,
        associationId: event.association_id,
        accessLevel: event.access_level as CalendarAccessLevel,
        color: event.color,
        workflowId: event.workflow_id,
        allDay: event.all_day,
        location: event.location,
        createdBy: event.created_by,
        metadata: event.metadata
      }));
      
      console.log(`Fetched ${mappedEvents.length} ${type} events from Supabase`);
      return mappedEvents;
    } catch (error) {
      console.error(`Error in getEventsByType for ${type}:`, error);
      // Fallback to local events in case of error
      const events = await calendarEventService.getAllEvents(userId, userAccessLevel, associationId);
      return events.filter(event => event.type === type);
    }
  },

  // Get event by ID
  getEventById: async (id: string) => {
    try {
      const { data: event, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error(`Error fetching event with ID ${id} from Supabase:`, error);
        throw error;
      }
      
      if (!event) {
        throw new Error(`Event with ID ${id} not found`);
      }
      
      // Map the database column names to our client-side model
      return {
        id: event.id,
        title: event.title,
        description: event.description,
        start: new Date(event.start_time),
        end: event.end_time ? new Date(event.end_time) : undefined,
        type: event.event_type as CalendarEventType,
        associationId: event.association_id,
        accessLevel: event.access_level as CalendarAccessLevel,
        color: event.color,
        workflowId: event.workflow_id,
        allDay: event.all_day,
        location: event.location,
        createdBy: event.created_by,
        metadata: event.metadata
      } as CalendarEvent;
    } catch (error) {
      console.error(`Error in getEventById for ${id}:`, error);
      // Fallback to local events in case of error
      const event = calendarEvents.find(event => event.id === id);
      if (!event) {
        throw new Error(`Event with ID ${id} not found`);
      }
      return event;
    }
  },

  // Create a new event
  createEvent: async (event: Omit<CalendarEvent, 'id'>) => {
    console.log('Creating event with data:', event);
    
    // Format dates properly
    const start = event.start instanceof Date ? event.start : new Date(event.start as string);
    const end = event.end 
      ? (event.end instanceof Date ? event.end : new Date(event.end as string))
      : undefined;
    
    try {
      // Map our client model to the database column names
      const dbEvent = {
        title: event.title,
        description: event.description,
        start_time: start.toISOString(),
        end_time: end ? end.toISOString() : null,
        event_type: event.type,
        association_id: event.associationId,
        access_level: event.accessLevel,
        color: event.color,
        workflow_id: event.workflowId,
        all_day: event.allDay,
        location: event.location,
        created_by: event.createdBy,
        metadata: event.metadata
      };
      
      const { data, error } = await supabase
        .from('calendar_events')
        .insert(dbEvent)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating event in Supabase:', error);
        throw error;
      }
      
      console.log('New event created in Supabase:', data);
      
      // Map the database response back to our client-side model
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        start: new Date(data.start_time),
        end: data.end_time ? new Date(data.end_time) : undefined,
        type: data.event_type as CalendarEventType,
        associationId: data.association_id,
        accessLevel: data.access_level as CalendarAccessLevel,
        color: data.color,
        workflowId: data.workflow_id,
        allDay: data.all_day,
        location: data.location,
        createdBy: data.created_by,
        metadata: data.metadata
      } as CalendarEvent;
    } catch (error) {
      console.error('Error in createEvent:', error);
      console.log('Falling back to local event creation');
      
      // Fallback to local events in case of error
      // Generate a new event with proper ID and formatted dates
      const newEvent: CalendarEvent = {
        ...event,
        id: uuid(),
        start: start,
        end: end
      };
      
      // Push to the calendarEvents array
      calendarEvents.push(newEvent);
      console.log('New event created in local storage:', newEvent);
      return newEvent;
    }
  },

  // Update an existing event
  updateEvent: async (id: string, updates: Partial<CalendarEvent>) => {
    console.log(`Updating event ${id} with:`, updates);
    
    try {
      // Format dates properly if they're provided
      const updatedData: any = { ...updates };
      
      if (updates.start) {
        const start = updates.start instanceof Date ? 
          updates.start : new Date(updates.start as string);
        updatedData.start_time = start.toISOString();
        delete updatedData.start;
      }
      
      if (updates.end) {
        const end = updates.end instanceof Date ? 
          updates.end : new Date(updates.end as string);
        updatedData.end_time = end.toISOString();
        delete updatedData.end;
      }
      
      // Map other client-side properties to database column names
      if (updates.type) {
        updatedData.event_type = updates.type;
        delete updatedData.type;
      }
      
      if (updates.associationId) {
        updatedData.association_id = updates.associationId;
        delete updatedData.associationId;
      }
      
      if (updates.accessLevel) {
        updatedData.access_level = updates.accessLevel;
        delete updatedData.accessLevel;
      }
      
      if (updates.allDay !== undefined) {
        updatedData.all_day = updates.allDay;
        delete updatedData.allDay;
      }
      
      if (updates.workflowId) {
        updatedData.workflow_id = updates.workflowId;
        delete updatedData.workflowId;
      }
      
      if (updates.createdBy) {
        updatedData.created_by = updates.createdBy;
        delete updatedData.createdBy;
      }
      
      const { data, error } = await supabase
        .from('calendar_events')
        .update(updatedData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error(`Error updating event ${id} in Supabase:`, error);
        throw error;
      }
      
      console.log('Event updated successfully in Supabase:', data);
      
      // Map the database response back to our client-side model
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        start: new Date(data.start_time),
        end: data.end_time ? new Date(data.end_time) : undefined,
        type: data.event_type as CalendarEventType,
        associationId: data.association_id,
        accessLevel: data.access_level as CalendarAccessLevel,
        color: data.color,
        workflowId: data.workflow_id,
        allDay: data.all_day,
        location: data.location,
        createdBy: data.created_by,
        metadata: data.metadata
      } as CalendarEvent;
    } catch (error) {
      console.error(`Error in updateEvent for ${id}:`, error);
      console.log('Falling back to local event update');
      
      // Fallback to local events in case of error
      const index = calendarEvents.findIndex(event => event.id === id);
      
      if (index === -1) {
        throw new Error(`Event with ID ${id} not found`);
      }
      
      // Format dates properly if they're provided
      const updatedData: Partial<CalendarEvent> = { ...updates };
      
      if (updates.start) {
        updatedData.start = updates.start instanceof Date ? 
          updates.start : new Date(updates.start as string);
      }
      
      if (updates.end) {
        updatedData.end = updates.end instanceof Date ? 
          updates.end : new Date(updates.end as string);
      }
      
      const updatedEvent = {
        ...calendarEvents[index],
        ...updatedData
      };
      
      calendarEvents[index] = updatedEvent;
      console.log('Event updated successfully in local storage:', updatedEvent);
      return updatedEvent;
    }
  },

  // Delete an event
  deleteEvent: async (id: string) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting event ${id} from Supabase:`, error);
        throw error;
      }
      
      console.log(`Event ${id} deleted successfully from Supabase`);
      return { success: true };
    } catch (error) {
      console.error(`Error in deleteEvent for ${id}:`, error);
      console.log('Falling back to local event deletion');
      
      // Fallback to local events in case of error
      const index = calendarEvents.findIndex(event => event.id === id);
      
      if (index === -1) {
        throw new Error(`Event with ID ${id} not found`);
      }
      
      calendarEvents.splice(index, 1);
      console.log(`Event ${id} deleted successfully from local storage`);
      return { success: true };
    }
  },
  
  // Create workflow event
  createWorkflowEvent: async (
    workflowId: string,
    title: string,
    scheduledDateTime: Date,
    associationId: string
  ) => {
    if (!associationId) {
      throw new Error('Association ID is required to create a workflow event');
    }
    
    const newEvent: Omit<CalendarEvent, 'id'> = {
      title,
      description: `Scheduled workflow: ${title}`,
      start: scheduledDateTime,
      type: 'workflow',
      associationId,
      accessLevel: 'admin',
      color: '#6366f1', // Indigo color for workflow events
      workflowId
    };
    
    return calendarEventService.createEvent(newEvent);
  }
};
