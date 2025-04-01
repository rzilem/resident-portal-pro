
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUp, AlertCircle, Upload, Check } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { toast } from 'sonner';
import { uploadDocument } from '@/utils/documents/uploadDocument';
import { formatBytes } from '@/utils/documents/fileUtils';

interface DocumentUploadDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  associationId?: string;
  category?: string;
  // Add the missing props
  refreshDocuments?: () => void;
  categoryId?: string;
}

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  setOpen,
  onSuccess,
  associationId = '00000000-0000-0000-0000-000000000000',
  category = 'general',
  refreshDocuments,
  categoryId
}) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [tags, setTags] = useState('');

  // Use categoryId if provided (for backward compatibility)
  const effectiveCategory = categoryId || category;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Prefill name with file name without extension
      const fileName = selectedFile.name.split('.')[0];
      setName(fileName);
    }
  };

  const resetForm = () => {
    setFile(null);
    setName('');
    setDescription('');
    setTags('');
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter a document name');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to upload documents');
      return;
    }

    setIsUploading(true);

    try {
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const result = await uploadDocument({
        file,
        category: effectiveCategory,
        description,
        tags: tagsArray,
        associationId
      });

      if (result.success) {
        toast.success('Document uploaded successfully');
        resetForm();
        setOpen(false);
        // Call both callbacks if provided
        onSuccess?.();
        refreshDocuments?.();
      } else {
        toast.error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error in document upload:', error);
      toast.error('An unexpected error occurred during upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5 text-primary" />
            Upload Document
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Select File</Label>
            <div 
              onClick={() => document.getElementById('file-upload')?.click()}
              className="mt-1 border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:border-primary transition-colors"
            >
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <Check className="h-6 w-6 text-green-500" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="font-medium">Choose a file or drag and drop</p>
                  <p className="text-sm text-muted-foreground">PDF, Word, Excel, Images up to 50MB</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="document-name">Document Name</Label>
            <Input
              id="document-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter document name"
              disabled={isUploading}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="document-description">Description (Optional)</Label>
            <Textarea
              id="document-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter document description"
              disabled={isUploading}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="document-tags">Tags (Optional, comma separated)</Label>
            <Input
              id="document-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., financial, report, 2023"
              disabled={isUploading}
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                Uploading...
              </>
            ) : (
              <>
                <FileUp className="h-4 w-4" />
                Upload Document
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
