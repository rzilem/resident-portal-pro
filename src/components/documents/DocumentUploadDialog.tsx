
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from '@/contexts/auth/AuthProvider';
import { Loader2 } from 'lucide-react';
import FileUploader from './FileUploader';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';
import { verifyDocumentsBucket } from '@/utils/documents/checkBucket';
import { debugLog, errorLog } from '@/utils/debug';

interface DocumentMetadata {
  title: string;
  category: string;
  description: string;
}

interface DocumentMetadataFormProps {
  file: File;
  onUploadComplete: () => void;
  onCancel: () => void;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  associationId: string;
}

const DocumentMetadataForm: React.FC<DocumentMetadataFormProps> = ({ 
  file, 
  onUploadComplete, 
  onCancel, 
  setIsUploading,
  associationId 
}) => {
  const [metadata, setMetadata] = useState<DocumentMetadata>({
    title: file.name,
    category: 'General',
    description: '',
  });
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      debugLog("Starting upload process for file:", file.name);
      debugLog("Association ID:", associationId);
      
      if (!associationId) {
        throw new Error("Association ID is required but not provided");
      }
      
      // Verify the bucket exists and is accessible
      const bucketExists = await verifyDocumentsBucket();
      if (!bucketExists) {
        throw new Error("Document storage is not accessible. Please try again later.");
      }
      
      // Upload file directly to Supabase storage
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop() || '';
      const filePath = `${metadata.category}/${timestamp}-${metadata.title}`;
      
      debugLog(`Uploading to path: ${filePath}`);
      
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        errorLog("Storage upload error:", error);
        throw error;
      }
      
      debugLog("Storage upload successful:", data);
      
      // Get the file URL
      const { data: urlData } = await supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      const fileUrl = urlData?.publicUrl;
      
      debugLog("File URL:", fileUrl);
      
      // Save document metadata to the database
      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .insert({
          name: metadata.title,
          description: metadata.description,
          file_size: file.size,
          file_type: file.type,
          url: fileUrl,
          category: metadata.category,
          uploaded_by: user?.id,
          is_public: false,
          version: 1,
          association_id: associationId
        });
      
      if (documentError) {
        errorLog("Database error:", documentError);
        throw documentError;
      }
      
      debugLog("Document metadata saved:", documentData);
      toast.success(`${file.name} has been uploaded.`);
      onUploadComplete();
    } catch (error) {
      errorLog("Upload error:", error);
      toast.error(`Failed to upload ${file.name}. ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          name="title"
          value={metadata.title}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          type="text"
          id="category"
          name="category"
          value={metadata.category}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          type="textarea"
          id="description"
          name="description"
          value={metadata.description}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Upload</Button>
      </div>
    </form>
  );
};

interface DocumentUploadDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  refreshDocuments?: () => void;
  associationId?: string;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({ 
  open, 
  setOpen, 
  onSuccess,
  refreshDocuments,
  associationId: propAssociationId 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentAssociationId, setCurrentAssociationId] = useState<string>("");
  const location = useLocation();
  
  // Determine association ID from props or from the URL
  useEffect(() => {
    if (propAssociationId) {
      setCurrentAssociationId(propAssociationId);
      debugLog("Using association ID from props:", propAssociationId);
    } else {
      // Try to extract association ID from URL path
      const pathParts = location.pathname.split('/');
      const associationPart = pathParts.findIndex(part => part === 'associations');
      if (associationPart !== -1 && pathParts.length > associationPart + 1) {
        setCurrentAssociationId(pathParts[associationPart + 1]);
        debugLog("Using association ID from URL:", pathParts[associationPart + 1]);
      } else {
        // Default to first association for demo purposes
        setCurrentAssociationId("00000000-0000-0000-0000-000000000000");
        debugLog("No association ID found, using default");
      }
    }
  }, [propAssociationId, location]);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setFile(null);
    }
  };

  const handleFileSelection = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      debugLog("File selected:", selectedFile.name);
    }
  };

  const handleUploadComplete = () => {
    setFile(null);
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
    if (refreshDocuments) {
      refreshDocuments();
    }
  };

  const handleCancel = () => {
    setFile(null);
    debugLog("File selection canceled");
  };

  if (!currentAssociationId) {
    errorLog("No association ID available for document upload");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload documents to the system. Supported file types include PDF, Word, Excel, and common image formats.
          </DialogDescription>
        </DialogHeader>

        {!file ? (
          <FileUploader
            onFileSelected={handleFileSelection} 
            currentFile={null}
          />
        ) : (
          <DocumentMetadataForm
            file={file}
            onUploadComplete={handleUploadComplete}
            onCancel={handleCancel}
            setIsUploading={setIsUploading}
            associationId={currentAssociationId}
          />
        )}

        {isUploading && (
          <div className="flex justify-center my-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Uploading document...</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
