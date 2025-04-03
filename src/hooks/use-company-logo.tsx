
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { companySettingsService } from '@/services/companySettingsService';
import { toast } from 'sonner';

export const useCompanyLogo = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchLogoUrl = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if we have a logo URL in localStorage for immediate display
      const cachedLogo = localStorage.getItem('company_logo_url');
      if (cachedLogo) {
        setLogoUrl(cachedLogo);
        setIsLoading(false);
      }
      
      // Always fetch from the server to get the latest
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        // If no user, use the cached logo or null
        setIsLoading(false);
        return;
      }
      
      const settings = await companySettingsService.getCompanySettings(userData.user.id);
      const serverLogoUrl = settings?.logoUrl || null;
      
      // Update state only if the logo URL has changed
      if (serverLogoUrl !== logoUrl) {
        setLogoUrl(serverLogoUrl);
        
        // Update cache
        if (serverLogoUrl) {
          localStorage.setItem('company_logo_url', serverLogoUrl);
        } else {
          localStorage.removeItem('company_logo_url');
        }
      }
    } catch (err) {
      console.error('Error fetching logo URL:', err);
      setError('Failed to load company logo');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Fetch logo URL on mount
  useEffect(() => {
    fetchLogoUrl();
  }, [fetchLogoUrl]);
  
  // Listen for logoUpdate events
  useEffect(() => {
    const handleLogoUpdate = () => {
      fetchLogoUrl();
    };
    
    window.addEventListener('logoUpdate', handleLogoUpdate);
    return () => {
      window.removeEventListener('logoUpdate', handleLogoUpdate);
    };
  }, [fetchLogoUrl]);
  
  const uploadLogo = async (file: File): Promise<boolean> => {
    try {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return false;
      }
      
      const uploadPromise = companySettingsService.uploadCompanyLogo(file);
      
      await toast.promise(uploadPromise, {
        loading: 'Uploading logo...',
        success: 'Logo updated successfully',
        error: 'Failed to upload logo'
      });
      
      const newLogoUrl = await uploadPromise;
      
      if (newLogoUrl) {
        setLogoUrl(newLogoUrl);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error uploading logo:', err);
      toast.error('Failed to upload logo');
      return false;
    }
  };
  
  const removeLogo = async (): Promise<boolean> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error('You must be logged in to remove your logo');
        return false;
      }
      
      const success = await companySettingsService.updateCompanySetting(
        userData.user.id,
        'logoUrl',
        null
      );
      
      if (success) {
        setLogoUrl(null);
        localStorage.removeItem('company_logo_url');
        toast.success('Logo removed successfully');
        // Dispatch event to notify components
        window.dispatchEvent(new Event('logoUpdate'));
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error removing logo:', err);
      toast.error('Failed to remove logo');
      return false;
    }
  };
  
  return {
    logoUrl,
    isLoading,
    error,
    uploadLogo,
    removeLogo,
    refreshLogo: fetchLogoUrl
  };
};
