
import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatBytes } from '@/utils/documents/fileUtils';

export interface FileUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  maxSize?: number;
  acceptedTypes?: string;
  multiple?: boolean;
  disabled?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  file,
  setFile,
  maxSize = 10 * 1024 * 1024, // Default 10MB
  acceptedTypes = '*/*',
  multiple = false,
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize) {
      setError(`File size exceeds maximum allowed size (${formatBytes(maxSize)}).`);
      return false;
    }

    // Basic mime type validation if acceptedTypes is specified and not wildcard
    if (acceptedTypes !== '*/*') {
      const types = acceptedTypes.split(',').map(type => type.trim());
      const fileType = file.type || '';
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      
      const isValidType = types.some(type => {
        // Handle wildcard types like image/*
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return fileType.startsWith(category + '/');
        }
        
        // Handle specific mime types
        if (fileType === type) {
          return true;
        }
        
        // Handle extensions like .pdf
        if (type.startsWith('.') && extension === type.substring(1)) {
          return true;
        }
        
        return false;
      });
      
      if (!isValidType) {
        setError(`File type not accepted. Please upload a file of type: ${acceptedTypes}.`);
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 transition-colors
          ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${error ? 'border-red-500 bg-red-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptedTypes}
          multiple={multiple}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          {file ? (
            <>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <File className="h-8 w-8 text-primary" />
                  <div className="overflow-hidden text-left">
                    <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-lg font-medium">
                Drag and drop or click to upload
              </p>
              <p className="text-sm text-muted-foreground">
                Maximum file size: {formatBytes(maxSize)}
              </p>
              {acceptedTypes !== '*/*' && (
                <p className="text-xs text-muted-foreground mt-1">
                  Accepted file types: {acceptedTypes}
                </p>
              )}
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
