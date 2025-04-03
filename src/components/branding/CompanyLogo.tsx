
import React, { useState } from 'react';
import { useCompanyLogo } from '@/hooks/use-company-logo';
import { Building } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompanyLogoProps {
  className?: string;
  fallbackText?: string;
  height?: number;
  width?: number;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({
  className,
  fallbackText = 'ResidentPro',
  height = 40,
  width = 200
}) => {
  const { logoUrl, isLoading } = useCompanyLogo();
  const [imgError, setImgError] = useState(false);
  
  if (isLoading) {
    return (
      <div className={cn("flex items-center animate-pulse", className)}>
        <div className="bg-primary/20 h-10 w-32 rounded"></div>
      </div>
    );
  }
  
  if (!logoUrl || imgError) {
    return (
      <div className={cn("flex items-center", className)}>
        <Building className="h-5 w-5 mr-2 text-primary" />
        <span className="text-xl font-bold">{fallbackText}</span>
      </div>
    );
  }
  
  return (
    <img 
      src={`${logoUrl}?t=${Date.now()}`} // Cache busting
      alt="Company Logo"
      className={cn("h-10 max-w-[200px] object-contain", className)}
      style={{ maxHeight: height, maxWidth: width }}
      onError={() => setImgError(true)}
    />
  );
};

export default CompanyLogo;
