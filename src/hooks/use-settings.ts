import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { toast } from "sonner";
import { userPreferencesService } from '@/services/userPreferencesService';
import { companySettingsService } from '@/services/companySettingsService';

interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  cardStyle?: 'default' | 'flat' | 'glass' | 'rounded';
  colorMode?: 'default' | 'grayscale' | 'high-contrast';
  fontSize?: 'small' | 'medium' | 'large';
  dashboardLayout?: any;
  dashboardWidgets?: any[];
  dashboardColumns?: number;
  databaseHomeownerColumns?: any[];
  tableDensity?: 'compact' | 'default' | 'spacious';
  notificationsEnabled?: boolean;
  documentCategories?: any[];
  logoUrl?: string | null;
  companyName?: string;
  [key: string]: any;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  cardStyle: 'default',
  colorMode: 'default',
  fontSize: 'medium',
  dashboardLayout: null,
  dashboardWidgets: [],
  dashboardColumns: 2,
  databaseHomeownerColumns: [],
  tableDensity: 'default',
  notificationsEnabled: true,
  documentCategories: [],
  logoUrl: null,
  companyName: 'ResidentPro'
};

export const useSettings = () => {
  const { user, isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      if (isAuthenticated && user?.id) {
        setIsLoading(true);
        try {
          const storedPreferences = await userPreferencesService.getPreferences(user.id);
          
          if (storedPreferences) {
            console.log('Loaded preferences from Supabase:', storedPreferences);
            setPreferences({ ...defaultPreferences, ...storedPreferences });
          } else {
            console.log('No stored preferences found, using defaults');
            setPreferences(defaultPreferences);
          }
        } catch (error) {
          console.error('Error loading preferences:', error);
          toast.error('Failed to load preferences');
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('Not authenticated, using default preferences');
        setPreferences(defaultPreferences);
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [isAuthenticated, user?.id]);

  const savePreferences = useCallback(async (newPreferences: Partial<UserPreferences>) => {
    setPreferences(current => ({ ...current, ...newPreferences }));
    
    if (isAuthenticated && user?.id) {
      const updatedPreferences = { ...preferences, ...newPreferences };
      console.log('Saving preferences to Supabase:', updatedPreferences);
      await userPreferencesService.savePreferences(user.id, updatedPreferences);
    } else {
      console.log('Not authenticated, preferences only saved locally');
    }
  }, [preferences, isAuthenticated, user?.id]);

  const updatePreference = useCallback(async (key: string, value: any) => {
    setPreferences(current => ({ ...current, [key]: value }));
    
    if (isAuthenticated && user?.id) {
      const updatedPreferences = { ...preferences, [key]: value };
      console.log(`Saving preference update to Supabase: ${key}=`, value);
      await userPreferencesService.savePreferences(user.id, updatedPreferences);
    } else {
      console.log('Not authenticated, preference only saved locally');
    }
  }, [preferences, isAuthenticated, user?.id]);

  const uploadCompanyLogo = useCallback(async (file: File): Promise<string | null> => {
    if (!isAuthenticated || !user?.id) {
      toast.error('You must be logged in to upload a logo');
      return null;
    }

    try {
      return await companySettingsService.uploadCompanyLogo(file);
    } catch (error) {
      console.error('Error uploading company logo:', error);
      return null;
    }
  }, [isAuthenticated, user?.id]);

  const updateCompanySetting = updatePreference;

  const companySettings = {
    logoUrl: preferences.logoUrl,
    companyName: preferences.companyName
  };

  return {
    preferences,
    companySettings,
    isLoading,
    savePreferences,
    updatePreference,
    uploadCompanyLogo,
    updateCompanySetting
  };
};
