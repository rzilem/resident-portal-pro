
import React, { useState } from 'react';
import { useCompanyLogo } from '@/hooks/use-company-logo';
import { Building, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from "@/components/ui/skeleton";

interface CompanyLogoProps {
  className?: string;
  fallbackText?: string;
  height?: number;
  width?: number;
  showHoverHint?: boolean;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({
  className,
  fallbackText = 'ResidentPro',
  height = 40,
  width = 200,
  showHoverHint = false
}) => {
  const { logoUrl, isLoading, error } = useCompanyLogo();
  const [imgError, setImgError] = useState(false);
  
  if (isLoading) {
    return (
      <div className={cn("flex items-center", className)}>
        <Skeleton className="h-10 w-32 rounded" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={cn("flex items-center text-destructive", className)}>
        <Building className="h-5 w-5 mr-2" />
        <span className="text-xl font-bold">{fallbackText}</span>
      </div>
    );
  }
  
  if (!logoUrl || imgError) {
    return (
      <div 
        className={cn(
          "flex items-center", 
          showHoverHint && "group cursor-pointer relative",
          className
        )}
      >
        <Building className="h-5 w-5 mr-2 text-primary" />
        <span className="text-xl font-bold">{fallbackText}</span>
        
        {showHoverHint && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
            <div className="flex items-center text-sm font-medium text-muted-foreground">
              <ImageIcon className="h-4 w-4 mr-1" />
              <span>Upload logo</span>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className={cn(
      "relative", 
      showHoverHint && "group cursor-pointer",
      className
    )}>
      <img 
        src={`${logoUrl}?t=${Date.now()}`} // Cache busting
        alt="Company Logo"
        className={cn("h-10 max-w-[200px] object-contain", className)}
        style={{ maxHeight: height, maxWidth: width }}
        onError={() => setImgError(true)}
      />
      
      {showHoverHint && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
          <div className="flex items-center text-sm font-medium text-muted-foreground">
            <ImageIcon className="h-4 w-4 mr-1" />
            <span>Change logo</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyLogo;
