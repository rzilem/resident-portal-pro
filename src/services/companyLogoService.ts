
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Function to validate image file
const validateImage = (file: File): boolean => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    toast.error('Please select an image file (JPEG, PNG, etc.)');
    return false;
  }
  
  // Check file size (2MB limit)
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (file.size > maxSize) {
    toast.error('Image size exceeds 2MB limit');
    return false;
  }
  
  return true;
};

// Upload company logo to Supabase Storage
export const uploadCompanyLogo = async (file: File): Promise<string | null> => {
  if (!validateImage(file)) {
    return null;
  }
  
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `company-logo-${uuidv4()}.${fileExt}`;
    const filePath = `company_assets/${fileName}`;
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.error('Error uploading logo:', uploadError);
      toast.error('Failed to upload logo');
      return null;
    }
    
    // Get public URL
    const { data: urlData } = await supabase.storage
      .from('logos')
      .getPublicUrl(filePath);
    
    const publicUrl = urlData?.publicUrl || '';
    
    // Save URL to company settings
    const { error: settingsError } = await supabase
      .from('company_settings')
      .upsert({ 
        id: 'global', 
        logo_url: publicUrl,
        updated_at: new Date().toISOString()
      });
    
    if (settingsError) {
      console.error('Error saving logo URL to settings:', settingsError);
      // Continue anyway since the logo was uploaded successfully
    }
    
    // Store in localStorage for immediate use
    localStorage.setItem('company_logo_url', publicUrl);
    
    // Create a custom event to notify the application that the logo has been updated
    window.dispatchEvent(new CustomEvent('logoUpdate', { detail: publicUrl }));
    
    toast.success('Company logo uploaded successfully');
    return publicUrl;
  } catch (error) {
    console.error('Exception uploading company logo:', error);
    toast.error('An unexpected error occurred uploading the logo');
    return null;
  }
};

// Get company logo URL from Supabase
export const getCompanyLogo = async (): Promise<string | null> => {
  try {
    // First check localStorage for cached URL
    const cachedLogo = localStorage.getItem('company_logo_url');
    if (cachedLogo) {
      return cachedLogo;
    }
    
    // If not in cache, get from database
    const { data, error } = await supabase
      .from('company_settings')
      .select('logo_url')
      .eq('id', 'global')
      .single();
    
    if (error || !data) {
      console.error('Error fetching company logo:', error);
      return null;
    }
    
    // Cache the URL in localStorage
    if (data.logo_url) {
      localStorage.setItem('company_logo_url', data.logo_url);
    }
    
    return data.logo_url;
  } catch (error) {
    console.error('Exception getting company logo:', error);
    return null;
  }
};

// Delete company logo
export const deleteCompanyLogo = async (): Promise<boolean> => {
  try {
    // Get current logo URL
    const logoUrl = await getCompanyLogo();
    if (!logoUrl) {
      toast.error('No logo found to delete');
      return false;
    }
    
    // Extract filename from URL
    const urlParts = logoUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `company_assets/${fileName}`;
    
    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from('logos')
      .remove([filePath]);
    
    if (deleteError) {
      console.error('Error deleting logo from storage:', deleteError);
      toast.error('Failed to delete logo from storage');
      // Continue anyway to update the database
    }
    
    // Update company settings
    const { error: updateError } = await supabase
      .from('company_settings')
      .update({ 
        logo_url: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', 'global');
    
    if (updateError) {
      console.error('Error updating company settings:', updateError);
      toast.error('Failed to update company settings');
      return false;
    }
    
    // Remove from localStorage
    localStorage.removeItem('company_logo_url');
    
    // Trigger logo update event
    window.dispatchEvent(new CustomEvent('logoUpdate'));
    
    toast.success('Company logo deleted successfully');
    return true;
  } catch (error) {
    console.error('Exception deleting company logo:', error);
    toast.error('An unexpected error occurred deleting the logo');
    return false;
  }
};
