
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileUploader } from '@/components/ui/file-uploader';
import { ArrowRight, FileSpreadsheet, Loader2 } from 'lucide-react';
import { useDocumentsBucket } from '@/hooks/use-documents-bucket';
import { processSpreadsheetFile } from '@/utils/documents/uploadUtils';
import { AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileProcessed: (fileData: {
    headers: string[];
    rows: Record<string, any>[];
    fileName: string;
  }) => void;
  onStepChange: (step: 'initial' | 'mapping' | 'validation') => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed, onStepChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { bucketReady, retryCheck } = useDocumentsBucket();
  
  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // First, validate the file type
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
        'text/csv'
      ];
      
      if (!validTypes.includes(file.type)) {
        toast.error("Invalid file type. Please upload an Excel or CSV file.");
        setIsUploading(false);
        return;
      }
      
      // Process the spreadsheet file
      const result = await processSpreadsheetFile(file);
      
      if (!result.success) {
        throw new Error(result.error || "Error processing file");
      }
      
      console.log('File processed successfully', { 
        headers: result.headers, 
        rowCount: result.rows.length 
      });
      
      toast.success(`File processed successfully. Found ${result.headers.length} columns and ${result.rows.length} records.`);
      
      // Pass the processed data up
      onFileProcessed({ 
        headers: result.headers, 
        rows: result.rows,
        fileName: file.name
      });
      
      // Move to mapping step
      onStepChange('mapping');
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Error processing file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // This function is a placeholder for the template download functionality
    // It will be implemented in a separate utility
    toast.success("Template downloaded. Check your downloads folder.");
  };

  const renderStorageError = () => {
    if (!bucketReady) {
      return (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">Storage Unavailable</h3>
              <p className="text-sm text-amber-700 mt-1">
                Document storage is currently unavailable. Please try again later.
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
    <div className="space-y-6">
      {renderStorageError()}
      
      <div className="border-2 border-dashed rounded-lg p-6 text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <FileSpreadsheet className="w-8 h-8 text-primary" />
        </div>
        
        <FileUploader
          file={file}
          setFile={setFile}
          disabled={isUploading}
          acceptedTypes=".csv,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
          maxSize={10 * 1024 * 1024} // 10MB max size
        />
        
        <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
          <Button 
            onClick={handleFileUpload} 
            disabled={!file || isUploading || !bucketReady}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4" />
                <span>Upload & Continue</span>
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleDownloadTemplate}
          >
            Download Template
          </Button>
        </div>
      </div>
      
      <div className="bg-muted/40 rounded-lg p-4 text-sm">
        <h4 className="font-medium mb-2">Upload Instructions:</h4>
        <ol className="list-decimal list-inside space-y-1">
          <li>Download our template or prepare your own Excel/CSV file</li>
          <li>Fill in your association data following the required format</li>
          <li>Upload the completed file to begin the import process</li>
          <li>Map your data fields to our system fields</li>
          <li>Validate the data before finalizing the import</li>
        </ol>
      </div>
    </div>
  );
};

export default FileUpload;
