
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { settingsService } from '@/services/settingsService';
import { UserPreferences } from '@/types/user';

export function useSettings(userId: string = 'current-user') {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user preferences
  const fetchPreferences = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = settingsService.getUserPreferences(userId);
      setPreferences(data);
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
      const updatedPreferences = settingsService.updateUserPreferences(userId, updates);
      setPreferences(updatedPreferences);
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
      const updatedPreferences = settingsService.updatePreference(userId, key, value);
      setPreferences(updatedPreferences);
      toast.success(`${key} updated successfully`);
      return updatedPreferences;
    } catch (err) {
      toast.error(`Failed to update ${key}`);
      throw err;
    }
  }, [userId]);

  // Reset preferences to default
  const resetPreferences = useCallback(async () => {
    try {
      const defaultPreferences = settingsService.resetPreferences(userId);
      setPreferences(defaultPreferences);
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
