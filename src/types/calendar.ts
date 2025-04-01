
import { User } from "./user";
import { Association } from "./association";

export type CalendarEventType = 
  | 'meeting' 
  | 'maintenance' 
  | 'holiday' 
  | 'deadline'
  | 'workflow'
  | 'community'
  | 'custom';

export type CalendarAccessLevel = 
  | 'public'     // Visible to everyone
  | 'residents'  // Visible to all association residents
  | 'board'      // Visible to board members only
  | 'committee'  // Visible to committee members
  | 'admin';     // Visible to admins only

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date | string;
  end?: Date | string;
  allDay?: boolean;
  location?: string;
  type: CalendarEventType;
  associationId?: string;
  createdBy?: string;
  accessLevel: CalendarAccessLevel;
  color?: string;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date | string;
  };
  workflowId?: string;
  metadata?: Record<string, any>;
  attendees?: string[];
}

export interface CalendarViewSettings {
  defaultView: 'day' | 'week' | 'month' | 'agenda';
  showWeekends: boolean;
  workdayStart: number;
  workdayEnd: number;
  firstDayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.
  timeZone?: string;
}

export interface AssociationCalendarSettings {
  associationId: string;
  name: string;
  description?: string;
  defaultAccessLevel: CalendarAccessLevel;
  viewSettings: CalendarViewSettings;
  color?: string;
  enabled: boolean;
}

export interface UserCalendarPreferences {
  userId: string;
  visibleCalendars: string[]; // Array of association IDs
  viewSettings: CalendarViewSettings;
  notifications: boolean;
  reminderTime: number; // Minutes before event
}
