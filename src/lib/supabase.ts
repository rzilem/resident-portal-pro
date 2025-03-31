
import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise use fallback values for dev
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eqbbnewrorxilukaocjx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxYmJuZXdyb3J4aWx1a2FvY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMDk1OTksImV4cCI6MjA1ODU4NTU5OX0.VR0HEuV67Sp6js9tujvAqut0uf6342baidyAvQLwKaQ';

export const supabase = createClient(supabaseUrl, supabaseKey);
