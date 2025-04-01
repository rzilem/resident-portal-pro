
import { supabase } from '@/integrations/supabase/client';

/**
 * Gets the current user ID
 * @returns User ID as string or null if not logged in
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      console.error('Error getting user session:', error);
      return null;
    }
    
    return data.session.user.id;
  } catch (error) {
    console.error('Exception in getCurrentUserId:', error);
    return null;
  }
};

/**
 * Checks if user is using demo credentials
 * @returns Boolean indicating if using demo credentials
 */
export const isUsingDemoCredentials = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getSession();
    
    // Check if using a demo account (customize this logic based on how you identify demo users)
    const email = data.session?.user.email || '';
    return email.includes('demo') || email.includes('test');
  } catch (error) {
    console.error('Exception in isUsingDemoCredentials:', error);
    return false;
  }
};

/**
 * Check if demo mode is active
 * @returns Boolean indicating if demo mode is active
 */
export const isDemoMode = (): boolean => {
  // This is a client-side check that can be overridden with environment variables or other config
  return false;
};
