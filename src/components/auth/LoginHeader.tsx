
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompanySettings } from '@/hooks/use-company-settings';
import { infoLog, errorLog } from '@/utils/debug';

const LoginHeader = () => {
  const { settings, isLoading, refreshSettings } = useCompanySettings();
  const [imgError, setImgError] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  // Update local logo state when settings change
  useEffect(() => {
    if (settings.logoUrl) {
      setLogoUrl(settings.logoUrl);
      setImgError(false);
    } else {
      setLogoUrl(null);
    }
  }, [settings.logoUrl]);
  
  // Try to refresh settings when component mounts
  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);
  
  infoLog('LoginHeader rendering with logo URL:', logoUrl);
  
  return (
    <div className="mb-6 text-center">
      <Link to="/" className="inline-block">
        {logoUrl && !imgError ? (
          <img 
            src={`${logoUrl}?t=${Date.now()}`} // Add cache busting
            alt={settings.companyName || "Company Logo"} 
            className="h-10 mx-auto max-w-[180px] object-contain" 
            onError={(e) => {
              errorLog('Logo failed to load in LoginHeader:', logoUrl);
              setImgError(true);
              // Try refreshing settings once on error
              refreshSettings();
              e.currentTarget.src = ""; // Clear the src
              e.currentTarget.style.display = "none"; // Hide the image
            }}
          />
        ) : (
          <h1 className="text-2xl font-bold text-gradient">{settings.companyName || "ResidentPro"}</h1>
        )}
      </Link>
      <p className="text-muted-foreground mt-2">Access your community dashboard</p>
    </div>
  );
};

export default LoginHeader;
