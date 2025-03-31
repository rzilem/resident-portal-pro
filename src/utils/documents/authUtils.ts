
/**
 * Authentication utilities for document management
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Get the current user's ID
 * @returns Promise<string | null> The user ID or null if not authenticated
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || null;
  } catch (error) {
    console.error('Error getting current user ID:', error);
    return null;
  }
};

/**
 * Check if the current user is using demo credentials
 * @returns Promise<boolean> True if using demo credentials
 */
export const isUsingDemoCredentials = async (): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return true; // No user session = demo mode
    
    // Check if the user has a specific demo flag in metadata
    const isDemo = session.user.user_metadata?.demo === true;
    
    // Alternative check: email domain or specific pattern
    const isDemoEmail = session.user.email?.includes('demo') || 
                       session.user.email?.includes('example.com');
    
    return isDemo || !!isDemoEmail;
  } catch (error) {
    console.error('Error checking demo credentials:', error);
    return false;
  }
};

/**
 * Get the current user's role
 * @returns Promise<string | null> The user role or null if not authenticated
 */
export const getCurrentUserRole = async (): Promise<string | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;
    
    // Check if role is in user metadata
    const roleFromMetadata = session.user.user_metadata?.role;
    if (roleFromMetadata) return roleFromMetadata;
    
    // If not in metadata, try to get it from the profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (error || !profile) {
      console.error('Error fetching user role from profile:', error);
      return null;
    }
    
    return profile.role;
  } catch (error) {
    console.error('Error getting current user role:', error);
    return null;
  }
};
