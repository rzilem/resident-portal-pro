
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if user is authenticated
 * @returns Promise<boolean> True if authenticated
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    return !!data.session && !error;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Get current user ID
 * @returns Promise<string | null> User ID or null if not authenticated
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id || null;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
};

/**
 * Check if the current session is using demo credentials
 * @returns Promise<boolean> True if using demo credentials
 */
export const isUsingDemoCredentials = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getSession();
    const email = data.session?.user?.email;
    
    // Check if this is a demo account
    return !!email && (
      email.includes('demo') || 
      email.endsWith('@example.com') || 
      email.includes('test-')
    );
  } catch (error) {
    console.error('Error checking demo credentials:', error);
    return false;
  }
};
