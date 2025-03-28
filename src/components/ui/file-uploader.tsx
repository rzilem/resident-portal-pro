
import React, { useState } from 'react';
import { FileText, Upload, File as FileIcon } from 'lucide-react';

interface FileUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  disabled?: boolean;
  maxSize?: number; // in bytes
  acceptedTypes?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  file,
  setFile,
  disabled = false,
  maxSize = 5 * 1024 * 1024, // Default 5MB
  acceptedTypes = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };
  
  const validateAndSetFile = (selectedFile: File) => {
    setError(null);
    
    // Check file size
    if (selectedFile.size > maxSize) {
      setError(`File is too large. Maximum size is ${formatFileSize(maxSize)}.`);
      return;
    }
    
    // All validations passed
    setFile(selectedFile);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getFileIcon = () => {
    if (!file) return <Upload className="h-12 w-12 text-muted-foreground" />;
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'pdf') {
      return <FileText className="h-12 w-12 text-red-500" />;
    } else if (['doc', 'docx'].includes(extension || '')) {
      return <FileText className="h-12 w-12 text-blue-500" />;
    } else if (['xls', 'xlsx'].includes(extension || '')) {
      return <FileText className="h-12 w-12 text-green-500" />;
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <FileIcon className="h-12 w-12 text-purple-500" />;
    }
    
    return <FileIcon className="h-12 w-12 text-muted-foreground" />;
  };
  
  return (
    <div className="w-full">
      <div
        className={`border-2 ${isDragging ? 'border-primary' : 'border-dashed border-muted-foreground/25'} 
                   rounded-lg p-6 transition-colors text-center hover:border-primary/50 
                   ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('file-input')?.click()}
      >
        <input
          type="file"
          id="file-input"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
          accept={acceptedTypes}
        />
        
        <div className="flex flex-col items-center justify-center space-y-2">
          {getFileIcon()}
          
          {file ? (
            <>
              <p className="font-medium text-sm">{file.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                disabled={disabled}
              >
                Choose different file
              </button>
            </>
          ) : (
            <>
              <p className="font-medium">Drag & drop your file here or click to browse</p>
              <p className="text-xs text-muted-foreground">
                Supports PDF, Word, Excel, and image files up to {formatFileSize(maxSize)}
              </p>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
