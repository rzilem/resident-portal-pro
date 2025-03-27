
/**
 * Utility functions for authentication in document operations
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Check if current user is authenticated
 * @returns {Promise<boolean>} True if authenticated
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
    
    return !!session?.user;
  } catch (error) {
    console.error('Exception checking authentication status:', error);
    return false;
  }
};

/**
 * Get the current user ID if authenticated
 * @returns {Promise<string | null>} User ID or null if not authenticated
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session?.user) {
      return null;
    }
    
    return session.user.id;
  } catch (error) {
    console.error('Exception getting current user ID:', error);
    return null;
  }
};
