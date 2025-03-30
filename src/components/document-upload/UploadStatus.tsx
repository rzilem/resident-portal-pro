
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

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
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (success) {
    return (
      <Alert variant="default" className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Success</AlertTitle>
        <AlertDescription className="text-green-700">
          {demoMode 
            ? "Document successfully processed (demo mode - not actually stored)" 
            : "Document successfully uploaded"}
        </AlertDescription>
      </Alert>
    );
  }

  if (demoMode) {
    return (
      <Alert variant="default" className="bg-amber-50 border-amber-200">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-800">Demo Mode</AlertTitle>
        <AlertDescription className="text-amber-700">
          In demo mode, files are processed locally but not stored permanently.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
