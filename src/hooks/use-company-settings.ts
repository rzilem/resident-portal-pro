
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CompanySettings {
  name: string;
  companyName: string; // Added this property to fix errors
  logoUrl: string | null;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  taxId?: string; // Added for CompanyInfo component
  description?: string; // Added for CompanyInfo component
}

export const useCompanySettings = () => {
  const [settings, setSettings] = useState<CompanySettings>({
    name: 'ResidentPro',
    companyName: 'ResidentPro',
    logoUrl: null,
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const refreshSettings = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // First check localStorage for cached logo
      const cachedLogo = localStorage.getItem('company_logo_url');
      
      // Fetch company settings
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .eq('id', 'global')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows found" error, which is fine for a new system
        console.error('Error fetching company settings:', error);
      }
      
      if (data) {
        // Prioritize cached logo over database if it exists
        const logoUrl = cachedLogo || data.logo_url;
        
        // If logo is in database but not cached, update cache
        if (data.logo_url && !cachedLogo) {
          localStorage.setItem('company_logo_url', data.logo_url);
        }
        
        setSettings({
          name: data.company_info?.name || 'ResidentPro',
          companyName: data.company_info?.name || 'ResidentPro',
          logoUrl: logoUrl,
          address: data.company_info?.address || '',
          city: data.company_info?.city || '',
          state: data.company_info?.state || '',
          zipCode: data.company_info?.zipCode || '',
          phone: data.company_info?.phone || '',
          email: data.company_info?.email || '',
          website: data.company_info?.website || ''
        });
      } else if (cachedLogo) {
        // If we only have cached logo but no settings, just update the logo
        setSettings(prev => ({ ...prev, logoUrl: cachedLogo }));
      }
    } catch (error) {
      console.error('Exception in refreshSettings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Add needed methods to fix errors
  const updateSetting = useCallback(async (key: string, value: any): Promise<boolean> => {
    // This is a stub implementation
    setSettings(prev => ({ ...prev, [key]: value }));
    return true;
  }, []);
  
  const getSetting = useCallback((key: string): any => {
    return settings[key as keyof CompanySettings];
  }, [settings]);
  
  const uploadLogo = useCallback(async (file: File): Promise<string | null> => {
    // This is a stub implementation
    return URL.createObjectURL(file);
  }, []);
  
  useEffect(() => {
    refreshSettings();
    
    // Listen for logo updates
    const handleLogoUpdate = () => {
      refreshSettings();
    };
    
    window.addEventListener('logoUpdate', handleLogoUpdate);
    
    return () => {
      window.removeEventListener('logoUpdate', handleLogoUpdate);
    };
  }, [refreshSettings]);
  
  return { 
    settings, 
    isLoading, 
    refreshSettings,
    updateSetting,
    getSetting,
    uploadLogo
  };
};
