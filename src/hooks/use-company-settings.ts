
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { companySettingsService } from '@/services/companySettingsService';
import { toast } from 'sonner';
import { infoLog, errorLog } from '@/utils/debug';

export interface CompanySettings {
  logoUrl: string | null;
  companyName: string;
  taxId?: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  [key: string]: any; // Allow for dynamic keys
}

export const useCompanySettings = () => {
  const [settings, setSettings] = useState<CompanySettings>({
    logoUrl: null,
    companyName: 'ResidentPro'
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadSettings = async () => {
      if (isAuthenticated && user?.id) {
        setIsLoading(true);
        try {
          infoLog('Loading company settings for user:', user.id);
          const companySettings = await companySettingsService.getCompanySettings(user.id);
          
          if (companySettings) {
            infoLog('Company settings loaded:', companySettings);
            setSettings(companySettings);
            
            // Update document title when company name changes
            if (companySettings.companyName) {
              document.title = companySettings.companyName;
            }
            
            // Verify logo URL is valid if present
            if (companySettings.logoUrl) {
              infoLog('Logo URL found:', companySettings.logoUrl);
            }
          } else {
            infoLog('No company settings found, using defaults');
          }
        } catch (error) {
          errorLog('Error loading company settings:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        infoLog('User not authenticated, using default settings');
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [isAuthenticated, user?.id]);

  const updateSetting = useCallback(async (key: string, value: any) => {
    if (!isAuthenticated || !user?.id) {
      toast.error('You must be logged in to update settings');
      return false;
    }

    infoLog(`Updating company setting: ${key}`, value);
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Update document title when company name changes
    if (key === 'companyName' && value) {
      document.title = value;
    }
    
    try {
      const success = await companySettingsService.updateCompanySetting(user.id, key, value);
      if (success) {
        // Refresh settings after update to ensure consistency
        const updatedSettings = await companySettingsService.getCompanySettings(user.id);
        if (updatedSettings) {
          setSettings(updatedSettings);
          infoLog('Settings refreshed after update:', updatedSettings);
        }
        return true;
      } else {
        // Revert local state if server update failed
        const currentSettings = await companySettingsService.getCompanySettings(user.id);
        if (currentSettings) {
          setSettings(currentSettings);
        }
        return false;
      }
    } catch (error) {
      errorLog('Error updating company setting:', error);
      toast.error('Failed to update setting');
      return false;
    }
  }, [isAuthenticated, user?.id]);

  const uploadLogo = useCallback(async (file: File) => {
    if (!isAuthenticated || !user?.id) {
      toast.error('You must be logged in to upload a logo');
      return null;
    }

    infoLog('Uploading logo', file.name);
    const logoUrl = await companySettingsService.uploadCompanyLogo(file);
    
    if (logoUrl) {
      infoLog('Logo uploaded successfully, setting state:', logoUrl);
      setSettings(prev => ({ ...prev, logoUrl }));
      
      // Explicitly update the setting in the database to ensure it's saved
      await companySettingsService.updateCompanySetting(user.id, 'logoUrl', logoUrl);
      
      // Verify setting was saved by refreshing settings
      const updatedSettings = await companySettingsService.getCompanySettings(user.id);
      if (updatedSettings && updatedSettings.logoUrl === logoUrl) {
        infoLog('Logo URL verified in settings:', updatedSettings.logoUrl);
      } else {
        errorLog('Logo URL verification failed. Expected:', logoUrl, 'Got:', updatedSettings?.logoUrl);
      }
    } else {
      errorLog('Logo upload failed');
    }
    
    return logoUrl;
  }, [isAuthenticated, user?.id]);

  const getSetting = useCallback((key: keyof CompanySettings) => {
    return settings[key] || '';
  }, [settings]);

  return {
    settings,
    isLoading,
    updateSetting,
    uploadLogo,
    getSetting
  };
};
