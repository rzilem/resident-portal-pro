
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, UploadCloud, X } from "lucide-react";
import { useCompanySettings } from '@/hooks/use-company-settings';
import { toast } from 'sonner';

const LogoUploader = () => {
  const { settings, updateSetting } = useCompanySettings();
  const [logoPreview, setLogoPreview] = useState<string | null>(settings.logoUrl || null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setIsUploading(true);

    // Create a data URL for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoPreview(result);
      
      // In a real app, you would upload to a server here
      // For now, we'll just save the data URL
      updateSetting('logoUrl', result)
        .then(() => {
          toast.success('Logo updated successfully');
        })
        .catch((error) => {
          toast.error('Failed to update logo');
          console.error('Error updating logo:', error);
        })
        .finally(() => {
          setIsUploading(false);
        });
    };
    
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoPreview(null);
    updateSetting('logoUrl', null)
      .then(() => {
        toast.success('Logo removed');
      })
      .catch((error) => {
        toast.error('Failed to remove logo');
        console.error('Error removing logo:', error);
      });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Company Logo</label>
        {logoPreview && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={removeLogo}
            className="text-destructive hover:text-destructive"
          >
            <X className="h-4 w-4 mr-1" />
            Remove Logo
          </Button>
        )}
      </div>
      
      {logoPreview ? (
        <div className="relative border rounded-md p-4 flex items-center justify-center">
          <img 
            src={logoPreview} 
            alt="Company Logo" 
            className="max-h-32 max-w-full object-contain" 
          />
        </div>
      ) : (
        <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center bg-muted/30">
          <Image className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">No logo uploaded</p>
          <p className="text-xs text-muted-foreground mb-4">Recommended size: 250x80px</p>
        </div>
      )}
      
      <div className="flex items-center">
        <Input
          type="file"
          id="logo-upload"
          className="hidden"
          accept="image/*"
          onChange={handleLogoChange}
        />
        <Button 
          asChild 
          variant="outline" 
          size="sm" 
          disabled={isUploading}
        >
          <label htmlFor="logo-upload" className="cursor-pointer">
            <UploadCloud className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Logo'}
          </label>
        </Button>
      </div>
    </div>
  );
};

export default LogoUploader;
