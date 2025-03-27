
/**
 * Utility functions for authentication in document operations
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isDemoAuthenticated } from '@/utils/auth/demoAuth';

/**
 * Check if current user is authenticated
 * @returns {Promise<boolean>} True if authenticated
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  try {
    // First check if using demo credentials
    if (isDemoAuthenticated()) {
      console.log('User authenticated via demo credentials');
      return true;
    }
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking authentication status:', error);
      toast.error('Authentication error: Please try logging in again');
      return false;
    }
    
    // Check if we have a valid session
    if (!session?.user) {
      console.log('No active session found');
      return false;
    }
    
    console.log('User authenticated as:', session.user.email);
    return true;
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
  // First check if using demo credentials
  if (isDemoAuthenticated()) {
    console.log('Using mock user ID for demo user');
    return 'demo-user-id';
  }
  
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

/**
 * Check if the user is using demo credentials
 * This allows special handling for the demo user who might not have a proper Supabase auth session
 * @returns {Promise<boolean>} True if using demo credentials
 */
export const isUsingDemoCredentials = async (): Promise<boolean> => {
  return isDemoAuthenticated();
};

/**
 * Special fallback authentication check that also supports demo users
 * @returns {Promise<boolean>} True if authenticated through any method
 */
export const isAuthenticatedIncludingDemo = async (): Promise<boolean> => {
  // Check if using demo credentials first
  if (isDemoAuthenticated()) {
    return true;
  }
  
  // Check normal authentication
  return await isUserAuthenticated();
};
