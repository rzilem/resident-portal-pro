
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  UploadIcon, 
  FileIcon, 
  XIcon, 
  CheckIcon, 
  AlertCircleIcon, 
  Loader2Icon 
} from "lucide-react";
import { toast } from 'sonner';
import { uploadDocument } from '@/services/document-upload';
import { infoLog, errorLog } from '@/utils/debug';

interface DocumentUploaderProps {
  associationId: string;
  onUploadComplete?: () => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ 
  associationId, 
  onUploadComplete 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files?.length) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      infoLog('Starting document upload', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        category,
        tags
      });

      const uploadParams = {
        file,
        description,
        category,
        tags,
        associationId
      };

      const success = await uploadDocument(uploadParams);

      if (success) {
        toast.success('Document uploaded successfully');
        infoLog('Document upload completed successfully');
        
        // Reset form
        setFile(null);
        setDescription('');
        setTags([]);
        setTagInput('');
        
        if (onUploadComplete) {
          onUploadComplete();
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error uploading document';
      setError(errorMessage);
      errorLog('Document upload error:', err);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${file ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50'}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />

        {file ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <FileIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
            >
              Remove
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-muted p-3 rounded-full">
              <UploadIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">Drag file here or click to upload</p>
              <p className="text-xs text-muted-foreground">
                Support for PDF, DOC, DOCX, XLS, XLSX, JPEG, PNG and more
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="meeting">Meeting Minutes</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
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
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a tag"
              className="flex-1"
            />
            <Button type="button" onClick={handleAddTag} variant="outline">
              Add
            </Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <div 
                  key={tag} 
                  className="bg-muted px-2 py-1 rounded-full flex items-center gap-1 text-sm"
                >
                  <span>{tag}</span>
                  <button 
                    onClick={() => handleRemoveTag(tag)}
                    className="text-muted-foreground hover:text-foreground rounded-full"
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-start gap-2">
            <AlertCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button 
            onClick={handleUpload} 
            disabled={!file || uploading}
            className="min-w-[120px]"
          >
            {uploading ? (
              <>
                <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <UploadIcon className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
