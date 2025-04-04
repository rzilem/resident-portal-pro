
-- Create table for communications
CREATE TABLE IF NOT EXISTS public.communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_type TEXT NOT NULL CHECK (message_type IN ('email', 'sms', 'portal')),
  subject TEXT,
  content TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('html', 'plain')),
  status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'scheduled', 'failed')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sender_id UUID REFERENCES auth.users(id),
  recipient_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for communication recipients
CREATE TABLE IF NOT EXISTS public.communication_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  communication_id UUID REFERENCES public.communications(id) ON DELETE CASCADE,
  recipient_identifier TEXT NOT NULL,
  opened_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_recipients ENABLE ROW LEVEL SECURITY;

-- Policy for communications table
CREATE POLICY "Users can view their own communications" 
  ON public.communications 
  FOR SELECT 
  USING (auth.uid() = sender_id);

CREATE POLICY "Users can create their own communications" 
  ON public.communications 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

-- Policy for communication_recipients table
CREATE POLICY "Users can view recipients for their own communications" 
  ON public.communication_recipients 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.communications c 
    WHERE c.id = communication_id AND c.sender_id = auth.uid()
  ));

CREATE POLICY "Users can add recipients to their own communications" 
  ON public.communication_recipients 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.communications c 
    WHERE c.id = communication_id AND c.sender_id = auth.uid()
  ));
