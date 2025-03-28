
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { FileUp } from 'lucide-react';

const UploadDocument = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

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

  if (!user) {
    return (
      <Card className="shadow-md">
        <CardContent className="text-center p-6">
          <p className="text-muted-foreground">Please log in to upload documents.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUp className="h-5 w-5 text-primary" />
          Upload Document
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors">
          <input
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            className="w-full cursor-pointer"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="text-sm text-muted-foreground block mt-2">
            {file ? file.name : 'Select a file to upload'}
          </label>
        </div>
        
        <Button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="w-full"
          variant="default"
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </Button>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">Upload successful!</p>}
      </CardContent>
    </Card>
  );
};

export default UploadDocument;
