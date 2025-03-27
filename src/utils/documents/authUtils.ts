
/**
 * Auth utility functions for document management
 */

import { supabase } from '@/integrations/supabase/client';
import { debugLog, errorLog } from '@/utils/debug';

/**
 * Check if user is authenticated with Supabase
 * @returns Promise<boolean> True if authenticated
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      errorLog("Error checking authentication:", error);
      return false;
    }
    
    if (!session) {
      debugLog("No active session found");
      return false;
    }
    
    return true;
  } catch (error) {
    errorLog("Exception in isUserAuthenticated:", error);
    return false;
  }
};

/**
 * Get current user ID
 * @returns Promise<string|null> User ID if authenticated, null otherwise
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return null;
    }
    
    return session.user.id;
  } catch (error) {
    errorLog("Exception in getCurrentUserId:", error);
    return null;
  }
};

/**
 * Check if current user is using demo credentials
 * @returns Promise<boolean> True if using demo credentials
 */
export const isUsingDemoCredentials = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return false;
    }
    
    // Check if email contains 'demo' or user has a demo flag in metadata
    const isDemoEmail = session.user.email?.toLowerCase().includes('demo') || false;
    const isDemoUser = session.user.user_metadata?.is_demo === true;
    
    return isDemoEmail || isDemoUser;
  } catch (error) {
    errorLog("Exception in isUsingDemoCredentials:", error);
    return false;
  }
};
