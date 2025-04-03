import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { errorLog, infoLog } from '@/utils/debug';
import { uploadFile } from '@/utils/supabase/storage/uploadFile';
import { validateFileType, validateFileSize } from '@/utils/supabase/storage/validators';

/**
 * Service for managing company settings and assets in Supabase
 */
export const companySettingsService = {
  /**
   * Upload a company logo to Supabase storage
   * @param file The logo file to upload
   * @returns The URL of the uploaded logo or null if upload failed
   */
  async uploadCompanyLogo(file: File): Promise<string | null> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        toast.error('You must be logged in to upload a logo');
        return null;
      }
      
      // Validate file type
      if (!validateFileType(file, ['image/'])) {
        return null;
      }
      
      // Validate file size (5MB limit)
      if (!validateFileSize(file, 5)) {
        return null;
      }
      
      infoLog('Uploading logo...');
      
      // Use the uploadFile utility for consistent file upload handling
      const logoUrl = await uploadFile(file, 'company_assets', 'logos');
      
      if (!logoUrl) {
        errorLog('Logo upload failed in uploadFile utility');
        return null;
      }
      
      infoLog('Logo uploaded successfully, URL:', logoUrl);
      
      // Update the user's preferences with the logo URL
      const success = await this.updateCompanySetting(user.id, 'logoUrl', logoUrl);
      
      if (!success) {
        errorLog('Failed to update user preferences with logo URL');
        toast.error('Logo uploaded but failed to save to your profile');
        return null;
      }
      
      // Force a refresh of the company settings in local storage to ensure immediate availability
      localStorage.setItem('company_settings_timestamp', Date.now().toString());
      
      // Store the logo URL directly in localStorage for immediate access
      localStorage.setItem('company_logo_url', logoUrl);
      
      // Dispatch event to notify components about the logo change
      window.dispatchEvent(new Event('logoUpdate'));
      
      return logoUrl;
    } catch (error) {
      errorLog('Exception in uploadCompanyLogo:', error);
      toast.error('Failed to upload logo');
      return null;
    }
  },
  
  /**
   * Get company settings for the current user
   */
  async getCompanySettings(userId: string): Promise<any> {
    try {
      infoLog('Getting company settings for user:', userId);
      
      // Check if we have a recently cached version (less than 1 minute old)
      const cachedTimestamp = localStorage.getItem('company_settings_timestamp');
      const cachedSettings = localStorage.getItem('company_settings_' + userId);
      const now = Date.now();
      
      if (cachedTimestamp && cachedSettings) {
        const timestamp = parseInt(cachedTimestamp);
        // If cache is less than 1 minute old, use it
        if (now - timestamp < 60000) {
          const settings = JSON.parse(cachedSettings);
          infoLog('Using cached company settings:', settings);
          return settings;
        }
      }
      
      const { data, error } = await supabase
        .from('user_preferences')
        .select('preference_data')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        errorLog('Error getting company settings:', error);
        throw error;
      }
      
      // Default settings if nothing is found
      if (!data || !data.preference_data) {
        infoLog('No preference data found, returning defaults');
        const defaultSettings = { 
          logoUrl: null,
          companyName: 'ResidentPro'
        };
        
        // Cache the default settings
        localStorage.setItem('company_settings_' + userId, JSON.stringify(defaultSettings));
        localStorage.setItem('company_settings_timestamp', now.toString());
        
        return defaultSettings;
      }
      
      // Ensure we explicitly return logoUrl even if it's null
      const settings = {
        logoUrl: data.preference_data.logoUrl || null,
        companyName: data.preference_data.companyName || 'ResidentPro',
        ...data.preference_data
      };
      
      // Cache the settings for quick retrieval
      localStorage.setItem('company_settings_' + userId, JSON.stringify(settings));
      localStorage.setItem('company_settings_timestamp', now.toString());
      
      infoLog('Retrieved company settings:', settings);
      return settings;
    } catch (error) {
      errorLog('Error getting company settings:', error);
      // Try to return cached settings if available
      const cachedSettings = localStorage.getItem('company_settings_' + userId);
      if (cachedSettings) {
        try {
          return JSON.parse(cachedSettings);
        } catch (e) {
          // Ignore parse errors
        }
      }
      
      return {
        logoUrl: null,
        companyName: 'ResidentPro'
      };
    }
  },
  
  /**
   * Update a company setting
   */
  async updateCompanySetting(userId: string, key: string, value: any): Promise<boolean> {
    try {
      infoLog(`Updating company setting: ${key}`, value);
      
      // Update logoUrl in localStorage immediately if that's what's being updated
      if (key === 'logoUrl') {
        if (value === null) {
          localStorage.removeItem('company_logo_url');
        } else {
          localStorage.setItem('company_logo_url', value);
        }
        // Dispatch event to notify components
        window.dispatchEvent(new Event('logoUpdate'));
      }
      
      const { data: existingPref, error: prefError } = await supabase
        .from('user_preferences')
        .select('preference_data')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (prefError) {
        errorLog('Error retrieving user preferences:', prefError);
        throw prefError;
      }
      
      if (existingPref && existingPref.preference_data) {
        const updatedPrefs = {
          ...existingPref.preference_data,
          [key]: value
        };
        
        infoLog(`Updating existing preference for ${key}:`, value);
        
        const { error } = await supabase
          .from('user_preferences')
          .update({ preference_data: updatedPrefs })
          .eq('user_id', userId);
        
        if (error) {
          errorLog('Error updating user preferences:', error);
          throw error;
        }
        
        // Update the cache immediately
        try {
          const cachedSettings = localStorage.getItem('company_settings_' + userId);
          if (cachedSettings) {
            const settings = JSON.parse(cachedSettings);
            settings[key] = value;
            localStorage.setItem('company_settings_' + userId, JSON.stringify(settings));
            localStorage.setItem('company_settings_timestamp', Date.now().toString());
          }
        } catch (e) {
          // Ignore errors updating cache
        }
      } else {
        infoLog(`Creating new preference for ${key}:`, value);
        
        const { error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: userId,
            preference_data: { [key]: value }
          });
        
        if (error) {
          errorLog('Error creating user preferences:', error);
          throw error;
        }
        
        // Set initial cache
        try {
          localStorage.setItem('company_settings_' + userId, JSON.stringify({ [key]: value }));
          localStorage.setItem('company_settings_timestamp', Date.now().toString());
        } catch (e) {
          // Ignore errors updating cache
        }
      }
      
      infoLog('Setting updated successfully');
      return true;
    } catch (error) {
      errorLog('Error updating company setting:', error);
      toast.error('Failed to update company setting');
      return false;
    }
  }
};
