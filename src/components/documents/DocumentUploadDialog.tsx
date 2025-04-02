
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { uploadDocument } from '@/services/document-upload';
import { useAuth } from '@/hooks/use-auth';
import { FileUp, Upload, X } from 'lucide-react';
import { IMAGE_CATEGORIES } from '@/pages/resale/wizard/components/admin/constants/imageCategories';
import Dropzone from 'react-dropzone';
import { Badge } from '@/components/ui/badge';
import { useSelectedAssociation } from '@/hooks/use-selected-association';
import { errorLog, infoLog } from '@/utils/debug';

interface DocumentUploadDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  refreshDocuments?: () => void;
  defaultCategory?: string;
  defaultDescription?: string;
  defaultTags?: string[];
  associationId?: string;
  // Add support for both categoryId and category
  categoryId?: string;
  category?: string;
}

const documentSchema = z.object({
  file: z.any().refine((file) => file, 'File is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).optional(),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

const DocumentUploadDialog: React.FC<DocumentUploadDialogProps> = ({
  open,
  setOpen,
  onSuccess,
  refreshDocuments,
  defaultCategory = 'general',
  defaultDescription = '',
  defaultTags = [],
  associationId: propAssociationId,
  categoryId,
  category,
}) => {
  const { user } = useAuth();
  const { selectedAssociation } = useSelectedAssociation();
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Use categoryId or category if provided, otherwise use defaultCategory
  const effectiveDefaultCategory = categoryId || category || defaultCategory;
  const [selectedTags, setSelectedTags] = useState<string[]>(defaultTags);
  const [customTag, setCustomTag] = useState('');

  const effectiveAssociationId = propAssociationId || selectedAssociation?.id || '';

  const { register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      description: defaultDescription,
      category: effectiveDefaultCategory,
      tags: defaultTags,
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setValue('file', acceptedFiles[0]);
    }
  };

  const handleAddTag = () => {
    if (customTag && !selectedTags.includes(customTag)) {
      const newTags = [...selectedTags, customTag];
      setSelectedTags(newTags);
      setValue('tags', newTags);
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(newTags);
    setValue('tags', newTags);
  };

  const resetForm = () => {
    reset();
    setSelectedFile(null);
    setSelectedTags(defaultTags);
    setUploadProgress(0);
  };

  const onSubmit = async (data: DocumentFormValues) => {
    if (!user) {
      toast.error('You must be logged in to upload documents');
      return;
    }

    if (!effectiveAssociationId) {
      toast.error('Please select an association first');
      return;
    }

    try {
      setUploading(true);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 100);

      infoLog('Uploading document', {
        fileName: selectedFile?.name,
        fileSize: selectedFile?.size,
        category: data.category,
        tags: selectedTags,
        associationId: effectiveAssociationId
      });

      const success = await uploadDocument({
        file: data.file,
        description: data.description || '',
        category: data.category,
        tags: selectedTags,
        associationId: effectiveAssociationId,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (success) {
        if (onSuccess) onSuccess();
        if (refreshDocuments) refreshDocuments();
        resetForm();
        
        // Short delay to show 100% progress before closing
        setTimeout(() => {
          setOpen(false);
        }, 500);
      }
    } catch (error) {
      errorLog('Error in document upload form submit:', error);
      toast.error('An error occurred while uploading the document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!uploading) {
        setOpen(newOpen);
        if (!newOpen) {
          resetForm();
        }
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5" />
            Upload Document
          </DialogTitle>
          <DialogDescription>
            Upload a document to the association's document library
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Dropzone onDrop={onDrop} multiple={false}>
              {({ getRootProps, getInputProps }) => (
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors
                    ${errors.file ? 'border-destructive' : 'border-border'}`}
                >
                  <input {...getInputProps()} id="file" />
                  {selectedFile ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{selectedFile.name}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setValue('file', null);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="py-4">
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Drag & drop a file here, or click to select
                      </p>
                    </div>
                  )}
                </div>
              )}
            </Dropzone>
            {errors.file && (
              <p className="text-destructive text-sm">{errors.file.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              defaultValue={effectiveDefaultCategory} 
              onValueChange={(value) => setValue('category', value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_CATEGORIES.filter(cat => cat.id !== 'all').map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-destructive text-sm">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              placeholder="Enter a description for this document"
              {...register('description')}
            />
          </div>

          <div className="space-y-2">
            <Label>Tags (Optional)</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 hover:bg-destructive/10 rounded-full"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Add a tag"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddTag}
                disabled={!customTag}
              >
                Add
              </Button>
            </div>
          </div>

          {uploading && (
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={uploading}
              className="gap-2"
            >
              {uploading ? (
                <>Uploading...</>
              ) : (
                <>
                  <FileUp className="h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploadDialog;
