
import React, { useState } from 'react';
import { FileText, Upload, File as FileIcon, X } from 'lucide-react';

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
  maxSize = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = "*"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const selectedFile = e.dataTransfer.files[0];
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    // Validate file size
    if (maxSize && selectedFile.size > maxSize) {
      alert(`File is too large. Maximum size is ${formatFileSize(maxSize)}.`);
      return;
    }
    
    // Validate file type if acceptedTypes is provided and not wildcard
    if (acceptedTypes !== "*") {
      const fileType = selectedFile.type;
      const fileExtension = `.${selectedFile.name.split('.').pop()?.toLowerCase()}`;
      const acceptedTypesList = acceptedTypes.split(',').map(type => type.trim());
      
      const isAccepted = acceptedTypesList.some(type => {
        if (type.startsWith('.')) {
          // Check file extension
          return fileExtension === type.toLowerCase();
        } else {
          // Check MIME type
          return fileType === type || (type.includes('/*') && fileType.startsWith(type.split('/*')[0]));
        }
      });
      
      if (!isAccepted) {
        alert(`Invalid file type. Accepted types: ${acceptedTypes}`);
        return;
      }
    }
    
    setFile(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <FileIcon className="h-6 w-6 text-purple-500" />;
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel') || fileType.includes('csv')) {
      return <FileIcon className="h-6 w-6 text-green-500" />;
    } else if (fileType.includes('pdf')) {
      return <FileIcon className="h-6 w-6 text-red-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FileIcon className="h-6 w-6 text-blue-500" />;
    } else {
      return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div 
      className={`border-2 ${isDragging ? 'border-primary' : 'border-dashed'} rounded-lg p-4 text-center transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept={acceptedTypes}
        disabled={disabled}
      />
      
      {file ? (
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-2">
            <div className="flex items-center">
              {getFileIcon(file.type)}
              <div className="ml-2 text-left">
                <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={removeFile} 
              className="p-1 rounded-full hover:bg-muted text-muted-foreground"
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="py-4">
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">Drag & drop a file here or click to browse</p>
          <p className="text-xs text-muted-foreground mt-1">
            {acceptedTypes !== "*" ? `Accepted formats: ${acceptedTypes}` : 'All file types accepted'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Max size: {formatFileSize(maxSize)}
          </p>
        </div>
      )}
    </div>
  );
};
