
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { companySettingsService } from '@/services/companySettingsService';
import { toast } from 'sonner';

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
          const companySettings = await companySettingsService.getCompanySettings(user.id);
          if (companySettings) {
            setSettings(companySettings);
            
            // Update document title when company name changes
            if (companySettings.companyName) {
              document.title = companySettings.companyName;
            }
          }
        } catch (error) {
          console.error('Error loading company settings:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
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

    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Update document title when company name changes
    if (key === 'companyName' && value) {
      document.title = value;
    }
    
    try {
      await companySettingsService.updateCompanySetting(user.id, key, value);
      toast.success('Setting updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating company setting:', error);
      toast.error('Failed to update setting');
      return false;
    }
  }, [isAuthenticated, user?.id]);

  const uploadLogo = useCallback(async (file: File) => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to upload a logo');
      return null;
    }

    const logoUrl = await companySettingsService.uploadCompanyLogo(file);
    
    if (logoUrl) {
      setSettings(prev => ({ ...prev, logoUrl }));
    }
    
    return logoUrl;
  }, [isAuthenticated]);

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
