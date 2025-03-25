
import { v4 as uuid } from 'uuid';
import { CalendarEvent, CalendarEventType, CalendarAccessLevel } from '@/types/calendar';
import { calendarEvents } from './calendarEvents';

export const calendarEventService = {
  // Get all calendar events based on user's access level
  getAllEvents: (userId: string, userAccessLevel: CalendarAccessLevel, associationId?: string) => {
    let filteredEvents = calendarEvents;
    
    // Filter by association if specified
    if (associationId) {
      filteredEvents = filteredEvents.filter(event => 
        event.associationId === associationId || event.associationId === undefined
      );
    }
    
    // Filter by access level
    return filteredEvents.filter(event => {
      const levels: Record<CalendarAccessLevel, CalendarAccessLevel[]> = {
        'public': ['public', 'residents', 'committee', 'board', 'admin'],
        'residents': ['residents', 'committee', 'board', 'admin'],
        'committee': ['committee', 'board', 'admin'],
        'board': ['board', 'admin'],
        'admin': ['admin']
      };
      
      return levels[event.accessLevel].includes(userAccessLevel);
    });
  },

  // Get events for a specific date range
  getEventsByDateRange: (
    start: Date, 
    end: Date,
    userId: string,
    userAccessLevel: CalendarAccessLevel,
    associationId?: string
  ) => {
    const events = calendarEventService.getAllEvents(userId, userAccessLevel, associationId);
    
    return events.filter(event => {
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
  },

  // Get events by type
  getEventsByType: (
    type: CalendarEventType,
    userId: string,
    userAccessLevel: CalendarAccessLevel,
    associationId?: string
  ) => {
    const events = calendarEventService.getAllEvents(userId, userAccessLevel, associationId);
    return events.filter(event => event.type === type);
  },

  // Get event by ID
  getEventById: (id: string) => {
    const event = calendarEvents.find(event => event.id === id);
    if (!event) {
      throw new Error(`Event with ID ${id} not found`);
    }
    return event;
  },

  // Create a new event
  createEvent: (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: uuid()
    };
    
    calendarEvents.push(newEvent);
    return newEvent;
  },

  // Update an existing event
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => {
    const index = calendarEvents.findIndex(event => event.id === id);
    if (index === -1) {
      throw new Error(`Event with ID ${id} not found`);
    }
    
    const updatedEvent = {
      ...calendarEvents[index],
      ...updates
    };
    
    calendarEvents[index] = updatedEvent;
    return updatedEvent;
  },

  // Delete an event
  deleteEvent: (id: string) => {
    const index = calendarEvents.findIndex(event => event.id === id);
    if (index === -1) {
      throw new Error(`Event with ID ${id} not found`);
    }
    
    calendarEvents.splice(index, 1);
    return { success: true };
  }
};
