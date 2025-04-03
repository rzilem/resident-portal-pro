
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
  voiceGreetingEnabled?: boolean;
  voiceGreetingType?: 'default' | 'custom' | 'preset';
  customGreeting?: string;
  selectedPresetGreeting?: string;
  lastGreetingTime?: string | null;
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
  companyName: 'ResidentPro',
  voiceGreetingEnabled: true,
  voiceGreetingType: 'default',
  customGreeting: null,
  selectedPresetGreeting: null,
  lastGreetingTime: null
};

export const useSettings = () => {
  const { user, isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

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
            
            // Initialize preferences in database
            await userPreferencesService.savePreferences(user.id, defaultPreferences);
          }
        } catch (error) {
          console.error('Error loading preferences:', error);
          toast.error('Failed to load preferences');
        } finally {
          setIsLoading(false);
          setIsInitialized(true);
        }
      } else {
        console.log('Not authenticated, using default preferences');
        setPreferences(defaultPreferences);
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    loadPreferences();
  }, [isAuthenticated, user?.id]);

  const savePreferences = useCallback(async (newPreferences: Partial<UserPreferences>) => {
    if (!isInitialized) {
      console.log('Settings not initialized yet, waiting...');
      toast.error('Settings not initialized yet, please try again');
      return false;
    }
    
    setIsSaving(true);
    setPreferences(current => ({ ...current, ...newPreferences }));
    
    if (isAuthenticated && user?.id) {
      const updatedPreferences = { ...preferences, ...newPreferences };
      console.log('Saving preferences to Supabase:', updatedPreferences);
      try {
        const success = await userPreferencesService.savePreferences(user.id, updatedPreferences);
        if (success) {
          toast.success('Preferences saved');
          return true;
        } else {
          toast.error('Failed to save preferences');
          return false;
        }
      } catch (error) {
        console.error('Error saving preferences:', error);
        toast.error('Failed to save preferences');
        return false;
      } finally {
        setIsSaving(false);
      }
    } else {
      console.log('Not authenticated, preferences only saved locally');
      toast.warning('Changes saved locally only. Login to save permanently.');
      setIsSaving(false);
      return false;
    }
  }, [preferences, isAuthenticated, user?.id, isInitialized]);

  const updatePreference = useCallback(async (keyOrObject: string | Partial<UserPreferences>, value?: any) => {
    if (!isInitialized) {
      console.log('Settings not initialized yet, waiting...');
      return false;
    }
    
    let updateData: Partial<UserPreferences>;
    
    if (typeof keyOrObject === 'string') {
      // Handle single key-value update
      updateData = { [keyOrObject]: value };
    } else {
      // Handle object update
      updateData = keyOrObject;
    }
    
    setPreferences(current => ({ ...current, ...updateData }));
    
    if (isAuthenticated && user?.id) {
      const updatedPreferences = { ...preferences, ...updateData };
      console.log(`Saving preference update to Supabase:`, updateData);
      try {
        const success = await userPreferencesService.savePreferences(user.id, updatedPreferences);
        return success;
      } catch (error) {
        console.error('Error updating preferences:', error);
        return false;
      }
    } else {
      console.log('Not authenticated, preference only saved locally');
      return false;
    }
  }, [preferences, isAuthenticated, user?.id, isInitialized]);

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
    isSaving,
    isInitialized,
    savePreferences,
    updatePreference,
    uploadCompanyLogo,
    updateCompanySetting
  };
};
