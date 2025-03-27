
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Json } from '@/integrations/supabase/types';

// Default company settings as fallback
const defaultCompanySettings = {
  companyName: 'Association Management Co.',
  taxId: '12-3456789',
  phone: '(555) 123-4567',
  email: 'contact@associationmgmt.com',
  address: '123 Main St, Suite 100, Cityville, ST 12345',
  description: 'Professional association management services for homeowners and community associations.',
  logoUrl: null
};

// Settings ID for company-wide settings
const COMPANY_SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

// Cache for company settings
let cachedSettings: Record<string, any> | null = null;

export const companySettingsService = {
  /**
   * Get all company settings
   */
  getCompanySettings: async () => {
    try {
      // Return cached settings if available
      if (cachedSettings) {
        return { ...cachedSettings };
      }
      
      // Try to get settings from Supabase
      const { data, error } = await supabase
        .from('association_settings')
        .select('*')
        .eq('id', COMPANY_SETTINGS_ID)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching company settings:', error);
        // Fall back to default settings
        cachedSettings = { ...defaultCompanySettings };
        return { ...defaultCompanySettings };
      }
      
      if (data && data.settings) {
        // Cache the settings
        cachedSettings = data.settings as Record<string, any>;
        return data.settings as Record<string, any>;
      }
      
      // No settings found, create default settings
      await companySettingsService.updateCompanySettings(defaultCompanySettings);
      cachedSettings = { ...defaultCompanySettings };
      return { ...defaultCompanySettings };
    } catch (error) {
      console.error('Error in getCompanySettings:', error);
      return { ...defaultCompanySettings };
    }
  },

  /**
   * Update company settings
   */
  updateCompanySettings: async (updates: Record<string, any>) => {
    try {
      // Get current settings first
      const currentSettings = await companySettingsService.getCompanySettings();
      
      // Merge with updates
      const newSettings = {
        ...currentSettings,
        ...updates
      };
      
      // Update in Supabase
      const { data, error } = await supabase
        .from('association_settings')
        .upsert({ 
          id: COMPANY_SETTINGS_ID,
          settings: newSettings as Json,
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) {
        console.error('Error updating company settings:', error);
        toast.error('Failed to update company settings');
        return currentSettings;
      }
      
      // Update cache
      cachedSettings = newSettings;
      return newSettings;
    } catch (error) {
      console.error('Error in updateCompanySettings:', error);
      toast.error('Failed to update company settings');
      return cachedSettings || { ...defaultCompanySettings };
    }
  },

  /**
   * Update a specific company setting
   */
  updateCompanySetting: async (key: string, value: any) => {
    try {
      const currentSettings = await companySettingsService.getCompanySettings();
      
      // Create updated settings
      const updatedSettings = {
        ...currentSettings,
        [key]: value
      };
      
      // Update settings
      return await companySettingsService.updateCompanySettings(updatedSettings);
    } catch (error) {
      console.error(`Error updating company setting "${key}":`, error);
      toast.error(`Failed to update ${key}`);
      return cachedSettings || { ...defaultCompanySettings };
    }
  },
  
  /**
   * Upload company logo
   */
  uploadCompanyLogo: async (file: File): Promise<string | null> => {
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `company-logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;
      
      // Upload file to storage
      const { error: uploadError } = await supabase
        .storage
        .from('association_files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = await supabase
        .storage
        .from('association_files')
        .getPublicUrl(filePath);
      
      const publicUrl = data.publicUrl;
      
      // Update logo URL in settings
      await companySettingsService.updateCompanySetting('logoUrl', publicUrl);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading company logo:', error);
      toast.error('Failed to upload logo');
      return null;
    }
  }
};
