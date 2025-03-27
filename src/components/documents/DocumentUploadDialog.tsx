import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { uploadFile, getUserSpecificPath, ensureBucketExists } from '@/utils/documents';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { Loader2 } from 'lucide-react';
import FileUploader from './FileUploader';

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
}

const DocumentMetadataForm: React.FC<DocumentMetadataFormProps> = ({ file, onUploadComplete, onCancel, setIsUploading }) => {
  const [metadata, setMetadata] = useState<DocumentMetadata>({
    title: file.name,
    category: 'General',
    description: '',
  });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const bucketName = 'documents';
      const userSpecificPath = await getUserSpecificPath('user-documents');
      await ensureBucketExists(bucketName);

      const uploadResult = await uploadFile(file, bucketName, userSpecificPath);

      if (uploadResult) {
        toast({
          title: "Upload successful!",
          description: `${file.name} has been uploaded.`,
        });
        onUploadComplete();
      } else {
        toast({
          variant: "destructive",
          title: "Upload failed!",
          description: `Failed to upload ${file.name}. Please try again.`,
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Upload error!",
        description: "An unexpected error occurred during upload.",
      });
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
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({ open, setOpen }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const maxFiles = 1;
  const maxSize = 5 * 1024 * 1024; // 5MB

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setFiles([]);
    }
  };

  const handleFileSelection = (selectedFiles: File[]) => {
    if (selectedFiles && selectedFiles.length > 0) {
      setFiles(selectedFiles);
    }
  };

  const handleUploadComplete = () => {
    setFiles([]);
    setOpen(false);
  };

  const handleCancel = () => {
    setFiles([]);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Upload Document</Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md md:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload documents to the system. Supported file types include PDF, Word, Excel, and common image formats.
          </DialogDescription>
        </DialogHeader>

        {!files.length ? (
          <FileUploader
            onFileSelected={(files) => handleFileSelection(files)} 
            acceptedFileTypes={{
              'application/pdf': ['.pdf'],
              'application/msword': ['.doc'],
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
              'application/vnd.ms-excel': ['.xls'],
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/png': ['.png'],
              'text/plain': ['.txt']
            }}
            maxFiles={maxFiles}
            maxSize={maxSize}
          />
        ) : (
          <DocumentMetadataForm
            file={files[0]}
            onUploadComplete={handleUploadComplete}
            onCancel={handleCancel}
            setIsUploading={setIsUploading}
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
