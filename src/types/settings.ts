export interface Settings {
  // Original properties (keep whatever is already defined)
  
  // Add missing properties
  invoiceTableColumns?: any[];
  databaseHomeownerColumns?: any[];
  customColors?: Record<string, string>;
  themePreset?: 'light' | 'dark' | 'system';
  customBackground?: string;
  preferences?: Record<string, any>;
}

// Extended interface for the settings context/hook return type
export interface SettingsContextType {
  settings: Settings;
  isLoading: boolean;
  isInitialized?: boolean; 
  preferences?: Record<string, any>;
  savePreferences?: (prefs: Record<string, any>) => Promise<void>;
  isSaving?: boolean;
  updateSettings: (section: keyof Settings, data: any) => Promise<boolean>;
  updatePreference: (key: string, value: any) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
}
