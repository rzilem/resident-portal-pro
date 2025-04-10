
import { createClient } from '@supabase/supabase-js';

// Use import.meta.env for Vite projects instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eqbbnewrorxilukaocjx.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxYmJuZXdyb3J4aWx1a2FvY2p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMDk1OTksImV4cCI6MjA1ODU4NTU5OX0.VR0HEuV67Sp6js9tujvAqut0uf6342baidyAvQLwKaQ';

// Configure the Supabase client with explicit auth configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  }
});

// Export a function to check authentication status
export async function checkAuth() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error checking auth:', error);
    return false;
  }
  return !!data.session;
}
