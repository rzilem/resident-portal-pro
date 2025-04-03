
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Upload, X, Check, Info, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { DocumentCategory, DocumentUploadOptions } from '@/types/documents';
import FileUploader from '@/components/document-upload/FileUploader';
import { getDocumentCategories, formatCategoriesForSelection } from '@/utils/documents/documentUtils';
import { useDocuments } from '@/hooks/use-documents';

interface DocumentUploaderProps {
  associationId?: string;
  onUploadComplete?: (document: any) => void;
  onCancel?: () => void;
  category?: string;
}

const DocumentUploader = ({
  associationId,
  onUploadComplete,
  onCancel,
  category: initialCategory
}: DocumentUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>(initialCategory || 'general');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);

  const { uploadDocument } = useDocuments(associationId);

  useEffect(() => {
    // Load categories
    const fetchCategories = async () => {
      try {
        const cats = getDocumentCategories();
        setCategories(formatCategoriesForSelection(cats));
      } catch (err) {
        console.error('Error loading categories:', err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Update name when file changes
    if (file) {
      setName(file.name);
    } else {
      setName('');
    }
  }, [file]);

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const options: DocumentUploadOptions = {
        description,
        category,
        isPublic
      };

      const result = await uploadDocument(file, options);

      if (result) {
        toast.success('Document uploaded successfully');
        
        if (onUploadComplete) {
          onUploadComplete(result);
        }
        
        // Reset form
        setFile(null);
        setName('');
        setDescription('');
        setCategory(initialCategory || 'general');
        setIsPublic(false);
      } else {
        throw new Error('Failed to upload document');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message || 'Error uploading document');
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FileUploader
          file={file}
          setFile={setFile}
          maxSize={50 * 1024 * 1024} // 50MB limit
          acceptedTypes="*/*"
        />

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Document Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter document name"
              disabled={uploading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              className="w-full p-2 border rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={uploading}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description for this document"
              rows={3}
              disabled={uploading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
              disabled={uploading}
            />
            <Label htmlFor="public" className="cursor-pointer">
              Make document publicly accessible
            </Label>
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={uploading}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
        <Button
          type="button"
          onClick={handleUpload}
          disabled={!file || uploading}
        >
          {uploading ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              <span>Upload Document</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploader;
