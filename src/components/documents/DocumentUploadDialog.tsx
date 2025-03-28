
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { uploadDocument } from '@/services/document-upload';
import { ensureDocumentsBucketExists, testBucketAccess } from '@/utils/documents/bucketUtils';
import { useAssociations } from '@/hooks/use-associations';
import { FileUploader } from '../ui/file-uploader';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Loader2 } from 'lucide-react';

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
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { activeAssociation } = useAssociations();
  
  // Combine possible association IDs with a fallback
  const effectiveAssociationId = propAssociationId || activeAssociation?.id || 'default';
  
  // Document categories
  const categories = [
    { id: 'governing', name: 'Governing Documents' },
    { id: 'financial', name: 'Financial Documents' },
    { id: 'meetings', name: 'Meeting Minutes' },
    { id: 'legal', name: 'Legal Documents' },
    { id: 'rules', name: 'Rules & Regulations' },
    { id: 'contracts', name: 'Contracts' },
    { id: 'maintenance', name: 'Maintenance' },
    { id: 'correspondence', name: 'Correspondence' },
    { id: 'other', name: 'Other' }
  ];
  
  useEffect(() => {
    if (open) {
      prepareStorage();
    }
  }, [open]);
  
  const prepareStorage = async () => {
    if (!open) return;
    
    setPreparing(true);
    setStorageError(null);
    
    try {
      console.log('Checking if documents bucket exists...');
      const exists = await ensureDocumentsBucketExists();
      
      if (exists) {
        // Double-check access with a separate call
        const canAccess = await testBucketAccess();
        if (canAccess) {
          setStorageReady(true);
        } else {
          setStorageError('Document storage exists but cannot be accessed');
        }
      } else {
        setStorageError('Document storage is not available');
      }
    } catch (error) {
      console.error('Storage initialization failed', error);
      setStorageError('Failed to initialize document storage');
    } finally {
      setPreparing(false);
    }
  };
  
  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please select a file to upload."
      });
      return;
    }
    
    if (!category) {
      toast({
        variant: "destructive",
        title: "Category required",
        description: "Please select a document category."
      });
      return;
    }
    
    setUploading(true);
    
    try {
      const success = await uploadDocument({
        file,
        description,
        category,
        tags,
        associationId: effectiveAssociationId
      });
      
      if (success) {
        toast({
          title: "Upload successful",
          description: `${file.name} has been uploaded successfully.`
        });
        
        // Reset form
        setFile(null);
        setDescription('');
        setCategory('');
        setTags([]);
        
        // Close dialog
        setOpen(false);
        
        // Trigger success callback
        if (onSuccess) onSuccess();
        if (refreshDocuments) refreshDocuments();
      } else {
        toast({
          variant: "destructive",
          title: "Upload failed",
          description: "There was an error uploading your document. Please try again."
        });
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: "destructive",
        title: "Upload error",
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    } finally {
      setUploading(false);
    }
  };
  
  const handleRetryStorage = () => {
    prepareStorage();
  };
  
  // Content to show based on storage status
  const renderContent = () => {
    if (preparing) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h3 className="text-lg font-medium">Preparing document storage...</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Almost ready! Checking storage accessibility...
          </p>
        </div>
      );
    }
    
    if (storageError) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-red-100 p-3 mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium">Storage Not Available</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-6 text-center max-w-md">
            {storageError}. This may be due to network issues or permissions.
          </p>
          <Button onClick={handleRetryStorage}>Retry</Button>
        </div>
      );
    }
    
    // If storage is ready, show the upload form
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file">File</Label>
          <FileUploader file={file} setFile={setFile} disabled={uploading} />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description for this document"
            className="min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tags..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAddTag}
              disabled={!tagInput}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 rounded-full h-4 w-4 inline-flex items-center justify-center bg-muted-foreground/20 hover:bg-muted-foreground/30 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!file || uploading}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>Upload</>
            )}
          </Button>
        </DialogFooter>
      </form>
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload documents to the system. Supported file types include PDF, Word, Excel, and common image formats.
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
