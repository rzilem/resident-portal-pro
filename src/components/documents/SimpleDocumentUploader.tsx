
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Loader2, FileCheck, LogIn } from "lucide-react";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { validateFileSize, validateFileType } from '@/utils/documents/fileUtils';
import { ensureDocumentsBucketExists } from '@/utils/documents/bucketUtils';
import { useAuth } from '@/contexts/auth/AuthProvider';

interface SimpleDocumentUploaderProps {
  onSuccess?: (url: string) => void;
  className?: string;
  associationId?: string;
}

const SimpleDocumentUploader = ({ onSuccess, className, associationId = '00000000-0000-0000-0000-000000000000' }: SimpleDocumentUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  const uploadDocument = async (file: File): Promise<{ success: boolean, url?: string, error?: string }> => {
    try {
      if (!isAuthenticated || !user) {
        return { success: false, error: "Authentication required to upload documents" };
      }
      
      // Initialize storage
      const storageReady = await ensureDocumentsBucketExists();
      if (!storageReady) {
        return { success: false, error: "Document storage is not available" };
      }
      
      // Validate file
      try {
        validateFileSize(file, 5); // 5MB limit
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "File is too large" };
      }
      
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/jpeg',
        'image/png',
      ];
      
      try {
        validateFileType(file, allowedTypes);
      } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Invalid file type" };
      }
      
      // Generate file path
      const timestamp = Date.now();
      const filePath = `${associationId}/uploads/${timestamp}_${file.name}`;
      
      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return { success: false, error: uploadError.message };
      }
      
      // Get file URL
      const { data } = await supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
        
      const publicUrl = data?.publicUrl || '';
      
      return { success: true, url: publicUrl };
    } catch (error) {
      console.error("Unexpected upload error:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      return { success: false, error: message };
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) {
      return;
    }
    
    if (!isAuthenticated) {
      toast.error("Please log in to upload documents");
      return;
    }
    
    setIsUploading(true);
    
    try {
      const { success, url, error } = await uploadDocument(file);
      
      if (success && url) {
        setUploadedUrl(url);
        toast.success('File uploaded successfully');
        if (onSuccess) {
          onSuccess(url);
        }
      } else if (error) {
        toast.error(`Upload failed: ${error}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      // Reset the input to allow uploading the same file again
      event.target.value = '';
    }
  };

  const handleLogin = () => {
    window.location.href = '/login';
  };

  if (!isAuthenticated) {
    return (
      <div className={`flex flex-col items-start gap-4 ${className}`}>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleLogin}
          >
            <LogIn className="mr-2 h-4 w-4" />
            <span>Log in to upload</span>
          </Button>
        </div>
      </div>
    );
  }

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
              // Cast to unknown first as recommended in the error message, then to the expected type
              if (e.target && 'files' in e.target) {
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
