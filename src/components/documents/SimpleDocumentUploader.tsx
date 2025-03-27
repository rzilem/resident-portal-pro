
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Loader2, FileCheck } from "lucide-react";
import { toast } from 'sonner';
import { uploadDocument } from '@/utils/documents/uploadUtils';

interface SimpleDocumentUploaderProps {
  onSuccess?: (url: string) => void;
  className?: string;
}

const SimpleDocumentUploader = ({ onSuccess, className }: SimpleDocumentUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    setIsUploading(true);
    
    try {
      const { success, url, error } = await uploadDocument(file);
      
      if (success && url) {
        setUploadedUrl(url);
        if (onSuccess) {
          onSuccess(url);
        }
      }
      
      // Errors are already handled in the uploadDocument function with toast
    } finally {
      setIsUploading(false);
      // Reset the input to allow uploading the same file again
      event.target.value = '';
    }
  };

  return (
    <div className={`flex flex-col items-start gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Button 
          type="button"
          variant="outline"
          className="relative"
          disabled={isUploading}
          onClick={() => {
            // Create a hidden file input and trigger it
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = (e) => {
              // Using type assertion to safely convert Event to React.ChangeEvent<HTMLInputElement>
              if (e.target && (e.target as HTMLInputElement).files) {
                handleFileChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
              }
            };
            input.click();
          }}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              <span>Select File</span>
            </>
          )}
        </Button>
        
        {uploadedUrl && (
          <div className="flex items-center text-sm text-green-600">
            <FileCheck className="mr-1 h-4 w-4" />
            <span>File uploaded successfully</span>
          </div>
        )}
      </div>
      
      {uploadedUrl && (
        <div className="text-sm">
          <a 
            href={uploadedUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Uploaded File
          </a>
        </div>
      )}
    </div>
  );
};

export default SimpleDocumentUploader;
