
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getFileUrl } from '@/utils/supabase/storage/getUrl';

export interface CompanySettings {
  id?: string;
  companyName: string;
  logoUrl: string | null;
  primaryColor: string;
  accentColor: string;
  darkMode: boolean;
  dateFormat: string;
  timeFormat: string;
  timezone: string;
  currency: string;
}

interface CompanySettingsContextType {
  settings: CompanySettings;
  loading: boolean;
  error: Error | null;
  updateSettings: (newSettings: Partial<CompanySettings>) => Promise<void>;
}

const defaultSettings: CompanySettings = {
  companyName: 'HOA Management',
  logoUrl: null,
  primaryColor: '#3b82f6',
  accentColor: '#10b981',
  darkMode: false,
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  timezone: 'America/New_York',
  currency: 'USD'
};

const CompanySettingsContext = createContext<CompanySettingsContextType>({
  settings: defaultSettings,
  loading: false,
  error: null,
  updateSettings: async () => {}
});

export const CompanySettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getCompanySettings = async () => {
      try {
        // Try to get from database first
        const { data, error } = await supabase
          .from('company_settings')
          .select('*')
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is the "no rows returned" error, which we handle by using defaults
          console.error("Error fetching company settings:", error);
          throw error;
        }

        if (data) {
          // Process logo URL if it exists
          let logoUrl = data.logo_url;
          if (logoUrl && !logoUrl.startsWith('http')) {
            logoUrl = getFileUrl('company_assets', logoUrl);
          }

          setSettings({
            id: data.id,
            companyName: data.company_name || defaultSettings.companyName,
            logoUrl: logoUrl,
            primaryColor: data.primary_color || defaultSettings.primaryColor,
            accentColor: data.accent_color || defaultSettings.accentColor,
            darkMode: data.dark_mode || defaultSettings.darkMode,
            dateFormat: data.date_format || defaultSettings.dateFormat,
            timeFormat: data.time_format || defaultSettings.timeFormat,
            timezone: data.timezone || defaultSettings.timezone,
            currency: data.currency || defaultSettings.currency
          });
        }
      } catch (err) {
        console.error("Failed to load company settings:", err);
        setError(err instanceof Error ? err : new Error('Unknown error loading settings'));
        
        // Fall back to defaults but still show toast
        toast.error("Failed to load company settings. Using defaults.");
      } finally {
        setLoading(false);
      }
    };

    getCompanySettings();
  }, []);

  const updateSettings = async (newSettings: Partial<CompanySettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      // First update locally for immediate UI feedback
      setSettings(updatedSettings);
      
      // Transform to database format
      const dbData = {
        company_name: updatedSettings.companyName,
        logo_url: updatedSettings.logoUrl,
        primary_color: updatedSettings.primaryColor,
        accent_color: updatedSettings.accentColor,
        dark_mode: updatedSettings.darkMode,
        date_format: updatedSettings.dateFormat,
        time_format: updatedSettings.timeFormat,
        timezone: updatedSettings.timezone,
        currency: updatedSettings.currency
      };
      
      if (settings.id) {
        // Update existing record
        const { error } = await supabase
          .from('company_settings')
          .update(dbData)
          .eq('id', settings.id);
          
        if (error) throw error;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('company_settings')
          .insert(dbData)
          .select('id')
          .single();
          
        if (error) throw error;
        
        // Update state with the new ID
        setSettings(prev => ({ ...prev, id: data.id }));
      }
      
      toast.success("Company settings updated successfully");
    } catch (err) {
      console.error("Failed to update company settings:", err);
      // Revert local state
      toast.error("Failed to update company settings");
      throw err;
    }
  };

  return (
    <CompanySettingsContext.Provider value={{ settings, loading, error, updateSettings }}>
      {children}
    </CompanySettingsContext.Provider>
  );
};

export const useCompanySettings = () => useContext(CompanySettingsContext);
