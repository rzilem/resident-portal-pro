
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { toast } from "sonner";
import { userPreferencesService } from '@/services/userPreferencesService';

interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  cardStyle?: 'default' | 'flat' | 'elevated';
  colorMode?: 'default' | 'grayscale' | 'high-contrast';
  fontSize?: 'small' | 'medium' | 'large';
  dashboardLayout?: any;
  dashboardWidgets?: any[];
  dashboardColumns?: number;
  databaseHomeownerColumns?: any[];
  tableDensity?: 'compact' | 'default' | 'spacious';
  notificationsEnabled?: boolean;
  documentCategories?: any[];
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
  documentCategories: []
};

export const useSettings = () => {
  const { user, isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from Supabase when the user is authenticated
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
        // Not authenticated, use default preferences
        console.log('Not authenticated, using default preferences');
        setPreferences(defaultPreferences);
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [isAuthenticated, user?.id]);

  // Save preferences to Supabase
  const savePreferences = useCallback(async (newPreferences: Partial<UserPreferences>) => {
    // Update local state immediately for a responsive UI
    setPreferences(current => ({ ...current, ...newPreferences }));
    
    // If authenticated, save to Supabase
    if (isAuthenticated && user?.id) {
      const updatedPreferences = { ...preferences, ...newPreferences };
      console.log('Saving preferences to Supabase:', updatedPreferences);
      await userPreferencesService.savePreferences(user.id, updatedPreferences);
    } else {
      console.log('Not authenticated, preferences only saved locally');
    }
  }, [preferences, isAuthenticated, user?.id]);

  // Update specific preference
  const updatePreference = useCallback(async (key: string, value: any) => {
    // Update local state immediately
    setPreferences(current => ({ ...current, [key]: value }));
    
    // If authenticated, save to Supabase
    if (isAuthenticated && user?.id) {
      const updatedPreferences = { ...preferences, [key]: value };
      console.log(`Saving preference update to Supabase: ${key}=`, value);
      await userPreferencesService.savePreferences(user.id, updatedPreferences);
    } else {
      console.log('Not authenticated, preference only saved locally');
    }
  }, [preferences, isAuthenticated, user?.id]);

  return {
    preferences,
    isLoading,
    savePreferences,
    updatePreference
  };
};
