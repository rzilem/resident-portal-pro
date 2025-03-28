
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Service for managing user preferences in Supabase
 */
export const userPreferencesService = {
  /**
   * Saves user preferences to Supabase
   * @param userId - The user's ID
   * @param preferences - The preferences object to save
   */
  async savePreferences(userId: string, preferences: any): Promise<void> {
    if (!userId) {
      console.error('Cannot save preferences: No user ID provided');
      return;
    }

    try {
      console.log('Saving preferences for user:', userId);
      
      // First check if the user already has preferences
      const { data: existing } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (existing) {
        // Update existing preferences
        const { error } = await supabase
          .from('user_preferences')
          .update({ 
            preference_data: preferences,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
        
        if (error) throw error;
        console.log('Preferences updated successfully');
      } else {
        // Insert new preferences
        const { error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: userId,
            preference_data: preferences
          });
        
        if (error) throw error;
        console.log('Preferences created successfully');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    }
  },

  /**
   * Retrieves user preferences from Supabase
   * @param userId - The user's ID
   * @returns The user preferences or null if not found
   */
  async getPreferences(userId: string): Promise<any | null> {
    if (!userId) {
      console.error('Cannot get preferences: No user ID provided');
      return null;
    }

    try {
      console.log('Getting preferences for user:', userId);
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('preference_data')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data) {
        console.log('Retrieved preferences:', data.preference_data);
        return data.preference_data;
      }
      
      console.log('No preferences found for user');
      return null;
    } catch (error) {
      console.error('Error getting preferences:', error);
      toast.error('Failed to load preferences');
      return null;
    }
  }
};
