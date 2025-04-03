
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUp, X, Plus, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getDocumentCategories } from '@/utils/documents/documentUtils';
import { useDocuments } from '@/hooks/use-documents';

interface DocumentUploaderProps {
  associationId?: string;
  initialCategory?: string;
  onUploadComplete?: () => void;
  onCancel?: () => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  associationId,
  initialCategory,
  onUploadComplete,
  onCancel
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [category, setCategory] = useState(initialCategory || 'general');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [dragging, setDragging] = useState(false);
  
  const { uploadDocument } = useDocuments(associationId);
  
  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file size (limit to 30MB)
      if (selectedFile.size > 30 * 1024 * 1024) {
        setFileError('File size exceeds the maximum limit of 30MB');
        return;
      }
      
      setFile(selectedFile);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    setFileError(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Validate file size (limit to 30MB)
      if (droppedFile.size > 30 * 1024 * 1024) {
        setFileError('File size exceeds the maximum limit of 30MB');
        return;
      }
      
      setFile(droppedFile);
    }
  };
  
  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput) && tags.length < 10) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };
  
  const handleSubmit = async () => {
    if (!file) {
      setFileError('Please select a file');
      return;
    }
    
    try {
      const result = await uploadDocument(file, {
        description,
        category,
        tags,
        isPublic
      });
      
      if (result) {
        resetForm();
        if (onUploadComplete) {
          onUploadComplete();
        }
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      setFileError('Failed to upload document');
    }
  };
  
  const resetForm = () => {
    setFile(null);
    setDescription('');
    setTags([]);
    setTagInput('');
    setIsPublic(false);
    setFileError(null);
  };
  
  const handleCancel = () => {
    resetForm();
    if (onCancel) {
      onCancel();
    }
  };
  
  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
        } ${fileError ? 'border-destructive bg-destructive/5' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        
        {file ? (
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-between w-full max-w-xs bg-primary/10 rounded p-2 mb-2">
              <span className="text-sm font-medium truncate">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Click to replace or drag and drop a different file
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <FileUp className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-1">
              Drag and drop or click to upload
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF, Word, Excel, PowerPoint, images, and more (Max 30MB)
            </p>
          </div>
        )}
        
        {fileError && (
          <p className="text-sm text-destructive mt-2">{fileError}</p>
        )}
      </div>
      
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {getDocumentCategories().map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="is-public" 
                checked={isPublic} 
                onCheckedChange={(checked) => setIsPublic(checked === true)}
              />
              <Label htmlFor="is-public" className="font-normal cursor-pointer">
                Make this document available to all users
              </Label>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Enter a description of the document"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (Optional)</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="tags"
                placeholder="Add tags..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Tag className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleAddTag}
              disabled={!tagInput || tags.includes(tagInput) || tags.length >= 10}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-3 w-3 ml-1 p-0"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
          
          <p className="text-xs text-muted-foreground mt-1">
            Add up to 10 tags to help organize and find this document later
          </p>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={!file}
          >
            Upload Document
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
