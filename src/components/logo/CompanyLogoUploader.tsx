
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCompanyLogo } from '@/hooks/use-company-logo';
import { ImageIcon, Upload, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import CompanyLogo from '@/components/branding/CompanyLogo';

interface CompanyLogoUploaderProps {
  onUploadComplete?: () => void;
}

const CompanyLogoUploader: React.FC<CompanyLogoUploaderProps> = ({
  onUploadComplete
}) => {
  const { logoUrl, uploadLogo, removeLogo } = useCompanyLogo();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const success = await uploadLogo(file);
      
      if (success && onUploadComplete) {
        onUploadComplete();
      }
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError('Failed to upload logo');
      toast.error('Failed to upload logo');
    } finally {
      setIsUploading(false);
      // Reset the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleRemove = async () => {
    try {
      await removeLogo();
    } catch (err) {
      console.error('Error removing logo:', err);
      toast.error('Failed to remove logo');
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg">
            <CompanyLogo showHoverHint height={80} width={240} />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center"
            >
              <Upload className="h-4 w-4 mr-2" />
              {logoUrl ? "Change Logo" : "Upload Logo"}
            </Button>
            
            {logoUrl && (
              <Button 
                variant="destructive" 
                onClick={handleRemove}
                disabled={isUploading}
                className="flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Remove Logo
              </Button>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </div>
          
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-md flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            <p>Recommended logo specifications:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>PNG or SVG format with transparent background</li>
              <li>Maximum dimensions: 500 x 100 pixels</li>
              <li>Maximum file size: 5MB</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyLogoUploader;
