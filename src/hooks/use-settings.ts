
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { userPreferencesService } from '@/services/userPreferencesService';
import { UserPreferences } from '@/types/user';
import { applyPreferencesToUI, applySpecificPreferenceToUI } from './settings/apply-preferences';

export function useSettings(userId: string = 'current-user') {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user preferences
  const fetchPreferences = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = userPreferencesService.getUserPreferences(userId);
      setPreferences(data);

      // Apply saved preferences to the UI on initial load
      if (data) {
        applyPreferencesToUI(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch preferences'));
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Update user preferences
  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    try {
      const updatedPreferences = userPreferencesService.updateUserPreferences(userId, updates);
      setPreferences(updatedPreferences);
      
      // Apply updated preferences to UI
      applyPreferencesToUI(updatedPreferences);
      
      toast.success('Settings updated successfully');
      return updatedPreferences;
    } catch (err) {
      toast.error('Failed to update settings');
      throw err;
    }
  }, [userId]);

  // Update a specific preference
  const updatePreference = useCallback(async (key: keyof UserPreferences, value: any) => {
    try {
      const updatedPreferences = userPreferencesService.updatePreference(userId, key, value);
      setPreferences(updatedPreferences);
      
      // Apply the specific updated preference to UI
      applySpecificPreferenceToUI(key, value, updatedPreferences);
      
      return updatedPreferences;
    } catch (err) {
      toast.error(`Failed to update ${key}`);
      throw err;
    }
  }, [userId]);

  // Reset preferences to default
  const resetPreferences = useCallback(async () => {
    try {
      const defaultPreferences = userPreferencesService.resetPreferences(userId);
      setPreferences(defaultPreferences);
      
      // Apply default preferences to UI
      applyPreferencesToUI(defaultPreferences);
      
      toast.success('Settings reset to default');
      return defaultPreferences;
    } catch (err) {
      toast.error('Failed to reset settings');
      throw err;
    }
  }, [userId]);

  // Load preferences on mount
  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    updatePreference,
    resetPreferences,
    fetchPreferences
  };
}
