
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
      const fileName = `${Date.now()}-${file.name.split('.')[0]}.${fileExt}`;
      const filePath = `logos/${fileName}`;
      
      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('company_assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error('Error uploading logo:', uploadError);
        throw uploadError;
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('company_assets')
        .getPublicUrl(filePath);
      
      const logoUrl = publicUrlData.publicUrl;
      
      // Update the user's preferences
      const { data: existingPref } = await supabase
        .from('user_preferences')
        .select('preference_data')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (existingPref) {
        const updatedPrefs = {
          ...existingPref.preference_data,
          logoUrl: logoUrl
        };
        
        await supabase
          .from('user_preferences')
          .update({ preference_data: updatedPrefs })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('user_preferences')
          .insert({
            user_id: user.id,
            preference_data: { logoUrl: logoUrl }
          });
      }
      
      toast.success('Logo uploaded successfully');
      return logoUrl;
    } catch (error) {
      console.error('Error in uploadCompanyLogo:', error);
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
      
      if (error) throw error;
      
      if (!data) return null;
      
      const settings = {
        logoUrl: data.preference_data.logoUrl,
        companyName: data.preference_data.companyName || 'ResidentPro'
      };
      
      return settings;
    } catch (error) {
      console.error('Error getting company settings:', error);
      return null;
    }
  },
  
  /**
   * Update a company setting
   */
  async updateCompanySetting(userId: string, key: string, value: any): Promise<boolean> {
    try {
      const { data: existingPref } = await supabase
        .from('user_preferences')
        .select('preference_data')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (existingPref) {
        const updatedPrefs = {
          ...existingPref.preference_data,
          [key]: value
        };
        
        const { error } = await supabase
          .from('user_preferences')
          .update({ preference_data: updatedPrefs })
          .eq('user_id', userId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_preferences')
          .insert({
            user_id: userId,
            preference_data: { [key]: value }
          });
        
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error updating company setting:', error);
      toast.error('Failed to update company setting');
      return false;
    }
  }
};
