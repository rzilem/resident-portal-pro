
import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface UploadStatusProps {
  error: string | null;
  success: boolean;
  demoMode?: boolean;
}

export const UploadStatus: React.FC<UploadStatusProps> = ({ 
  error, 
  success,
  demoMode = false
}) => {
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Upload Failed</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (success) {
    return (
      <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle>Upload Successful</AlertTitle>
        <AlertDescription>
          {demoMode ? 
            "Document uploaded in demo mode (not permanently stored)." : 
            "Your document has been uploaded successfully."}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
