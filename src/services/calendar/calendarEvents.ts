
import { v4 as uuid } from 'uuid';
import { CalendarEvent } from '@/types/calendar';

// Sample calendar events data
export let calendarEvents: CalendarEvent[] = [
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
