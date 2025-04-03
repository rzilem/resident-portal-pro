
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const initialLoadComplete = useRef(false);

  // Function to load settings that can be called from anywhere
  const loadSettings = useCallback(async () => {
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
          
          // Store logo URL in localStorage for immediate access across components
          if (companySettings.logoUrl) {
            infoLog('Logo URL found:', companySettings.logoUrl);
            localStorage.setItem('company_logo_url', companySettings.logoUrl);
            // Dispatch event to notify components
            window.dispatchEvent(new Event('logoUpdate'));
          }
        } else {
          infoLog('No company settings found, using defaults');
        }
      } catch (error) {
        errorLog('Error loading company settings:', error);
      } finally {
        setIsLoading(false);
        initialLoadComplete.current = true;
      }
    } else {
      infoLog('User not authenticated, using default settings');
      setIsLoading(false);
      initialLoadComplete.current = true;
    }
  }, [isAuthenticated, user?.id]);

  // Load settings when the component mounts or auth state changes
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Handle storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'company_settings_timestamp' && initialLoadComplete.current) {
        infoLog('Company settings updated in another tab, reloading');
        loadSettings();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadSettings]);

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
    
    // Immediately update logo in localStorage if it's being changed
    if (key === 'logoUrl') {
      if (value) {
        localStorage.setItem('company_logo_url', value);
      } else {
        localStorage.removeItem('company_logo_url');
      }
      // Notify components of logo change
      window.dispatchEvent(new Event('logoUpdate'));
    }
    
    try {
      const success = await companySettingsService.updateCompanySetting(user.id, key, value);
      if (success) {
        // Refresh settings after update to ensure consistency
        await loadSettings();
        return true;
      } else {
        // Revert local state if server update failed
        await loadSettings();
        return false;
      }
    } catch (error) {
      errorLog('Error updating company setting:', error);
      toast.error('Failed to update setting');
      return false;
    }
  }, [isAuthenticated, user?.id, loadSettings]);

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
      
      // Update localStorage immediately
      localStorage.setItem('company_logo_url', logoUrl);
      
      // Notify components of logo change
      window.dispatchEvent(new Event('logoUpdate'));
      
      // Force a refresh to ensure all components have the latest data
      await loadSettings();
    } else {
      errorLog('Logo upload failed');
    }
    
    return logoUrl;
  }, [isAuthenticated, user?.id, loadSettings]);

  const getSetting = useCallback((key: keyof CompanySettings) => {
    return settings[key] || '';
  }, [settings]);

  return {
    settings,
    isLoading,
    updateSetting,
    uploadLogo,
    getSetting,
    refreshSettings: loadSettings // Expose the refresh function
  };
};
