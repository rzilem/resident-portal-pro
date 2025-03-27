
/**
 * Authentication utility functions for document operations
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Check if a user is currently authenticated
 * @returns Promise<boolean> True if a user is authenticated
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
  
  return !!data.session;
};

/**
 * Get the current user's ID
 * @returns Promise<string|null> The user ID or null if not authenticated
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error || !data.session) {
    return null;
  }
  
  return data.session.user.id;
};

/**
 * Check if the current session is using demo credentials
 * @returns Promise<boolean> True if using demo credentials
 */
export const isUsingDemoCredentials = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  
  if (!data.session) {
    return false;
  }
  
  const email = data.session.user.email;
  return !!email && email.includes('demo') && email.endsWith('.example.com');
};

/**
 * Get the current user's role
 * @returns Promise<string|null> The user role or null if not authenticated
 */
export const getUserRole = async (): Promise<string | null> => {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !sessionData.session) {
    return null;
  }
  
  const userId = sessionData.session.user.id;
  
  // Get role from profile
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();
  
  if (profileError || !profileData) {
    return null;
  }
  
  return profileData.role;
};
