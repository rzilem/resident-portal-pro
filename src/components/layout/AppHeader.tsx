
import React from 'react';
import { Link } from 'react-router-dom';
import { useCompanySettings } from '@/hooks/use-company-settings';

interface AppHeaderProps {
  className?: string;
}

const AppHeader = ({ className }: AppHeaderProps) => {
  const { settings, isLoading } = useCompanySettings();
  
  console.log('AppHeader rendering with logo URL:', settings.logoUrl);
  
  return (
    <div className={className}>
      <Link to="/" className="flex items-center">
        {settings.logoUrl ? (
          <img 
            src={settings.logoUrl} 
            alt={settings.companyName || "Company Logo"} 
            className="h-10 max-w-[180px] object-contain" 
            onError={(e) => {
              console.error('Logo failed to load in AppHeader:', settings.logoUrl);
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
