
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { initializeDocumentsBucket } from '@/utils/documents/bucketUtils';
import { validateFileSize, validateFileType } from '@/utils/documents/fileUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Upload } from 'lucide-react';
import { saveDocumentMetadata } from '@/utils/documents/documentDbUtils';
import { DocumentFile } from '@/types/documents';

interface DocumentUploadDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  refreshDocuments?: () => void;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({ 
  open, 
  setOpen, 
  onSuccess, 
  refreshDocuments 
}) => {
  const { user, isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('GENERAL');
  const [description, setDescription] = useState<string>('');
  const [isPreparing, setIsPreparing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isStorageReady, setIsStorageReady] = useState(false);

  useEffect(() => {
    if (!open) return;
    
    const prepareStorage = async () => {
      if (!isAuthenticated) return;
      if (isPreparing) return; // Prevent multiple calls
      
      setIsPreparing(true);
      try {
        console.log("Initializing document storage bucket...");
        const success = await initializeDocumentsBucket();
        
        if (success) {
          setIsStorageReady(true);
          console.log("Storage initialized successfully");
        } else {
          toast.error("Failed to initialize document storage");
          console.error("Storage initialization failed");
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error("Storage initialization error:", message);
        toast.error("Document storage is not available");
      } finally {
        setIsPreparing(false);
      }
    };
    
    prepareStorage();
  }, [open, isAuthenticated, isPreparing]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setFile(null);
      setTitle('');
      setCategory('GENERAL');
      setDescription('');
    }
  }, [open]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      
      // Auto-fill title with file name (without extension)
      const fileName = selectedFile.name.replace(/\.[^/.]+$/, "");
      setTitle(fileName);
    }
  };

  const handleUpload = async () => {
    if (!isAuthenticated || !user) {
      toast.error("Please log in to upload documents");
      console.error("User not authenticated");
      return;
    }
    
    if (!file) {
      toast.error("Please select a file to upload");
      console.error("No file selected");
      return;
    }
    
    if (!isStorageReady) {
      toast.error("Document storage is not ready");
      console.error("Storage not ready");
      return;
    }

    setIsUploading(true);
    
    try {
      // Validate file
      console.log("Validating file:", file.name);
      if (!validateFileSize(file, 5 * 1024 * 1024)) { // 5MB limit
        toast.error("File is too large. Maximum size is 5MB.");
        return;
      }
      
      if (!validateFileType(file, [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
        'application/vnd.ms-excel', 
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
        'image/jpeg', 
        'image/png'
      ])) {
        toast.error("File type not supported. Please upload a PDF, Word, Excel, or image file.");
        return;
      }

      // Generate a unique file path
      const timestamp = Date.now();
      const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filePath = `uploads/${timestamp}_${fileName}`;
      
      // Upload file
      console.log("Starting upload for file:", file.name, "to path:", filePath);
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(uploadError.message);
      }

      // Get public URL
      console.log("Getting public URL for file:", filePath);
      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      if (urlError) {
        console.error("URL error:", urlError);
        throw new Error("Failed to get public URL");
      }

      // Save document metadata to database
      const documentData: Partial<DocumentFile> = {
        name: title || file.name,
        description: description,
        fileSize: file.size,
        fileType: file.type,
        url: publicUrl,
        category: category.toLowerCase(),
        tags: [category.toLowerCase()],
        uploadedBy: user.id,
        uploadedDate: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: 1,
        isPublic: true,
        isArchived: false
      };

      console.log("Saving document metadata:", documentData);
      const documentId = await saveDocumentMetadata(documentData);
      
      if (!documentId) {
        console.error("Failed to save document metadata");
        throw new Error("Failed to save document metadata");
      }

      console.log("Document uploaded successfully with ID:", documentId);
      toast.success("Document uploaded successfully");
      
      // Reset form and close dialog
      setFile(null);
      setTitle('');
      setCategory('GENERAL');
      setDescription('');
      
      // Call success callback if provided
      if (onSuccess) onSuccess();
      if (refreshDocuments) refreshDocuments();
      
      setOpen(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload documents to the system. Supported file types include PDF, Word, Excel, and common image formats.
          </DialogDescription>
        </DialogHeader>

        {!isAuthenticated ? (
          <div className="text-center py-4">
            <p className="text-destructive">Please log in to upload documents</p>
          </div>
        ) : isPreparing ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Preparing document storage...</p>
            <p className="text-sm text-muted-foreground">This will only take a moment.</p>
          </div>
        ) : !isStorageReady ? (
          <div className="text-center py-4 space-y-2">
            <p className="text-destructive">Document storage is not available</p>
            <p className="text-sm text-muted-foreground">The system is having trouble accessing the document storage.</p>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isUploading}
                placeholder="Document title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={category} 
                onValueChange={setCategory}
                disabled={isUploading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="FINANCIAL">Financial</SelectItem>
                  <SelectItem value="LEGAL">Legal</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isUploading}
                placeholder="Optional description"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="file">Document File</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                disabled={isUploading}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">Maximum file size: 5MB</p>
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-row justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isUploading}
            className="mt-2 sm:mt-0"
          >
            Cancel
          </Button>
          
          <Button
            onClick={handleUpload}
            disabled={isUploading || !file || !isAuthenticated || !isStorageReady}
            className="mt-2 sm:mt-0"
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
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
