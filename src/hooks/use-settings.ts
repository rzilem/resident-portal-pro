
import { useContext, createContext, useState, useEffect, useCallback } from 'react';
import { Settings } from '@/types/settings';

// Create a context with the extended type that includes preferences
export const SettingsContext = createContext<{
  settings: Settings;
  preferences: Record<string, any>;
  isLoading: boolean;
  isInitialized: boolean;
  savePreferences: (prefs: Record<string, any>) => Promise<void>;
  isSaving: boolean;
  updateSettings: (section: keyof Settings, data: any) => Promise<boolean>;
  updatePreference: (key: string, value: any) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
}>({
  settings: {},
  preferences: {},
  isLoading: true,
  isInitialized: false,
  savePreferences: async () => {},
  isSaving: false,
  updateSettings: async () => false,
  updatePreference: async () => false,
  refreshSettings: async () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({});
  const [preferences, setPreferences] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Function to load settings from API or storage
  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      // Load settings logic
      
      // Set mock settings for development
      setSettings({
        // Add default settings with all required properties
        invoiceTableColumns: [],
        databaseHomeownerColumns: [],
        customColors: {},
        themePreset: 'light',
        customBackground: '',
      });
      
      // Set preferences separately
      setPreferences({
        // Default preferences
      });
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);
  
  // Function to update a setting
  const updateSettings = async (section: keyof Settings, data: any) => {
    try {
      // Update logic
      setSettings(prev => ({
        ...prev,
        [section]: data
      }));
      return true;
    } catch (error) {
      console.error('Failed to update settings:', error);
      return false;
    }
  };
  
  // Function to update a single preference
  const updatePreference = async (key: string, value: any) => {
    try {
      setPreferences(prev => ({
        ...prev,
        [key]: value
      }));
      return true;
    } catch (error) {
      console.error('Failed to update preference:', error);
      return false;
    }
  };
  
  // Function to save all preferences
  const savePreferences = async (prefs: Record<string, any>) => {
    try {
      setIsSaving(true);
      // Save logic
      setPreferences(prefs);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Function to refresh settings
  const refreshSettings = async () => {
    await loadSettings();
  };
  
  return (
    <SettingsContext.Provider
      value={{
        settings,
        preferences,
        isLoading,
        isInitialized,
        savePreferences,
        isSaving,
        updateSettings,
        updatePreference,
        refreshSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};
