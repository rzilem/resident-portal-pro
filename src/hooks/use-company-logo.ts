
import { useState, useEffect, useCallback } from 'react';
import { 
  uploadCompanyLogo as uploadLogoService,
  getCompanyLogo as getLogoService,
  deleteCompanyLogo as deleteLogoService
} from '@/services/companyLogoService';

export const useCompanyLogo = () => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogo = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const url = await getLogoService();
      setLogoUrl(url);
    } catch (err) {
      console.error('Error fetching company logo:', err);
      setError('Failed to load company logo');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogo();
    
    // Listen for logo updates
    const handleLogoUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail) {
        setLogoUrl(customEvent.detail);
      } else {
        fetchLogo();
      }
    };
    
    window.addEventListener('logoUpdate', handleLogoUpdate);
    
    return () => {
      window.removeEventListener('logoUpdate', handleLogoUpdate);
    };
  }, [fetchLogo]);

  const uploadLogo = async (file: File): Promise<boolean> => {
    setError(null);
    
    try {
      const newLogoUrl = await uploadLogoService(file);
      if (newLogoUrl) {
        setLogoUrl(newLogoUrl);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error uploading company logo:', err);
      setError('Failed to upload company logo');
      return false;
    }
  };

  const deleteLogo = async (): Promise<boolean> => {
    setError(null);
    
    try {
      const success = await deleteLogoService();
      if (success) {
        setLogoUrl(null);
      }
      return success;
    } catch (err) {
      console.error('Error deleting company logo:', err);
      setError('Failed to delete company logo');
      return false;
    }
  };

  return {
    logoUrl,
    isLoading,
    error,
    uploadLogo,
    deleteLogo,
    refreshLogo: fetchLogo
  };
};
