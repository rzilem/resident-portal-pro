
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if a user is authenticated
 * @returns Promise<boolean> True if user is authenticated
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
  return !!data.session?.user;
};

/**
 * Get the current user's ID
 * @returns Promise<string|null> User ID if authenticated, null otherwise
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
  return data.session?.user?.id || null;
};

/**
 * Check if the current user is using demo credentials - ALWAYS returns false
 * Demo mode is fully disabled
 * @returns Promise<boolean> Always returns false
 */
export const isUsingDemoCredentials = async (): Promise<boolean> => {
  return false;
};
