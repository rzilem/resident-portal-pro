
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CompanyLogo from '@/components/branding/CompanyLogo';
import { useCompanyLogo } from '@/hooks/use-company-logo';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AppHeaderProps {
  className?: string;
  isAdmin?: boolean;
}

const AppHeader = ({ className, isAdmin = true }: AppHeaderProps) => {
  const { uploadLogo, deleteLogo } = useCompanyLogo();
  const { toast } = useToast();
  const [logoDialogOpen, setLogoDialogOpen] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleLogoClick = () => {
    if (isAdmin) {
      setLogoDialogOpen(true);
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    setUploadError(null);
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }
    
    // Check if file size is less than 2MB
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image must be smaller than 2MB');
      return;
    }
    
    setSelectedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploadingLogo(true);
    setUploadError(null);
    
    try {
      const success = await uploadLogo(selectedFile);
      
      if (success) {
        toast({
          title: "Logo updated",
          description: "Your company logo has been updated successfully.",
        });
        setLogoDialogOpen(false);
        setSelectedFile(null);
      } else {
        setUploadError("Failed to upload logo. Please try again.");
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      setUploadError("An unexpected error occurred. Please try again.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleDeleteLogo = async () => {
    setUploadingLogo(true);
    
    try {
      const success = await deleteLogo();
      
      if (success) {
        toast({
          title: "Logo removed",
          description: "Your company logo has been removed.",
        });
        setLogoDialogOpen(false);
        setSelectedFile(null);
      } else {
        setUploadError("Failed to remove logo. Please try again.");
      }
    } catch (error) {
      console.error('Error deleting logo:', error);
      setUploadError("An unexpected error occurred. Please try again.");
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div className={className}>
      <div onClick={handleLogoClick}>
        <CompanyLogo 
          height={40} 
          width={180} 
          showHoverHint={isAdmin}
        />
      </div>

      <Dialog open={logoDialogOpen} onOpenChange={setLogoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Company Logo</DialogTitle>
            <DialogDescription>
              Upload a logo for your company. This will be displayed in the header and on reports.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedFile ? (
              <div className="border rounded-md p-4 relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 h-6 w-6 rounded-full"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="flex flex-col items-center space-y-2">
                  <img 
                    src={URL.createObjectURL(selectedFile)} 
                    alt="Selected logo" 
                    className="max-h-32 max-w-full object-contain"
                  />
                  <span className="text-sm text-muted-foreground">
                    {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                  </span>
                </div>
              </div>
            ) : (
              <div 
                className={`border-2 border-dashed rounded-md p-8 text-center ${dragActive ? 'border-primary' : 'border-muted'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center space-y-4">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Drag and drop your logo here or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: JPEG, PNG, GIF, SVG (Max 2MB)
                    </p>
                  </div>
                  <Button asChild variant="secondary" size="sm">
                    <label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleLogoFileChange}
                      />
                      Browse files
                    </label>
                  </Button>
                </div>
              </div>
            )}
            
            {uploadError && (
              <div className="text-destructive flex items-start space-x-2 text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" disabled={uploadingLogo} onClick={handleDeleteLogo}>
              Remove Logo
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || uploadingLogo}
            >
              {uploadingLogo ? "Uploading..." : "Upload Logo"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppHeader;
