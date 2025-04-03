
import React from 'react';
import { Link } from 'react-router-dom';
import { useCompanySettings } from '@/hooks/use-company-settings';

const LoginHeader = () => {
  const { settings, isLoading } = useCompanySettings();
  
  console.log('LoginHeader rendering with logo URL:', settings.logoUrl);
  
  return (
    <div className="mb-6 text-center">
      <Link to="/" className="inline-block">
        {settings.logoUrl ? (
          <img 
            src={settings.logoUrl} 
            alt={settings.companyName || "Company Logo"} 
            className="h-10 mx-auto max-w-[180px] object-contain" 
            onError={(e) => {
              console.error('Logo failed to load in LoginHeader:', settings.logoUrl);
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
