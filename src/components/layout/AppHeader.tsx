
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompanySettings } from '@/hooks/use-company-settings';
import { infoLog, errorLog } from '@/utils/debug';

interface AppHeaderProps {
  className?: string;
}

const AppHeader = ({ className }: AppHeaderProps) => {
  const { settings, isLoading } = useCompanySettings();
  const [imgError, setImgError] = useState(false);
  
  // Reset image error state if logo URL changes
  useEffect(() => {
    setImgError(false);
  }, [settings.logoUrl]);
  
  infoLog('AppHeader rendering with logo URL:', settings.logoUrl);
  
  return (
    <div className={className}>
      <Link to="/" className="flex items-center">
        {settings.logoUrl && !imgError ? (
          <img 
            src={settings.logoUrl + `?t=${Date.now()}`} // Add cache busting
            alt={settings.companyName || "Company Logo"} 
            className="h-10 max-w-[180px] object-contain" 
            onError={(e) => {
              errorLog('Logo failed to load in AppHeader:', settings.logoUrl);
              setImgError(true);
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
