
import { useState, useEffect, useCallback } from 'react';
import { UserPreferences } from '@/types/user';
import { userPreferencesService } from '@/services/userPreferencesService';
import { companySettingsService } from '@/services/companySettingsService';
import { toast } from 'sonner';
import { applySpecificPreferenceToUI } from './settings/apply-preferences';

// Mock current user ID - in a real app, this would come from auth
const CURRENT_USER_ID = 'current-user';

export function useSettings() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [companySettings, setCompanySettings] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user preferences and company settings
  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      try {
        // Load user preferences
        const userPrefs = userPreferencesService.getUserPreferences(CURRENT_USER_ID);
        setPreferences(userPrefs);
        
        // Load company settings
        const settings = await companySettingsService.getCompanySettings();
        setCompanySettings(settings);
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    }
    
    loadSettings();
  }, []);

  // Update a specific preference
  const updatePreference = useCallback(async (
    key: keyof UserPreferences, 
    value: any
  ): Promise<void> => {
    if (!preferences) return Promise.reject('No preferences loaded');
    
    setIsLoading(true);
    
    try {
      console.log(`Updating preference "${key}" with:`, value);
      const updatedPrefs = userPreferencesService.updatePreference(CURRENT_USER_ID, key, value);
      
      // Update the local state with the updated preferences
      setPreferences(updatedPrefs);
      
      // Apply the specific preference to the UI
      applySpecificPreferenceToUI(key, value, updatedPrefs);
      
      return Promise.resolve();
    } catch (error) {
      console.error(`Error updating preference "${key}":`, error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  }, [preferences]);

  // Update multiple preferences at once
  const updatePreferences = useCallback(async (
    updates: Partial<UserPreferences>
  ): Promise<void> => {
    if (!preferences) return Promise.reject('No preferences loaded');
    
    setIsLoading(true);
    
    try {
      console.log('Updating preferences with:', updates);
      const updatedPrefs = userPreferencesService.updateUserPreferences(CURRENT_USER_ID, updates);
      
      // Update the local state with the updated preferences
      setPreferences(updatedPrefs);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error updating preferences:', error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  }, [preferences]);

  // Reset preferences to default
  const resetPreferences = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const defaultPrefs = userPreferencesService.resetPreferences(CURRENT_USER_ID);
      setPreferences(defaultPrefs);
      toast.success('Settings reset to default');
      return Promise.resolve();
    } catch (error) {
      console.error('Error resetting preferences:', error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Update company settings
  const updateCompanySetting = useCallback(async (
    key: string,
    value: any
  ): Promise<void> => {
    setIsLoading(true);
    
    try {
      console.log(`Updating company setting "${key}" with:`, value);
      const updatedSettings = await companySettingsService.updateCompanySetting(key, value);
      
      // Update the local state with the updated settings
      setCompanySettings(updatedSettings);
      
      return Promise.resolve();
    } catch (error) {
      console.error(`Error updating company setting "${key}":`, error);
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Upload company logo
  const uploadCompanyLogo = useCallback(async (
    file: File
  ): Promise<string | null> => {
    setIsLoading(true);
    
    try {
      const logoUrl = await companySettingsService.uploadCompanyLogo(file);
      
      if (logoUrl && companySettings) {
        // Update the local state with the updated logo URL
        setCompanySettings({
          ...companySettings,
          logoUrl
        });
      }
      
      return logoUrl;
    } catch (error) {
      console.error('Error uploading company logo:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [companySettings]);

  return {
    preferences,
    companySettings,
    isLoading,
    updatePreference,
    updatePreferences,
    resetPreferences,
    updateCompanySetting,
    uploadCompanyLogo
  };
}
