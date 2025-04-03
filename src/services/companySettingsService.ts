
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { errorLog, infoLog } from '@/utils/debug';

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
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return null;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return null;
      }
      
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${user.id}-${file.name.split('.')[0]}.${fileExt}`;
      const filePath = `logos/${fileName}`;
      
      infoLog('Uploading logo to:', filePath);
      
      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('company_assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        errorLog('Error uploading logo:', uploadError);
        toast.error(`Upload failed: ${uploadError.message}`);
        return null;
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('company_assets')
        .getPublicUrl(filePath);
      
      const logoUrl = publicUrlData.publicUrl;
      infoLog('Logo uploaded successfully, URL:', logoUrl);
      
      // Update the user's preferences
      const { data: existingPref, error: prefError } = await supabase
        .from('user_preferences')
        .select('preference_data')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (prefError) {
        errorLog('Error retrieving user preferences:', prefError);
      }
      
      if (existingPref) {
        const updatedPrefs = {
          ...existingPref.preference_data,
          logoUrl: logoUrl
        };
        
        const { error: updateError } = await supabase
          .from('user_preferences')
          .update({ preference_data: updatedPrefs })
          .eq('user_id', user.id);
          
        if (updateError) {
          errorLog('Error updating user preferences:', updateError);
          toast.error('Failed to save logo preferences');
        }
      } else {
        const { error: insertError } = await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            preference_data: { logoUrl: logoUrl }
          });
          
        if (insertError) {
          errorLog('Error creating user preferences:', insertError);
          toast.error('Failed to save logo preferences');
        }
      }
      
      toast.success('Logo uploaded successfully');
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
      const { data, error } = await supabase
        .from('user_preferences')
        .select('preference_data')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        errorLog('Error getting company settings:', error);
        throw error;
      }
      
      if (!data) return { 
        logoUrl: null,
        companyName: 'ResidentPro'
      };
      
      // Ensure we explicitly return a logoUrl even if it's null
      const settings = {
        logoUrl: data.preference_data.logoUrl || null,
        companyName: data.preference_data.companyName || 'ResidentPro'
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
      const { data: existingPref, error: prefError } = await supabase
        .from('user_preferences')
        .select('preference_data')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (prefError) {
        errorLog('Error retrieving user preferences:', prefError);
        throw prefError;
      }
      
      if (existingPref) {
        const updatedPrefs = {
          ...existingPref.preference_data,
          [key]: value
        };
        
        infoLog(`Updating user preference: ${key}`, value);
        
        const { error } = await supabase
          .from('user_preferences')
          .update({ preference_data: updatedPrefs })
          .eq('user_id', userId);
        
        if (error) {
          errorLog('Error updating user preferences:', error);
          throw error;
        }
      } else {
        infoLog(`Creating new user preference: ${key}`, value);
        
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
      
      return true;
    } catch (error) {
      errorLog('Error updating company setting:', error);
      toast.error('Failed to update company setting');
      return false;
    }
  }
};
