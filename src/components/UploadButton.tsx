
import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface UploadButtonProps {
  file: File | null;
  user: User;
  uploading: boolean;
  setUploading: (uploading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: boolean) => void;
  demoMode?: boolean;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ 
  file, 
  user, 
  uploading, 
  setUploading, 
  setError, 
  setSuccess,
  demoMode = false
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
      if (demoMode) {
        // In demo mode, we simulate a successful upload
        console.log('Demo mode: Simulating upload of file:', file.name);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log('Demo mode: Upload simulation complete');
        setSuccess(true);
      } else {
        // Create a unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        console.log(`Attempting to upload file: ${filePath} to documents bucket`);
        
        // Upload file to Supabase storage
        const { error } = await supabase.storage
          .from('documents')
          .upload(filePath, file);
          
        if (error) {
          console.error('Supabase storage upload error:', error);
          throw error;
        }
        
        console.log('File uploaded successfully');
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);
          
        console.log('Generated URL:', urlData?.publicUrl);
        
        setSuccess(true);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
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
