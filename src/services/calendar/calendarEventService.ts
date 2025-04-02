
import { v4 as uuid } from 'uuid';
import { CalendarEvent, CalendarEventType, CalendarAccessLevel } from '@/types/calendar';
import { calendarEvents } from './calendarEvents';

export const calendarEventService = {
  // Get all calendar events based on user's access level
  getAllEvents: async (userId: string, userAccessLevel: CalendarAccessLevel, associationId?: string) => {
    console.log(`Fetching all events for user ${userId}, access level ${userAccessLevel}, association ${associationId || 'global view'}`);
    
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
    
    console.log(`Fetched ${result.length} events from database`);
    return result;
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
    
    console.log(`Fetched ${filtered.length} events for date range`);
    return filtered;
  },

  // Get events by type
  getEventsByType: async (
    type: CalendarEventType,
    userId: string,
    userAccessLevel: CalendarAccessLevel,
    associationId?: string
  ) => {
    const events = await calendarEventService.getAllEvents(userId, userAccessLevel, associationId);
    return events.filter(event => event.type === type);
  },

  // Get event by ID
  getEventById: async (id: string) => {
    const event = calendarEvents.find(event => event.id === id);
    if (!event) {
      throw new Error(`Event with ID ${id} not found`);
    }
    return event;
  },

  // Create a new event
  createEvent: async (event: Omit<CalendarEvent, 'id'>) => {
    console.log('Creating event with data:', event);
    
    // Format dates properly
    const start = event.start instanceof Date ? event.start : new Date(event.start as string);
    const end = event.end 
      ? (event.end instanceof Date ? event.end : new Date(event.end as string))
      : undefined;
    
    // Generate a new event with proper ID and formatted dates
    const newEvent: CalendarEvent = {
      ...event,
      id: uuid(),
      start: start,
      end: end
    };
    
    // Push to the calendarEvents array
    calendarEvents.push(newEvent);
    console.log('New event created:', newEvent);
    return newEvent;
  },

  // Update an existing event
  updateEvent: async (id: string, updates: Partial<CalendarEvent>) => {
    console.log(`Updating event ${id} with:`, updates);
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
    console.log('Event updated successfully:', updatedEvent);
    return updatedEvent;
  },

  // Delete an event
  deleteEvent: async (id: string) => {
    const index = calendarEvents.findIndex(event => event.id === id);
    
    if (index === -1) {
      throw new Error(`Event with ID ${id} not found`);
    }
    
    calendarEvents.splice(index, 1);
    console.log(`Event ${id} deleted successfully`);
    return { success: true };
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
