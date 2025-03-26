
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from 'sonner';

interface FileUploaderProps {
  onFileSelected: (file: File | null) => void;
  currentFile: File | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelected, currentFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelected(e.target.files[0]);
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
      onFileSelected(e.dataTransfer.files[0]);
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
                  ({(currentFile.size / 1024).toFixed(0)} KB)
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
              PDF, Word, or Excel files up to 10MB
            </p>
          </>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept=".pdf,.doc,.docx,.xls,.xlsx"
      />
    </div>
  );
};

export default FileUploader;
