
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  buttonText?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileUpload, 
  buttonText = 'Upload File' 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileUpload(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button onClick={handleUploadClick}>
            Select File
          </Button>
          {selectedFile && (
            <div>
              <p>Selected File: {selectedFile.name}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploader;
