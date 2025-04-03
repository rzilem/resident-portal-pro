
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Constants for consistent storage
const LOGO_BUCKET = 'logos';
const COMPANY_ASSETS_PATH = 'company_assets';

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
    console.log('Uploading company logo...');
    
    // Ensure the bucket exists
    const { data: bucketData, error: bucketError } = await supabase.storage
      .getBucket(LOGO_BUCKET);
      
    if (bucketError) {
      // Bucket doesn't exist, try to create it
      const { error: createError } = await supabase.storage
        .createBucket(LOGO_BUCKET, {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
      
      if (createError) {
        console.error('Error creating logo bucket:', createError);
        toast.error('Failed to initialize logo storage');
        return null;
      }
    }
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `company-logo-${uuidv4()}.${fileExt}`;
    const filePath = `${COMPANY_ASSETS_PATH}/${fileName}`;
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from(LOGO_BUCKET)
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
      .from(LOGO_BUCKET)
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
    localStorage.setItem('company_logo_timestamp', Date.now().toString());
    
    // Create a custom event to notify the application that the logo has been updated
    window.dispatchEvent(new CustomEvent('logoUpdate', { detail: publicUrl }));
    
    console.log('Logo uploaded successfully:', publicUrl);
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
    console.log('Getting company logo...');
    
    // First check localStorage for cached URL with timestamp check (cache for 5 minutes)
    const cachedLogo = localStorage.getItem('company_logo_url');
    const cachedTimestamp = localStorage.getItem('company_logo_timestamp');
    
    if (cachedLogo && cachedTimestamp) {
      const timestamp = parseInt(cachedTimestamp);
      const now = Date.now();
      
      // If cache is less than 5 minutes old, use it
      if (now - timestamp < 5 * 60 * 1000) {
        console.log('Using cached logo URL:', cachedLogo);
        return cachedLogo;
      }
    }
    
    // If not in cache or cache is stale, get from database
    const { data, error } = await supabase
      .from('company_settings')
      .select('logo_url')
      .eq('id', 'global')
      .single();
    
    if (error) {
      console.log('No company logo found in database');
      // Clear any stale cache
      localStorage.removeItem('company_logo_url');
      localStorage.removeItem('company_logo_timestamp');
      return null;
    }
    
    // Cache the URL in localStorage with timestamp
    if (data?.logo_url) {
      localStorage.setItem('company_logo_url', data.logo_url);
      localStorage.setItem('company_logo_timestamp', Date.now().toString());
      console.log('Updated logo cache with URL:', data.logo_url);
    } else {
      // Clear any stale cache if no logo in DB
      localStorage.removeItem('company_logo_url');
      localStorage.removeItem('company_logo_timestamp');
    }
    
    return data?.logo_url || null;
  } catch (error) {
    console.error('Exception getting company logo:', error);
    return null;
  }
};

// Delete company logo
export const deleteCompanyLogo = async (): Promise<boolean> => {
  try {
    console.log('Deleting company logo...');
    
    // Get current logo URL
    const logoUrl = await getCompanyLogo();
    if (!logoUrl) {
      toast.info('No logo found to delete');
      return true; // Nothing to delete is still a successful operation
    }
    
    // Extract filename from URL
    const urlParts = logoUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `${COMPANY_ASSETS_PATH}/${fileName}`;
    
    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from(LOGO_BUCKET)
      .remove([filePath]);
    
    if (deleteError) {
      console.error('Error deleting logo from storage:', deleteError);
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
    
    // Clear from localStorage
    localStorage.removeItem('company_logo_url');
    localStorage.removeItem('company_logo_timestamp');
    
    // Trigger logo update event
    window.dispatchEvent(new CustomEvent('logoUpdate'));
    
    console.log('Logo deleted successfully');
    return true;
  } catch (error) {
    console.error('Exception deleting company logo:', error);
    toast.error('An unexpected error occurred deleting the logo');
    return false;
  }
};
