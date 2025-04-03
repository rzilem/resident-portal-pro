
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Upload,
  File,
  AlertCircle,
  X,
  Tag
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { getDocumentCategories } from '@/utils/documents';
import { useDocuments } from '@/hooks/use-documents';

export interface DocumentUploaderProps {
  associationId?: string;
  onUploadComplete: () => void;
  onCancel: () => void;
  initialCategory?: string;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  associationId,
  onUploadComplete,
  onCancel,
  initialCategory = 'general'
}) => {
  const { uploadDocument } = useDocuments(associationId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  
  const categories = getDocumentCategories();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag('');
      if (tagInputRef.current) {
        tagInputRef.current.focus();
      }
    }
  };
  
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      const result = await uploadDocument(selectedFile, {
        description,
        category,
        tags
      });
      
      if (result) {
        toast.success(`${selectedFile.name} uploaded successfully`);
        onUploadComplete();
      } else {
        setError('Failed to upload document. Please try again.');
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* File upload area */}
      {!selectedFile ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? 'border-primary bg-primary/5' : 'border-border'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Drag and drop your file here</h3>
              <p className="text-sm text-muted-foreground">
                Support for PDF, Word, Excel, PowerPoint, and image files
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">or</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
            >
              Browse files
            </Button>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-6 relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 h-6 w-6"
            onClick={() => setSelectedFile(null)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-primary/10">
              <File className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{selectedFile.name}</div>
              <div className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type || 'Unknown type'}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Document metadata */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="doc-description">Description</Label>
          <Textarea
            id="doc-description"
            placeholder="Enter a description for this document"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="doc-category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="doc-category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="doc-tags">Tags</Label>
          <div className="flex space-x-2">
            <Input
              id="doc-tags"
              ref={tagInputRef}
              placeholder="Add tags"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
            <Button 
              type="button" 
              variant="outline"
              onClick={handleAddTag}
              disabled={!currentTag || tags.includes(currentTag)}
            >
              <Tag className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground p-0 h-4 w-4 ml-1"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={isUploading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Document'}
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploader;
