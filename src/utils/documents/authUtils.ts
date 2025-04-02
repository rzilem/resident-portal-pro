
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if a user is authenticated
 * @returns Promise<boolean> True if user is authenticated
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return !!data.session?.user;
};

/**
 * Get the current user's ID
 * @returns Promise<string|null> User ID if authenticated, null otherwise
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id || null;
};

/**
 * Check if the current user is using demo credentials
 * @returns Promise<boolean> Always returns false as demo mode is disabled
 */
export const isUsingDemoCredentials = async (): Promise<boolean> => {
  // Demo mode is disabled
  return false;
};
