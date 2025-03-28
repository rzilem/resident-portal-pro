
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
    console.log('Starting upload');
    if (!file || !user) {
      setError('Please select a file and ensure you are logged in.');
      toast.error('Please select a file and ensure you are logged in.');
      return;
    }
    setUploading(true);
    setError(null);
    setSuccess(false);
    try {
      console.log('Uploading to bucket: documents, path:', `${user.id}/${file.name}`);
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(`${user.id}/${file.name}`, file, { upsert: true });
      if (error) throw error;
      console.log('Upload successful:', data);
      setSuccess(true);
      toast.success('Document uploaded successfully!');
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError('Upload failed: ' + err.message);
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Button
      onClick={handleUpload}
      disabled={uploading || !file}
      className="w-full"
      variant="default"
    >
      {uploading ? 'Uploading...' : 'Upload Document'}
    </Button>
  );
};
