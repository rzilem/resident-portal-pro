
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CompanyInfo {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
}

interface EmailSettings {
  defaultSender?: string;
  signature?: string;
  footerText?: string;
}

interface GeneralSettings {
  dateFormat?: string;
  timeFormat?: string;
  language?: string;
  timezone?: string;
}

interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  sidebarCollapsed?: boolean;
  notifications?: boolean;
}

export interface Settings {
  company?: CompanyInfo;
  email?: EmailSettings;
  general?: GeneralSettings;
  preferences?: UserPreferences;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Fetch company settings
      const { data: companyData, error: companyError } = await supabase
        .from('company_settings')
        .select('*')
        .eq('id', 'global')
        .single();
      
      if (companyError && companyError.code !== 'PGRST116') {
        // PGRST116 is "no rows found" error, which is fine for a new system
        console.error('Error fetching company settings:', companyError);
      }
      
      // Fetch user preferences if logged in
      const { data: { user } } = await supabase.auth.getUser();
      let userPrefs = {};
      
      if (user) {
        const { data: prefsData, error: prefsError } = await supabase
          .from('user_preferences')
          .select('preference_data')
          .eq('user_id', user.id)
          .single();
        
        if (prefsError && prefsError.code !== 'PGRST116') {
          console.error('Error fetching user preferences:', prefsError);
        }
        
        if (prefsData) {
          userPrefs = prefsData.preference_data;
        }
      }
      
      // Combine all settings
      setSettings({
        company: companyData?.company_info || {},
        email: companyData?.email_settings || {},
        general: companyData?.general_settings || {},
        preferences: userPrefs,
      });
      
    } catch (error) {
      console.error('Exception in fetchSettings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);
  
  const updateSettings = async (
    section: keyof Settings,
    data: any
  ): Promise<boolean> => {
    try {
      if (section === 'preferences') {
        // Update user preferences
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error('You must be logged in to update preferences');
          return false;
        }
        
        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            preference_data: { ...settings.preferences, ...data }
          });
        
        if (error) {
          console.error('Error updating user preferences:', error);
          toast.error('Failed to update preferences');
          return false;
        }
        
        // Update local state
        setSettings(prev => ({
          ...prev,
          preferences: { ...prev.preferences, ...data }
        }));
        
        toast.success('Preferences updated successfully');
        return true;
      } else {
        // Update company settings
        const updateData: Record<string, any> = {};
        updateData[`${section}_info`] = section === 'company' 
          ? { ...settings.company, ...data }
          : data;
        
        const { error } = await supabase
          .from('company_settings')
          .upsert({
            id: 'global',
            ...updateData,
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          console.error(`Error updating ${section} settings:`, error);
          toast.error(`Failed to update ${section} settings`);
          return false;
        }
        
        // Update local state
        setSettings(prev => ({
          ...prev,
          [section]: { ...prev[section], ...data }
        }));
        
        toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} settings updated successfully`);
        return true;
      }
    } catch (error) {
      console.error(`Exception in updateSettings for ${section}:`, error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };
  
  const updatePreference = async (key: string, value: any): Promise<boolean> => {
    return updateSettings('preferences', { [key]: value });
  };
  
  return {
    settings,
    isLoading,
    updateSettings,
    updatePreference,
    refreshSettings: fetchSettings
  };
};
