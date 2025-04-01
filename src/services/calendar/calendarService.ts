
import { supabase } from '@/lib/supabase';
import { CalendarEvent, CalendarAccessLevel, CalendarEventType } from '@/types/calendar';
import { v4 as uuid } from 'uuid';

export const calendarService = {
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
      return data as CalendarEvent[];
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
      return data as CalendarEvent[];
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
      return data as CalendarEvent[];
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
      return data as CalendarEvent;
    } catch (error) {
      console.error('Error fetching event by ID:', error);
      throw error;
    }
  },

  // Create a new event
  createEvent: async (event: Omit<CalendarEvent, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert([{
          ...event,
          start_time: new Date(event.start).toISOString(),
          end_time: event.end ? new Date(event.end).toISOString() : null
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as CalendarEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Update an existing event
  updateEvent: async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      // Format dates if present
      const formattedUpdates = { ...updates };
      if (updates.start) {
        formattedUpdates.start_time = new Date(updates.start).toISOString();
        delete formattedUpdates.start;
      }
      if (updates.end) {
        formattedUpdates.end_time = new Date(updates.end).toISOString();
        delete formattedUpdates.end;
      }

      const { data, error } = await supabase
        .from('calendar_events')
        .update(formattedUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as CalendarEvent;
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

  // Upload a document for an event
  uploadEventDocument: async (eventId: string, file: File) => {
    try {
      const fileName = `${uuid()}-${file.name}`;
      const filePath = `${eventId}/${fileName}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('calendar_attachments')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('calendar_attachments')
        .getPublicUrl(filePath);
      
      // Add record to calendar_event_documents
      const { data, error } = await supabase
        .from('calendar_event_documents')
        .insert([{
          event_id: eventId,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        ...data,
        publicUrl
      };
    } catch (error) {
      console.error('Error uploading event document:', error);
      throw error;
    }
  },

  // Get documents for an event
  getEventDocuments: async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('calendar_event_documents')
        .select('*')
        .eq('event_id', eventId);
      
      if (error) throw error;
      
      // Add public URLs to documents
      const docsWithUrls = await Promise.all(data.map(async (doc) => {
        const { data: { publicUrl } } = supabase.storage
          .from('calendar_attachments')
          .getPublicUrl(doc.file_path);
        
        return {
          ...doc,
          publicUrl
        };
      }));
      
      return docsWithUrls;
    } catch (error) {
      console.error('Error fetching event documents:', error);
      throw error;
    }
  },

  // Delete a document
  deleteEventDocument: async (documentId: string) => {
    try {
      // First get document to get file path
      const { data: doc, error: fetchError } = await supabase
        .from('calendar_event_documents')
        .select('file_path')
        .eq('id', documentId)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('calendar_attachments')
        .remove([doc.file_path]);
      
      if (storageError) throw storageError;
      
      // Delete record
      const { error } = await supabase
        .from('calendar_event_documents')
        .delete()
        .eq('id', documentId);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting event document:', error);
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
      return data as CalendarEvent;
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
