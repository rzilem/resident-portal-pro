
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { companySettingsService } from '@/services/settingsService';

export function useCompanySettings() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch company settings
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = companySettingsService.getCompanySettings();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch company settings'));
      toast.error('Failed to load company settings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update company settings
  const updateSettings = useCallback(async (updates: Record<string, any>) => {
    try {
      const updatedSettings = companySettingsService.updateCompanySettings(updates);
      setSettings(updatedSettings);
      toast.success('Company settings updated successfully');
      return updatedSettings;
    } catch (err) {
      toast.error('Failed to update company settings');
      throw err;
    }
  }, []);

  // Update a specific setting
  const updateSetting = useCallback(async (key: string, value: any) => {
    try {
      const updatedSettings = companySettingsService.updateCompanySetting(key, value);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      toast.error(`Failed to update ${key}`);
      throw err;
    }
  }, []);

  // Get a specific setting with fallback
  const getSetting = useCallback((key: string, fallback: any = '') => {
    return settings[key] ?? fallback;
  }, [settings]);

  // Load settings on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    updateSetting,
    getSetting,
    fetchSettings
  };
}
