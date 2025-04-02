
import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Upload } from 'lucide-react';

interface UploadButtonProps {
  file: File | null;
  user: User;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: boolean) => void;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ 
  file, 
  user, 
  uploading, 
  setUploading, 
  setError, 
  setSuccess
}) => {
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Upload file to Supabase storage
      const { error } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
        
      if (error) {
        throw error;
      }
      
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Button 
      className="w-full" 
      onClick={handleUpload} 
      disabled={!file || uploading}
    >
      {uploading ? (
        <span>Uploading...</span>
      ) : (
        <span className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Document
        </span>
      )}
    </Button>
  );
};
