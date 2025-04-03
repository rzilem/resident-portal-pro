
import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUp, AlertCircle } from 'lucide-react';
import FileUploader from './document-upload/FileUploader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useDocuments } from '@/hooks/use-documents';
import { DocumentUploadOptions } from '@/types/documents';

const UploadDocument = ({ associationId = '00000000-0000-0000-0000-000000000000' }) => {
  const { user, isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('general');
  const [description, setDescription] = useState('');
  
  const { uploadDocument } = useDocuments(associationId);
  
  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5 text-primary" />
            Upload Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-amber-800">Authentication Required</h3>
                <p className="text-sm text-amber-700 mt-1">
                  You must be logged in to upload documents.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);
    
    try {
      const options: DocumentUploadOptions = {
        description,
        category,
        isPublic: false
      };
      
      const result = await uploadDocument(file, options);
      
      if (result) {
        toast.success('Document uploaded successfully');
        setFile(null);
        setDescription('');
      } else {
        throw new Error('Failed to upload document');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
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
        <FileUploader 
          file={file}
          setFile={setFile}
          maxSize={10 * 1024 * 1024} // 10MB
        />
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <select
              id="category"
              className="w-full p-2 border rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={uploading}
            >
              <option value="general">General</option>
              <option value="financial">Financial</option>
              <option value="legal">Legal</option>
              <option value="meeting">Meeting Minutes</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </label>
            <textarea
              id="description"
              className="w-full p-2 border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={uploading}
              rows={3}
            />
          </div>
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleUpload} 
          disabled={!file || uploading}
        >
          {uploading ? (
            <span>Uploading...</span>
          ) : (
            <span className="flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              Upload Document
            </span>
          )}
        </Button>
        
        {error && (
          <div className="text-red-500 text-sm mt-2">
            <div className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadDocument;
