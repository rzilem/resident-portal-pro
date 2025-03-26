
import { supabase } from '@/integrations/supabase/client';
import { removeUserFromCache } from './types';

export const userDeletionService = {
  deleteUser: async (id: string): Promise<void> => {
    try {
      // Delete the user from Supabase Auth (will cascade delete the profile)
      const { error } = await supabase.auth.admin.deleteUser(id);
      
      if (error) {
        console.error('Error deleting user from Supabase:', error);
        // Fallback to local implementation
        removeUserFromCache(id);
        return;
      }
      
      // Remove from local cache as well
      removeUserFromCache(id);
    } catch (error) {
      console.error('Error in deleteUser:', error);
      // Fallback to local implementation
      removeUserFromCache(id);
    }
  }
};
