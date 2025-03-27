
/**
 * Authentication utilities for document management
 */

import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if authenticated
 */
export const isUserAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: sessionData, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
    
    const isAuthenticated = !!sessionData.session?.user;
    
    if (!isAuthenticated) {
      console.log('User is not authenticated');
    }
    
    return isAuthenticated;
  } catch (error) {
    console.error('Exception in isUserAuthenticated:', error);
    return false;
  }
};

/**
 * Get current user ID
 * @returns {Promise<string | null>} User ID or null if not authenticated
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data: sessionData, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting user session:', error);
      return null;
    }
    
    return sessionData.session?.user?.id || null;
  } catch (error) {
    console.error('Exception in getCurrentUserId:', error);
    return null;
  }
};

/**
 * Require authentication or show error
 * @param {string} actionName - Name of action requiring authentication
 * @returns {Promise<boolean>} True if authenticated
 */
export const requireAuth = async (actionName: string = 'perform this action'): Promise<boolean> => {
  const isAuthenticated = await isUserAuthenticated();
  
  if (!isAuthenticated) {
    toast.error(`Please sign in to ${actionName}`);
    return false;
  }
  
  return true;
};

/**
 * Get user profile data
 * @returns {Promise<any>} User profile or null
 */
export const getUserProfile = async (): Promise<any | null> => {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception in getUserProfile:', error);
    return null;
  }
};

/**
 * Check if user has required role
 * @param {string[]} allowedRoles - Roles that are allowed
 * @returns {Promise<boolean>} True if user has allowed role
 */
export const hasRequiredRole = async (allowedRoles: string[]): Promise<boolean> => {
  try {
    const profile = await getUserProfile();
    
    if (!profile) {
      return false;
    }
    
    return allowedRoles.includes(profile.role);
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};
