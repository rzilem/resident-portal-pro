
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if the current user is authenticated
 * @returns Promise<boolean> True if authenticated
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error checking auth status:', error);
      return false;
    }
    return !!data.session;
  } catch (error) {
    console.error('Exception checking auth status:', error);
    return false;
  }
};

/**
 * Get the current user's ID
 * @returns Promise<string | null> User ID or null if not authenticated
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      return null;
    }
    return data.session.user.id;
  } catch (error) {
    console.error('Exception getting user ID:', error);
    return null;
  }
};
