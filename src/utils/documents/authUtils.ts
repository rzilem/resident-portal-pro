
import { supabase } from '@/integrations/supabase/client';
import { isDemoMode } from '@/utils/auth/demoAuth';

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
 * @returns Promise<boolean> True if using demo credentials
 */
export const isUsingDemoCredentials = async (): Promise<boolean> => {
  // Use the isDemoMode function from demoAuth.ts
  return isDemoMode();
};
