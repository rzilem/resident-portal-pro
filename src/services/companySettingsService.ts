
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
      await this.updateCompanySetting(user.id, 'logoUrl', logoUrl);
      
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
        return { 
          logoUrl: null,
          companyName: 'ResidentPro'
        };
      }
      
      // Ensure we explicitly return logoUrl even if it's null
      const settings = {
        logoUrl: data.preference_data.logoUrl || null,
        companyName: data.preference_data.companyName || 'ResidentPro',
        ...data.preference_data
      };
      
      infoLog('Retrieved company settings:', settings);
      return settings;
    } catch (error) {
      errorLog('Error getting company settings:', error);
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
