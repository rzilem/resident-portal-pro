
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCompanyLogo } from '@/hooks/use-company-logo';
import { FileUploader } from '@/components/ui/file-uploader';
import { Loader2, Upload, Trash } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const LogoUploader: React.FC = () => {
  const { logoUrl, isLoading, uploadLogo, deleteLogo } = useCompanyLogo();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      await uploadLogo(file);
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDelete = async () => {
    await deleteLogo();
    setShowDeleteDialog(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Logo</CardTitle>
        <CardDescription>
          Upload your company logo to display in the app and on reports.
          Use a PNG or JPG file with transparent background if possible.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {logoUrl && (
          <div className="p-4 border rounded-md flex justify-center items-center bg-gray-50">
            <img 
              src={logoUrl} 
              alt="Current company logo" 
              className="max-h-32 max-w-full object-contain"
            />
          </div>
        )}
        
        <FileUploader
          file={file}
          setFile={setFile}
          disabled={isUploading}
          acceptedTypes="image/*"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        {logoUrl ? (
          <Button 
            variant="destructive" 
            onClick={() => setShowDeleteDialog(true)}
            disabled={isUploading}
          >
            <Trash className="h-4 w-4 mr-2" />
            Remove Logo
          </Button>
        ) : (
          <div /> // Empty div to maintain spacing with flex justify-between
        )}
        
        <Button 
          onClick={handleUpload} 
          disabled={!file || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Logo
            </>
          )}
        </Button>
      </CardFooter>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Company Logo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove your company logo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default LogoUploader;
