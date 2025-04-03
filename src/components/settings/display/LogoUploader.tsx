
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Trash2, Image as ImageIcon, Loader2, RefreshCw, Check } from "lucide-react";
import { toast } from 'sonner';
import { useCompanySettings } from '@/hooks/use-company-settings';
import { useAuth } from '@/hooks/use-auth';
import { infoLog, errorLog } from '@/utils/debug';

const LogoUploader = () => {
  const { settings, isLoading, updateSetting, uploadLogo, refreshSettings } = useCompanySettings();
  const { isAuthenticated } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Update local state when settings change or from localStorage
  useEffect(() => {
    // Check localStorage first for immediate updates
    const storedLogo = localStorage.getItem('company_logo_url');
    
    if (storedLogo) {
      setLogoUrl(storedLogo);
      setImgError(false);
    } else if (settings.logoUrl) {
      setLogoUrl(settings.logoUrl);
      setImgError(false);
    } else {
      setLogoUrl(null);
    }
  }, [settings.logoUrl]);
  
  // Listen for logo update events
  useEffect(() => {
    const handleLogoUpdate = () => {
      const storedLogo = localStorage.getItem('company_logo_url');
      if (storedLogo) {
        setLogoUrl(storedLogo);
        setImgError(false);
      } else {
        setLogoUrl(null);
      }
    };
    
    window.addEventListener('logoUpdate', handleLogoUpdate);
    return () => window.removeEventListener('logoUpdate', handleLogoUpdate);
  }, []);
  
  // Try to refresh settings when component mounts
  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);
  
  // Clear success state after a timeout
  useEffect(() => {
    if (uploadSuccess) {
      const timer = setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadSuccess]);
  
  infoLog('LogoUploader rendering with logo URL:', logoUrl);
  
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
      const newLogoUrl = await uploadLogo(file);
      
      if (newLogoUrl) {
        toast.dismiss();
        toast.success('Logo uploaded successfully');
        infoLog('Logo upload complete, URL:', newLogoUrl);
        
        // Update local state
        setLogoUrl(newLogoUrl);
        setImgError(false);
        setUploadSuccess(true);
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
    if (!logoUrl || !isAuthenticated) return;
    
    setIsRemoving(true);
    
    try {
      infoLog('Removing logo');
      const success = await updateSetting('logoUrl', null);
      
      if (success) {
        toast.success('Logo removed successfully');
        infoLog('Logo removed successfully');
        setLogoUrl(null);
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
  }, [logoUrl, updateSetting, isAuthenticated]);
  
  const handleRefreshSettings = useCallback(() => {
    toast.info('Refreshing settings...');
    refreshSettings();
  }, [refreshSettings]);
  
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
      ) : logoUrl && !imgError ? (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col items-center p-6 relative">
              <div className="mb-4 border border-muted p-2 rounded-md">
                <img 
                  src={`${logoUrl}?t=${Date.now()}`} 
                  alt="Company Logo" 
                  className="max-h-24 w-auto object-contain" 
                  onError={(e) => {
                    errorLog('Failed to load logo in uploader:', logoUrl);
                    setImgError(true);
                    e.currentTarget.src = "";
                    e.currentTarget.style.display = "none";
                    // Try refreshing settings on error
                    refreshSettings();
                  }}
                />
              </div>
              
              {uploadSuccess && (
                <div className="absolute top-2 right-2 bg-green-100 text-green-800 p-1.5 rounded-full">
                  <Check className="h-4 w-4" />
                </div>
              )}
              
              <div className="flex gap-2 flex-wrap">
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
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshSettings}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
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
              
              <div className="flex gap-2">
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
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshSettings}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Settings
                </Button>
              </div>
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
