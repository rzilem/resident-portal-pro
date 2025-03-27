
import { supabase } from '@/integrations/supabase/client';
import { isDemoAuthenticated } from '@/utils/auth/demoAuth';

/**
 * Check if the current user is authenticated
 * @returns Promise<boolean> Authentication status
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth error:', error);
      return false;
    }
    
    return !!data.session;
  } catch (error) {
    console.error('Unexpected auth error:', error);
    return false;
  }
};

/**
 * Get the current user's ID
 * @returns Promise<string | null> User ID or null
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      return null;
    }
    
    return data.session.user.id;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

/**
 * Check if the user is using demo credentials
 * @returns Promise<boolean> True if using demo credentials
 */
export const isUsingDemoCredentials = async (): Promise<boolean> => {
  // Check if the user is using the demo authentication mode
  return isDemoAuthenticated();
};
