
import React, { useState, useCallback } from 'react';
import { useDocumentsBucket } from '@/hooks/use-documents-bucket';
import { Button } from '@/components/ui/button';
import { Upload, AlertCircle, FileUp, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { infoLog, errorLog } from '@/utils/debug';
import { uploadFile } from '@/utils/supabase/storage/uploadFile';
import { useAuth } from '@/contexts/auth/AuthProvider';

interface UploadDataTabProps {
  onComplete: () => void;
}

const UploadDataTab: React.FC<UploadDataTabProps> = ({ onComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { bucketReady, checking, error, retryCheck } = useDocumentsBucket();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload first.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload files.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    infoLog('Starting file upload');

    try {
      const fileUrl = await uploadFile(
        file,
        'documents',
        'imports',
        { 
          useDemo: true,
          contentType: file.type
        }
      );

      if (!fileUrl) {
        throw new Error('Upload failed');
      }

      infoLog('File uploaded successfully:', fileUrl);
      toast({
        title: "Upload successful",
        description: "Your file has been uploaded.",
      });
      
      setFile(null);
      onComplete();
    } catch (error) {
      errorLog('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // If storage is not available, show an alert
  if (!bucketReady && !checking) {
    return (
      <div className="space-y-4">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">Storage Unavailable</h3>
              <p className="text-sm text-amber-700 mt-1">
                Document storage is currently unavailable. Please try again later.
                {error && <span className="block mt-1">{error}</span>}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={retryCheck} 
                className="mt-3"
                disabled={checking}
              >
                {checking ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Connection
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div 
        className="border-2 border-dashed rounded-lg p-10 text-center hover:bg-muted/50 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="bg-primary/10 p-4 rounded-full">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-lg">Drag & drop a file here or click to browse</h3>
            <p className="text-muted-foreground">
              Accepted formats: .csv, .xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv
            </p>
            <p className="text-sm text-muted-foreground">Max size: 10 MB</p>
          </div>
          
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept=".csv,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
          />
          
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={uploading}
          >
            <FileUp className="h-4 w-4 mr-2" />
            Select File
          </Button>
        </div>
      </div>
      
      {file && (
        <div className="bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFile(null)}
              disabled={uploading}
            >
              <span className="sr-only">Remove</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="M18 6L6 18"></path>
                <path d="M6 6l12 12"></path>
              </svg>
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex space-x-2 justify-end">
        <Button
          disabled={!file || uploading}
          onClick={handleUpload}
        >
          {uploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload & Continue
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default UploadDataTab;
