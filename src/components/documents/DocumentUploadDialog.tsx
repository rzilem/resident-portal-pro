
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { initializeDocumentsBucket } from '@/utils/documents/bucketUtils';
import { validateFileSize, validateFileType } from '@/utils/documents/fileUtils';
import { getDocumentCategories } from '@/utils/documents/uploadUtils';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload, Upload, AlertCircle, Loader2 } from 'lucide-react';

interface DocumentUploadDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onSuccess?: () => void;
  refreshDocuments?: () => void;
  associationId?: string;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({ 
  open, 
  setOpen, 
  onSuccess, 
  refreshDocuments,
  associationId 
}) => {
  const { user, loading: authLoading } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('GENERAL');
  const [description, setDescription] = useState<string>('');
  const [isPreparing, setIsPreparing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  useEffect(() => {
    if (!open) return; // Only run when dialog is open
    
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const fetchedCategories = await getDocumentCategories();
        setCategories(fetchedCategories);
        
        // Set default category from fetched categories if available
        if (fetchedCategories.length > 0 && !category) {
          setCategory(fetchedCategories[0]);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
        toast.error("Failed to load document categories");
        
        // Set fallback categories
        setCategories(['GENERAL', 'FINANCIAL', 'LEGAL', 'MAINTENANCE']);
      } finally {
        setCategoriesLoading(false);
      }
    };
    
    loadCategories();
  }, [open, category]);

  useEffect(() => {
    if (!open) return; // Only run when dialog is open
    const prepareStorage = async () => {
      if (authLoading || !user) return; // Wait for auth to load
      if (isPreparing) return; // Prevent multiple calls
      setIsPreparing(true);
      try {
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
  }, [authLoading, user, open]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      if (!title) {
        // Auto-fill title with file name (without extension)
        const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
        setTitle(fileName || selectedFile.name);
      }
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setCategory('GENERAL');
    setDescription('');
  };

  const handleClose = () => {
    resetForm();
    setOpen(false);
  };

  const handleUpload = async () => {
    if (!user) {
      toast.error("Please log in to upload documents");
      console.error("User not authenticated");
      return;
    }
    if (!file) {
      toast.error("Please select a file to upload");
      console.error("No file selected");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title for the document");
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
      validateFileSize(file, 5); // 5MB limit
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
      ];
      validateFileType(file, allowedTypes);

      // Generate a unique file path using timestamp and file name
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const filePath = `${category}/${timestamp}_${title}.${fileExt}`;

      // Upload file
      console.log("Starting upload for file:", file.name);
      console.log("File path:", filePath);
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        toast.error(`Upload failed: ${uploadError.message}`);
        console.error("Upload error:", JSON.stringify(uploadError, null, 2));
        return;
      }

      // Get public URL
      console.log("Getting public URL for file:", filePath);
      const { data: { publicUrl } } = await supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Save document metadata to database
      console.log("Saving document metadata");
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          name: title,
          description: description,
          file_size: file.size,
          file_type: file.type,
          url: publicUrl,
          category: category,
          uploaded_by: user.id,
          association_id: associationId || '00000000-0000-0000-0000-000000000000', // Default UUID if none provided
          is_public: false,
          version: 1
        });

      if (dbError) {
        toast.error(`Failed to save document metadata: ${dbError.message}`);
        console.error("Database error:", dbError);
        
        // Try to delete the uploaded file since metadata save failed
        await supabase.storage.from('documents').remove([filePath]);
        return;
      }

      toast.success("Document uploaded successfully");
      console.log("Document uploaded successfully:", publicUrl);
      
      // Reset form and close dialog
      resetForm();
      setOpen(false);
      
      // Call success callbacks
      if (onSuccess) onSuccess();
      if (refreshDocuments) refreshDocuments();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Upload failed: ${message}`);
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUpload className="h-5 w-5" />
            Upload Document
          </DialogTitle>
          <DialogDescription>
            Upload documents to the system. Supported file types include PDF, Word, Excel, and common image formats.
          </DialogDescription>
        </DialogHeader>
        
        {authLoading ? (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading authentication...</p>
          </div>
        ) : !user ? (
          <div className="bg-destructive/10 p-4 rounded-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Authentication Required</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Please log in to upload documents.
                </p>
              </div>
            </div>
          </div>
        ) : isPreparing ? (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-center text-muted-foreground">
              Preparing document storage...
              <br />
              <span className="text-sm">Almost ready! Checking storage accessibility...</span>
            </p>
          </div>
        ) : !isStorageReady ? (
          <div className="bg-destructive/10 p-4 rounded-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">Document Storage Not Available</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  The system is having trouble accessing the document storage.
                  Please try again later or contact support.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Document title"
                  disabled={isUploading}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={category} 
                  onValueChange={setCategory}
                  disabled={isUploading || categoriesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional document description"
                  disabled={isUploading}
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={isUploading || !file || !title.trim()}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
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
