
-- SQL to create the calendar_events table
-- This would be executed via a migration in a production environment

CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  all_day BOOLEAN DEFAULT FALSE,
  location TEXT,
  event_type TEXT NOT NULL,
  association_id UUID,
  created_by UUID,
  access_level TEXT NOT NULL DEFAULT 'public',
  color TEXT,
  recurring_pattern JSONB,
  workflow_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_calendar_events_association_id ON public.calendar_events(association_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_time ON public.calendar_events(start_time);
CREATE INDEX IF NOT EXISTS idx_calendar_events_event_type ON public.calendar_events(event_type);

-- Add RLS policies
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Policy for creating events
CREATE POLICY calendar_events_insert_policy ON public.calendar_events
  FOR INSERT WITH CHECK (true);

-- Policy for reading events
CREATE POLICY calendar_events_select_policy ON public.calendar_events
  FOR SELECT USING (true);

-- Policy for updating events
CREATE POLICY calendar_events_update_policy ON public.calendar_events
  FOR UPDATE USING (created_by = auth.uid() OR auth.uid() IN (
    SELECT user_id FROM user_roles 
    WHERE role = 'admin' OR role = 'manager'
  ));

-- Policy for deleting events
CREATE POLICY calendar_events_delete_policy ON public.calendar_events
  FOR DELETE USING (created_by = auth.uid() OR auth.uid() IN (
    SELECT user_id FROM user_roles 
    WHERE role = 'admin' OR role = 'manager'
  ));
