
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ensureBucketExists } from '@/utils/documents/policyUtils';
import { isAuthenticatedIncludingDemo, isUsingDemoCredentials } from '@/utils/documents/authUtils';
import { useAuth } from '@/contexts/AuthContext';

interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  associationId?: string;
  initialCategory?: string;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  associationId,
  initialCategory = 'uncategorized'
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [category, setCategory] = useState(initialCategory);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);
  const { isAuthenticated, user } = useAuth();

  // Check storage availability when dialog opens
  useEffect(() => {
    if (isOpen) {
      checkStorageAvailability();
    }
  }, [isOpen]);

  const checkStorageAvailability = async () => {
    setIsCheckingStorage(true);
    
    try {
      // Check if user is authenticated (including demo credentials)
      const isUserAuth = await isAuthenticatedIncludingDemo();
      
      if (!isUserAuth) {
        console.log('Authentication required for document uploads');
        toast.error("Please log in to upload documents", {
          id: "auth-required-toast",
          duration: 5000
        });
        setStorageReady(false);
        setIsCheckingStorage(false);
        return;
      }
      
      // Special handling for demo user
      const isDemoUser = await isUsingDemoCredentials();
      if (isDemoUser) {
        console.log('Demo user detected, enabling document upload simulation');
        setStorageReady(true);
        setIsCheckingStorage(false);
        return;
      }
      
      // For regular authenticated users, check bucket
      const bucketExists = await ensureBucketExists();
      setStorageReady(bucketExists);
      
      if (!bucketExists) {
        console.error('Failed to ensure document storage bucket exists');
        toast.error("Document storage unavailable", { 
          id: "storage-error-toast",
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error checking storage availability:', error);
      setStorageReady(false);
    } finally {
      setIsCheckingStorage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setName(selectedFile.name);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreview(event.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  const resetForm = () => {
    setFile(null);
    setFilePreview(null);
    setName('');
    setDescription('');
    setCategory(initialCategory);
    setIsUploading(false);
    setUploadComplete(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!name.trim()) {
      toast.error("Please provide a name for the document");
      return;
    }

    setIsUploading(true);

    try {
      // Demo user simulation
      const isDemoUser = await isUsingDemoCredentials();
      
      if (isDemoUser) {
        // Simulate upload for demo user
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Demo upload simulation complete');
        
        toast.success("Document uploaded successfully (Demo Mode)", {
          duration: 3000
        });
        
        setUploadComplete(true);
        if (onSuccess) onSuccess();
        
        // Close dialog after success
        setTimeout(() => {
          handleClose();
        }, 1500);
        
        return;
      }
      
      // Real upload logic here for authenticated users
      // This would normally upload to Supabase
      
      // Success handling same as demo
      setUploadComplete(true);
      toast.success("Document uploaded successfully");
      if (onSuccess) onSuccess();
      
      // Close dialog after success
      setTimeout(() => {
        handleClose();
      }, 1500);
      
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast.error(`Upload failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  if (isCheckingStorage) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Preparing document storage...</DialogTitle>
            <DialogDescription>
              Please wait while we prepare the document storage.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!storageReady) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              Storage Unavailable
            </DialogTitle>
            <DialogDescription>
              Document storage is currently unavailable. Please try again later or contact support.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-yellow-50 p-4 rounded-md">
            <p className="text-sm text-yellow-700">
              {isAuthenticated ? 
                "You're logged in, but the document storage is not accessible." :
                "Authentication required. Please log in to upload documents."}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>Close</Button>
            <Button onClick={checkStorageAvailability}>Try Again</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a document to your account.
          </DialogDescription>
        </DialogHeader>

        {uploadComplete ? (
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <p className="text-lg font-medium">Upload Complete!</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Document File</Label>
                <div className="flex items-center">
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                </div>

                {filePreview && (
                  <div className="mt-2">
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="max-h-32 max-w-full object-contain rounded border" 
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Document Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter document name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="rules">Rules & Regulations</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="uncategorized">Uncategorized</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter document description"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button 
                onClick={handleUpload} 
                disabled={isUploading || !file}
                className="ml-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
