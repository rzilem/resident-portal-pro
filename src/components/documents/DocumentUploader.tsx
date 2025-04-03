
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, File, X, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { formatBytes } from '@/utils/format';
import { useDocumentCategories } from '@/hooks/use-document-categories';
import { useDocumentUpload } from '@/hooks/use-document-upload';

export interface DocumentUploaderProps {
  associationId?: string;
  onUploadComplete: () => void;
  onCancel?: () => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ 
  associationId,
  onUploadComplete,
  onCancel
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [category, setCategory] = useState<string>('general');
  const [description, setDescription] = useState<string>('');
  const { categories, loading: categoriesLoading } = useDocumentCategories();
  
  const { 
    uploadDocument, 
    isUploading, 
    progress, 
    error: uploadError 
  } = useDocumentUpload();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpeg', '.jpg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt']
    },
    maxSize: 10485760 // 10MB
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags(prev => [...prev, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    const fileToUpload = files[0]; // Upload first file
    
    try {
      await uploadDocument({
        file: fileToUpload,
        category,
        description,
        tags,
        associationId: associationId || ''
      });
      
      onUploadComplete();
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-1">Drag and drop file here</h3>
        <p className="text-sm text-muted-foreground mb-2">
          or click to browse files (PDF, DOC, XLS, JPG, PNG)
        </p>
        <p className="text-xs text-muted-foreground">Maximum file size: 10MB</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Selected File</h4>
          {files.map((file, index) => (
            <div 
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 border rounded-md"
            >
              <div className="flex items-center space-x-3">
                <File className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            value={category} 
            onValueChange={setCategory}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categoriesLoading ? (
                <div className="flex justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="meeting">Meeting Minutes</SelectItem>
                  <SelectItem value="policies">Policies & Rules</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea 
            id="description" 
            placeholder="Enter a brief description of the document"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (Optional)</Label>
          <div className="flex space-x-2">
            <Input 
              id="tags" 
              placeholder="Add tags and press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
            <Button type="button" onClick={addTag}>Add</Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button 
                    onClick={() => removeTag(tag)}
                    className="ml-1 rounded-full hover:bg-muted p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {uploadError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-red-600 flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Upload Failed</p>
            <p className="text-sm">{uploadError}</p>
          </div>
        </div>
      )}

      <Separator />

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={isUploading}
          >
            Cancel
          </Button>
        )}
        <Button 
          onClick={handleUpload} 
          disabled={files.length === 0 || isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Upload Document
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploader;
