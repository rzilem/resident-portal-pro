
import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, AlertCircle } from 'lucide-react';
import FileUploader from './document-upload/FileUploader';
import { UploadButton } from './document-upload/UploadButton';
import { AuthRequiredMessage } from './document-upload/AuthRequiredMessage';
import { UploadStatus } from './document-upload/UploadStatus';
import { useDocumentsBucket } from '@/hooks/use-documents-bucket';
import { Button } from '@/components/ui/button';

const UploadDocument = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const { bucketReady, demoMode, retryCheck } = useDocumentsBucket();
  
  if (!user) {
    return <AuthRequiredMessage />;
  }

  const renderDemoModeWarning = () => {
    if (demoMode) {
      return (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">Demo Mode Active</h3>
              <p className="text-sm text-amber-700 mt-1">
                Document storage is unavailable. Files will be processed but not permanently stored.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2" 
                onClick={retryCheck}
              >
                Retry Connection
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="max-w-md mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileUp className="h-5 w-5 text-primary" />
          Upload Document
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderDemoModeWarning()}
        
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
          demoMode={demoMode}
        />
        
        <UploadStatus 
          error={error} 
          success={success} 
          demoMode={demoMode}
        />
      </CardContent>
    </Card>
  );
};

export default UploadDocument;
