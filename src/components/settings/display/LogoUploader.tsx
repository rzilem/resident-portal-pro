
import React, { useState, useCallback, useRef } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from 'sonner';
import { useCompanySettings } from '@/hooks/use-company-settings';
import { useAuth } from '@/hooks/use-auth';
import { infoLog, errorLog } from '@/utils/debug';

const LogoUploader = () => {
  const { settings, isLoading, updateSetting, uploadLogo } = useCompanySettings();
  const { isAuthenticated } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const currentLogo = settings.logoUrl;
  
  infoLog('LogoUploader current logo URL:', currentLogo);
  
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
      infoLog('Starting logo upload process', file.name);
      // Use the company settings service to upload the logo
      const logoUrl = await uploadLogo(file);
      
      if (logoUrl) {
        toast.dismiss();
        toast.success('Logo uploaded successfully');
        infoLog('Logo upload complete, URL:', logoUrl);
      } else {
        toast.dismiss();
        toast.error('Failed to upload logo');
        errorLog('Logo upload failed, no URL returned');
      }
    } catch (error) {
      errorLog('Error uploading logo:', error);
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
    
    setIsRemoving(true);
    
    try {
      infoLog('Removing logo');
      const success = await updateSetting('logoUrl', null);
      
      if (success) {
        toast.success('Logo removed successfully');
        infoLog('Logo removed successfully');
      } else {
        toast.error('Failed to remove logo');
        errorLog('Failed to remove logo');
      }
    } catch (error) {
      errorLog('Error removing logo:', error);
      toast.error('Failed to remove logo');
    } finally {
      setIsRemoving(false);
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
              <div className="mb-4 border border-muted p-2 rounded-md">
                <img 
                  src={currentLogo} 
                  alt="Company Logo" 
                  className="max-h-24 w-auto object-contain" 
                  onError={(e) => {
                    console.error('Failed to load logo in uploader:', currentLogo);
                    e.currentTarget.src = "";
                    e.currentTarget.style.display = "none";
                    // Show placeholder instead
                    const placeholder = document.createElement('div');
                    placeholder.className = "flex items-center justify-center h-24 w-24 bg-muted rounded-md";
                    placeholder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/><path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>';
                    e.currentTarget.parentNode?.appendChild(placeholder);
                  }}
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isLoading || isUploading || isRemoving}
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
                  disabled={isLoading || isUploading || isRemoving}
                >
                  {isRemoving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
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
