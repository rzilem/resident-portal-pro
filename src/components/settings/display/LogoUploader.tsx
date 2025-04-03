
import React, { useState, useCallback, useRef } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { useCompanySettings } from '@/hooks/use-company-settings';
import { useAuth } from '@/hooks/use-auth';

const LogoUploader = () => {
  const { settings, isLoading, updateSetting, uploadLogo } = useCompanySettings();
  const { isAuthenticated } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const currentLogo = settings.logoUrl;
  
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!isAuthenticated) {
      toast.error('You must be logged in to upload a logo');
      return;
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, GIF, or WEBP)');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image file is too large. Please upload an image smaller than 5MB');
      return;
    }
    
    setIsUploading(true);
    toast.loading('Uploading logo...');
    
    try {
      // Use the company settings service to upload the logo
      const logoUrl = await uploadLogo(file);
      
      if (logoUrl) {
        toast.dismiss();
        toast.success('Logo uploaded successfully');
      } else {
        toast.dismiss();
        toast.error('Failed to upload logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.dismiss();
      toast.error('Failed to upload logo');
    } finally {
      setIsUploading(false);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isAuthenticated, uploadLogo]);
  
  const handleRemoveLogo = useCallback(async () => {
    if (!currentLogo || !isAuthenticated) return;
    
    try {
      await updateSetting('logoUrl', null);
      toast.success('Logo removed successfully');
    } catch (error) {
      console.error('Error removing logo:', error);
      toast.error('Failed to remove logo');
    }
  }, [currentLogo, updateSetting, isAuthenticated]);
  
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base">Company Logo</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your company logo to display in the header and sidebar.
        </p>
      </div>
      
      {isLoading ? (
        <Card className="overflow-hidden">
          <CardContent className="p-6 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : currentLogo ? (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col items-center p-6 relative">
              <img 
                src={currentLogo} 
                alt="Company Logo" 
                className="max-h-24 w-auto object-contain mb-4" 
              />
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isLoading || isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Change Logo
                </Button>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveLogo}
                  disabled={isLoading || isUploading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground mb-4" />
              
              <h3 className="text-lg font-medium mb-2">No logo uploaded</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your company logo to display in the header and sidebar.
              </p>
              
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading || isUploading}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Upload Logo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/png, image/jpeg, image/gif, image/webp"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default LogoUploader;
