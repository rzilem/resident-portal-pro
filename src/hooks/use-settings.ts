
import { useState, useEffect, useCallback } from 'react';
import { UserPreferences } from '@/types/user';
import { userPreferencesService } from '@/services/userPreferencesService';
import { toast } from 'sonner';

// Mock current user ID - in a real app, this would come from auth
const CURRENT_USER_ID = 'current-user';

export function useSettings() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user preferences
  useEffect(() => {
    try {
      const userPrefs = userPreferencesService.getUserPreferences(CURRENT_USER_ID);
      setPreferences(userPrefs);
    } catch (error) {
      console.error('Error loading user preferences:', error);
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update a specific preference
  const updatePreference = useCallback(async (
    key: keyof UserPreferences, 
    value: any
  ): Promise<void> => {
    if (!preferences) return;
    
    try {
      console.log(`Updating preference "${key}" with:`, value);
      const updatedPrefs = userPreferencesService.updatePreference(CURRENT_USER_ID, key, value);
      
      // Important: Update the local state with the updated preferences
      setPreferences(updatedPrefs);
      
      return Promise.resolve();
    } catch (error) {
      console.error(`Error updating preference "${key}":`, error);
      toast.error('Failed to save settings');
      return Promise.reject(error);
    }
  }, [preferences]);

  // Update multiple preferences at once
  const updatePreferences = useCallback(async (
    updates: Partial<UserPreferences>
  ): Promise<void> => {
    if (!preferences) return;
    
    try {
      console.log('Updating preferences with:', updates);
      const updatedPrefs = userPreferencesService.updateUserPreferences(CURRENT_USER_ID, updates);
      
      // Important: Update the local state with the updated preferences
      setPreferences(updatedPrefs);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to save settings');
      return Promise.reject(error);
    }
  }, [preferences]);

  // Reset preferences to default
  const resetPreferences = useCallback(async (): Promise<void> => {
    try {
      const defaultPrefs = userPreferencesService.resetPreferences(CURRENT_USER_ID);
      setPreferences(defaultPrefs);
      toast.success('Settings reset to default');
      return Promise.resolve();
    } catch (error) {
      console.error('Error resetting preferences:', error);
      toast.error('Failed to reset settings');
      return Promise.reject(error);
    }
  }, []);

  return {
    preferences,
    isLoading,
    updatePreference,
    updatePreferences,
    resetPreferences
  };
}
