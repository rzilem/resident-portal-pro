
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp } from 'lucide-react';
import { FileUploader } from './document-upload/FileUploader';
import { UploadButton } from './document-upload/UploadButton';
import { AuthRequiredMessage } from './document-upload/AuthRequiredMessage';
import { UploadStatus } from './document-upload/UploadStatus';

const UploadDocument = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  if (!user) {
    return <AuthRequiredMessage />;
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
        <FileUploader 
          file={file} 
          setFile={setFile} 
          disabled={uploading} 
        />
        
        <UploadButton 
          file={file}
          user={user}
          uploading={uploading}
          setUploading={setUploading}
          setError={setError}
          setSuccess={setSuccess}
        />
        
        <UploadStatus 
          error={error} 
          success={success} 
        />
      </CardContent>
    </Card>
  );
};

export default UploadDocument;
