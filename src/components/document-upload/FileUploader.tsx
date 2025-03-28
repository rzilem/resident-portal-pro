
import React from 'react';

interface FileUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  disabled: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ file, setFile, disabled }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors">
      <input
        type="file"
        onChange={handleFileChange}
        disabled={disabled}
        className="w-full cursor-pointer"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="text-sm text-muted-foreground block mt-2">
        {file ? file.name : 'Select a file to upload'}
      </label>
    </div>
  );
};
