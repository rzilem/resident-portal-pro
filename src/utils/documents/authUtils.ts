
/**
 * Utility functions for authentication in document operations
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Check if current user is authenticated
 * @returns {Promise<boolean>} True if authenticated
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  try {
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
  // First check for a proper session
  const { data: { session } } = await supabase.auth.getSession();
  
  // If we have a proper session with email matching demo credentials
  if (session?.user?.email === 'admin@residentpro.com') {
    return true;
  }
  
  // Also check localStorage for legacy auth state
  const storedEmail = localStorage.getItem('userEmail');
  return storedEmail === 'admin@residentpro.com';
};

/**
 * Special fallback authentication check that also supports demo users
 * @returns {Promise<boolean>} True if authenticated through any method
 */
export const isAuthenticatedIncludingDemo = async (): Promise<boolean> => {
  // Check normal authentication first
  const isNormallyAuthenticated = await isUserAuthenticated();
  if (isNormallyAuthenticated) {
    return true;
  }
  
  // Fallback to demo authentication
  return await isUsingDemoCredentials();
};
