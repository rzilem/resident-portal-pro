
import React from 'react';
import { Link } from 'react-router-dom';
import { useCompanySettings } from '@/hooks/use-company-settings';

const LoginHeader = () => {
  const { settings } = useCompanySettings();
  
  return (
    <div className="mb-6 text-center">
      <Link to="/" className="inline-block">
        {settings.logoUrl ? (
          <img 
            src={settings.logoUrl} 
            alt={settings.companyName || "Company Logo"} 
            className="h-10 mx-auto max-w-[180px] object-contain" 
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
