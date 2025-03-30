import { supabase } from '@/integrations/supabase/client';
import { debugLog } from '@/utils/debug';
import { isDemoAuthenticated } from '@/utils/auth/demoAuth';

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

/**
 * Check if using demo credentials
 * @returns Promise<boolean> True if using demo credentials
 */
export const isUsingDemoCredentials = async (): Promise<boolean> => {
  // First check if using demo authentication
  if (isDemoAuthenticated()) {
    return true;
  }
  
  // Otherwise check for regular authentication
  try {
    const isAuthenticated = await isUserAuthenticated();
    if (!isAuthenticated) {
      return false;
    }
    
    // You can add additional checks here to determine if the user
    // is using demo credentials based on your application's logic
    
    return false;
  } catch (error) {
    console.error('Error checking for demo credentials:', error);
    return false;
  }
};
