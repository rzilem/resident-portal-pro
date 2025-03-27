
/**
 * Authentication utilities for document storage
 */
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if user is authenticated
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  const { data: sessionData } = await supabase.auth.getSession();
  return !!sessionData.session?.user;
};
