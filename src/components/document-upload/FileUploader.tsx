
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud, X, FileText } from 'lucide-react';
import { formatBytes } from '@/utils/documents/fileUtils';

interface FileUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  maxSize?: number; // in bytes
  acceptedTypes?: string;
  disabled?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  file,
  setFile,
  maxSize = 10 * 1024 * 1024, // Default 10MB
  acceptedTypes,
  disabled = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file size
    if (maxSize && selectedFile.size > maxSize) {
      alert(`File is too large. Maximum size is ${formatBytes(maxSize)}`);
      return;
    }

    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Check file size
      if (maxSize && droppedFile.size > maxSize) {
        alert(`File is too large. Maximum size is ${formatBytes(maxSize)}`);
        return;
      }
      
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div 
      className={`rounded-md border-2 border-dashed p-6 
        ${file ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/25'} 
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50 transition-colors'}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => !disabled && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept={acceptedTypes}
        disabled={disabled}
      />
      
      <div className="flex flex-col items-center justify-center text-center">
        {file ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
              <FileText size={24} />
            </div>
            <div>
              <p className="font-medium truncate max-w-[200px] mx-auto">{file.name}</p>
              <p className="text-sm text-muted-foreground">{formatBytes(file.size)}</p>
            </div>
            <Button 
              type="button"
              variant="ghost" 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              disabled={disabled}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-4">
              <UploadCloud size={24} />
            </div>
            <div>
              <p className="font-medium">Drag a file here or click to browse</p>
              <p className="text-sm text-muted-foreground mt-1">
                {acceptedTypes ? `Accepted formats: ${acceptedTypes.replace(/\./g, '').toUpperCase()}` : 'All file types accepted'}
              </p>
              {maxSize && (
                <p className="text-sm text-muted-foreground mt-1">
                  Max size: {formatBytes(maxSize)}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
