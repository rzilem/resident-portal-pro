
import React from 'react';
import { Link } from 'react-router-dom';
import { useCompanySettings } from '@/hooks/use-company-settings';

interface AppHeaderProps {
  className?: string;
}

const AppHeader = ({ className }: AppHeaderProps) => {
  const { settings } = useCompanySettings();
  
  return (
    <div className={className}>
      <Link to="/" className="flex items-center">
        {settings.logoUrl ? (
          <img 
            src={settings.logoUrl} 
            alt={settings.companyName || "Company Logo"} 
            className="h-10 max-w-[180px] object-contain" 
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
