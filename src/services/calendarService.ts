
import { v4 as uuid } from 'uuid';
import { 
  CalendarEvent, 
  CalendarEventType, 
  AssociationCalendarSettings,
  CalendarAccessLevel 
} from '@/types/calendar';
import { add, format, startOfDay, endOfDay, isSameDay, parseISO } from 'date-fns';

// Sample calendar events data
let calendarEvents: CalendarEvent[] = [
  {
    id: uuid(),
    title: 'Board Meeting',
    description: 'Monthly board meeting to discuss community issues',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 18, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 20, 0),
    type: 'meeting',
    associationId: 'assoc-1',
    accessLevel: 'board',
    color: '#4f46e5'
  },
  {
    id: uuid(),
    title: 'Pool Maintenance',
    description: 'Regular pool cleaning and maintenance',
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 12, 9, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), 12, 12, 0),
    type: 'maintenance',
    associationId: 'assoc-1',
    accessLevel: 'residents',
    color: '#f59e0b'
  },
  {
    id: uuid(),
    title: 'Independence Day',
    description: 'Fourth of July Celebration',
    start: new Date(new Date().getFullYear(), 6, 4),
    allDay: true,
    type: 'holiday',
    accessLevel: 'public',
    color: '#ef4444'
  },
  {
    id: uuid(),
    title: 'Community Picnic',
    description: 'Annual summer picnic for all residents',
    start: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5, 11, 0),
    end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5, 15, 0),
    location: 'Community Park',
    type: 'community',
    associationId: 'assoc-1',
    accessLevel: 'residents',
    color: '#10b981'
  },
  {
    id: uuid(),
    title: 'Assessment Payment Due',
    description: 'Monthly HOA dues deadline',
    start: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    allDay: true,
    type: 'deadline',
    associationId: 'assoc-1',
    accessLevel: 'residents',
    recurring: {
      frequency: 'monthly',
      interval: 1
    },
    color: '#6366f1'
  }
];

// Sample association calendar settings
let associationCalendarSettings: AssociationCalendarSettings[] = [
  {
    associationId: 'assoc-1',
    name: 'Oak Ridge Community',
    description: 'Calendar for Oak Ridge Community events and meetings',
    defaultAccessLevel: 'residents',
    viewSettings: {
      defaultView: 'month',
      showWeekends: true,
      workdayStart: 9,
      workdayEnd: 17,
      firstDayOfWeek: 0
    },
    color: '#4f46e5',
    enabled: true
  },
  {
    associationId: 'assoc-2',
    name: 'Meadow Creek HOA',
    description: 'Calendar for Meadow Creek Homeowners Association',
    defaultAccessLevel: 'residents',
    viewSettings: {
      defaultView: 'month',
      showWeekends: true,
      workdayStart: 8,
      workdayEnd: 18,
      firstDayOfWeek: 1
    },
    color: '#0ea5e9',
    enabled: true
  }
];

// Generate US holidays for the current year
const generateUSHolidays = (): CalendarEvent[] => {
  const currentYear = new Date().getFullYear();
  
  return [
    {
      id: uuid(),
      title: 'New Year\'s Day',
      start: new Date(currentYear, 0, 1),
      allDay: true,
      type: 'holiday',
      accessLevel: 'public',
      color: '#ef4444'
    },
    {
      id: uuid(),
      title: 'Memorial Day',
      // Last Monday in May
      start: new Date(currentYear, 4, 31 - (new Date(currentYear, 4, 31).getDay() - 1) % 7),
      allDay: true,
      type: 'holiday',
      accessLevel: 'public',
      color: '#ef4444'
    },
    {
      id: uuid(),
      title: 'Independence Day',
      start: new Date(currentYear, 6, 4),
      allDay: true,
      type: 'holiday',
      accessLevel: 'public',
      color: '#ef4444'
    },
    {
      id: uuid(),
      title: 'Labor Day',
      // First Monday in September
      start: new Date(currentYear, 8, 1 + (8 - new Date(currentYear, 8, 1).getDay()) % 7),
      allDay: true,
      type: 'holiday',
      accessLevel: 'public',
      color: '#ef4444'
    },
    {
      id: uuid(),
      title: 'Thanksgiving Day',
      // Fourth Thursday in November
      start: new Date(currentYear, 10, 22 + (4 - new Date(currentYear, 10, 1).getDay()) % 7),
      allDay: true,
      type: 'holiday',
      accessLevel: 'public',
      color: '#ef4444'
    },
    {
      id: uuid(),
      title: 'Christmas Day',
      start: new Date(currentYear, 11, 25),
      allDay: true,
      type: 'holiday',
      accessLevel: 'public',
      color: '#ef4444'
    }
  ];
};

// Add holidays to the calendar events
calendarEvents = [...calendarEvents, ...generateUSHolidays()];

// Calendar service
export const calendarService = {
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
    const events = calendarService.getAllEvents(userId, userAccessLevel, associationId);
    
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
    const events = calendarService.getAllEvents(userId, userAccessLevel, associationId);
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
  },

  // Get all association calendar settings
  getAllCalendarSettings: () => {
    return associationCalendarSettings;
  },

  // Get calendar settings for a specific association
  getCalendarSettingsByAssociationId: (associationId: string) => {
    const settings = associationCalendarSettings.find(
      settings => settings.associationId === associationId
    );
    
    if (!settings) {
      throw new Error(`Calendar settings for association ${associationId} not found`);
    }
    
    return settings;
  },

  // Update calendar settings
  updateCalendarSettings: (associationId: string, updates: Partial<AssociationCalendarSettings>) => {
    const index = associationCalendarSettings.findIndex(
      settings => settings.associationId === associationId
    );
    
    if (index === -1) {
      throw new Error(`Calendar settings for association ${associationId} not found`);
    }
    
    const updatedSettings = {
      ...associationCalendarSettings[index],
      ...updates
    };
    
    associationCalendarSettings[index] = updatedSettings;
    return updatedSettings;
  },

  // Create calendar settings for a new association
  createCalendarSettings: (settings: AssociationCalendarSettings) => {
    associationCalendarSettings.push(settings);
    return settings;
  },

  // Create a workflow event
  createWorkflowEvent: (workflowId: string, title: string, start: Date, associationId: string) => {
    return calendarService.createEvent({
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
