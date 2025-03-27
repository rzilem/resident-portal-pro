
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a user is authenticated
 * @returns Promise<boolean> True if authenticated
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking authentication:', error.message);
      return false;
    }
    
    return !!data.session;
  } catch (error) {
    console.error('Unexpected error checking auth:', error);
    return false;
  }
};

/**
 * Get the current user ID
 * @returns Promise<string|null> User ID or null
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
 * Get the current user's email
 * @returns Promise<string|null> User email or null
 */
export const getCurrentUserEmail = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      return null;
    }
    
    return data.session.user.email;
  } catch (error) {
    console.error('Error getting user email:', error);
    return null;
  }
};

/**
 * Check if the user has a specific role
 * @param roles Array of roles to check against
 * @returns Promise<boolean> True if user has one of the roles
 */
export const hasRole = async (roles: string[]): Promise<boolean> => {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      return false;
    }
    
    return roles.includes(data.role);
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};

/**
 * Check if current user is using demo credentials
 * @returns Promise<boolean> True if using demo credentials
 */
export const isUsingDemoCredentials = async (): Promise<boolean> => {
  const email = await getCurrentUserEmail();
  return email === 'demo@example.com';
};
