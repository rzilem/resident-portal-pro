
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CalendarEvent {
  id?: string;
  title: string;
  description?: string;
  start_time: Date | string;
  end_time?: Date | string;
  all_day?: boolean;
  location?: string;
  event_type: string;
  association_id?: string;
  color?: string;
  access_level?: 'public' | 'private' | 'restricted';
  recurring_pattern?: any;
  metadata?: any;
}

/**
 * Service for managing calendar events in Supabase
 */
export const calendarService = {
  /**
   * Create a new calendar event
   */
  async createEvent(event: CalendarEvent): Promise<CalendarEvent | null> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert({
          title: event.title,
          description: event.description,
          start_time: event.start_time,
          end_time: event.end_time,
          all_day: event.all_day || false,
          location: event.location,
          event_type: event.event_type,
          association_id: event.association_id,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          access_level: event.access_level || 'public',
          color: event.color,
          recurring_pattern: event.recurring_pattern,
          metadata: event.metadata
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating calendar event:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to create calendar event:', error);
      toast.error('Failed to create event');
      return null;
    }
  },

  /**
   * Get all calendar events for a specific time range
   */
  async getEvents(start?: Date, end?: Date, associationId?: string): Promise<CalendarEvent[]> {
    try {
      let query = supabase
        .from('calendar_events')
        .select('*');

      if (start) {
        query = query.gte('start_time', start.toISOString());
      }

      if (end) {
        query = query.lte('start_time', end.toISOString());
      }

      if (associationId) {
        query = query.eq('association_id', associationId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching calendar events:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
      toast.error('Failed to load events');
      return [];
    }
  },

  /**
   * Update an existing calendar event
   */
  async updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .update(updates)
        .eq('id', eventId);

      if (error) {
        console.error('Error updating calendar event:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to update calendar event:', error);
      toast.error('Failed to update event');
      return false;
    }
  },

  /**
   * Delete a calendar event
   */
  async deleteEvent(eventId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Error deleting calendar event:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to delete calendar event:', error);
      toast.error('Failed to delete event');
      return false;
    }
  }
};
