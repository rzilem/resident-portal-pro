
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from 'sonner';
import { handleDocumentStorageError } from '@/utils/documents/initializeBucket';
import { formatBytes } from '@/utils/documents/fileUtils';

interface FileUploaderProps {
  onFileSelected: (file: File | null) => void;
  currentFile: File | null;
  maxSize?: number;
  maxFiles?: number;
  acceptedFileTypes?: Record<string, string[]>;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileSelected, 
  currentFile,
  maxSize = 10 * 1024 * 1024, // 10MB default
  acceptedFileTypes
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const validateFile = (file: File): boolean => {
    try {
      // Check file size
      if (file.size > maxSize) {
        toast.error(`File is too large. Maximum size is ${formatBytes(maxSize)}.`);
        return false;
      }
      
      // Check file type if acceptedFileTypes is provided
      if (acceptedFileTypes) {
        const fileType = file.type;
        let isValidType = false;
        
        for (const [mimeType, extensions] of Object.entries(acceptedFileTypes)) {
          if (fileType === mimeType || extensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
            isValidType = true;
            break;
          }
        }
        
        if (!isValidType) {
          toast.error('File type not supported.');
          return false;
        }
      }
      
      return true;
    } catch (error) {
      const errorMessage = handleDocumentStorageError(error);
      toast.error(errorMessage);
      return false;
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (validateFile(file)) {
        onFileSelected(file);
      }
    }
  };
  
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      if (validateFile(file)) {
        onFileSelected(file);
      }
    }
  };
  
  const handleRemove = () => {
    onFileSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {currentFile ? (
          <div className="space-y-2 w-full">
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <div className="flex items-center space-x-2 truncate">
                <Upload className="h-5 w-5 flex-shrink-0 text-primary" />
                <span className="text-sm font-medium truncate">{currentFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({formatBytes(currentFile.size, 0)})
                </span>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-1">Drag and drop a file here or click to browse</p>
            <p className="text-xs text-muted-foreground">
              PDF, Word, or Excel files up to {formatBytes(maxSize, 0)}
            </p>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept={acceptedFileTypes ? Object.entries(acceptedFileTypes).flatMap(([mime, exts]) => [...exts, mime]).join(',') : undefined}
      />
    </div>
  );
};

export default FileUploader;
