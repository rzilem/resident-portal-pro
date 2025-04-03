
import { useContext, createContext, useState, useEffect, useCallback } from 'react';
import { Settings, SettingsContextType } from '@/types/settings';

// Create a context with the extended type that includes preferences
export const SettingsContext = createContext<SettingsContextType>({
  settings: {},
  isLoading: true,
  isInitialized: false,
  preferences: {},
  savePreferences: async () => {},
  isSaving: false,
  updateSettings: async () => false,
  updatePreference: async () => false,
  refreshSettings: async () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
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
        preferences: {}
      });
      
      // Set preferences separately
      setPreferences({
        // Default preferences
        theme: 'system',
        cardStyle: 'default',
        colorMode: 'default',
        fontSize: 'medium',
        tableDensity: 'default',
        voiceGreetingEnabled: true,
        voiceGreetingType: 'default'
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
  const updateSettings = async (section: keyof Settings, data: any): Promise<boolean> => {
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
  const updatePreference = async (key: string, value: any): Promise<boolean> => {
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
  const savePreferences = async (prefs: Record<string, any>): Promise<void> => {
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
  const refreshSettings = async (): Promise<void> => {
    await loadSettings();
  };
  
  // Fixed syntax: In React JSX, props are passed without using the word "value"
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
