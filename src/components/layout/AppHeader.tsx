
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompanySettings } from '@/hooks/use-company-settings';
import { infoLog, errorLog } from '@/utils/debug';

interface AppHeaderProps {
  className?: string;
}

const AppHeader = ({ className }: AppHeaderProps) => {
  const { settings, isLoading, refreshSettings } = useCompanySettings();
  const [imgError, setImgError] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  // Function to update logo from localStorage or settings
  const updateLogoFromStorage = () => {
    // First check localStorage for most up-to-date logo
    const storedLogo = localStorage.getItem('company_logo_url');
    
    if (storedLogo) {
      setLogoUrl(storedLogo);
      setImgError(false);
    } else if (settings.logoUrl) {
      setLogoUrl(settings.logoUrl);
      setImgError(false);
    } else {
      setLogoUrl(null);
    }
  };
  
  // Update local logo state when settings change
  useEffect(() => {
    updateLogoFromStorage();
  }, [settings.logoUrl]);
  
  // Listen for logo update events
  useEffect(() => {
    window.addEventListener('logoUpdate', updateLogoFromStorage);
    return () => window.removeEventListener('logoUpdate', updateLogoFromStorage);
  }, []);
  
  // Try to refresh settings when component mounts
  useEffect(() => {
    refreshSettings();
    updateLogoFromStorage();
  }, [refreshSettings]);
  
  infoLog('AppHeader rendering with logo URL:', logoUrl);
  
  return (
    <div className={className}>
      <Link to="/" className="flex items-center">
        {logoUrl && !imgError ? (
          <img 
            src={`${logoUrl}?t=${Date.now()}`} // Add cache busting
            alt={settings.companyName || "Company Logo"} 
            className="h-10 max-w-[180px] object-contain" 
            onError={(e) => {
              errorLog('Logo failed to load in AppHeader:', logoUrl);
              setImgError(true);
              // Try refreshing settings once on error
              refreshSettings();
              e.currentTarget.src = ""; // Clear the src
              e.currentTarget.style.display = "none"; // Hide the image
            }}
          />
        ) : (
          <span className="text-2xl font-bold text-gradient">
            {settings.companyName || "ResidentPro"}
          </span>
        )}
      </Link>
    </div>
  );
};

export default AppHeader;
