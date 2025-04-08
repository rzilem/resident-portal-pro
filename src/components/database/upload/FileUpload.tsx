
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileUp, Upload, Check, AlertTriangle } from 'lucide-react';
import { processSpreadsheetFile } from '@/utils/documents/uploadUtils';

interface FileUploadProps {
  onFileProcessed: (data: { 
    headers: string[]; 
    rows: Record<string, any>[];
    fileName: string;
  }) => void;
  onStepChange: (step: 'initial' | 'mapping' | 'validation') => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed, onStepChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    
    if (selectedFile) {
      console.log("File selected:", selectedFile.name);
      setFile(selectedFile);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });
  
  const handleProcessFile = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    console.log("Processing file:", file.name);
    
    try {
      const result = await processSpreadsheetFile(file);
      
      if (result.success) {
        console.log("File processed successfully:", { 
          headers: result.headers, 
          rowCount: result.rows.length 
        });
        
        onFileProcessed({
          headers: result.headers,
          rows: result.rows,
          fileName: file.name
        });
        
      } else {
        console.error("Error processing file:", result.error);
        toast.error(`Error processing file: ${result.error}`);
      }
    } catch (error) {
      console.error("Exception processing file:", error);
      toast.error("Failed to process file");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-medium">Upload Data File</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload Excel (.xlsx, .xls) or CSV files to import data
        </p>
        
        <Card>
          <CardContent className="p-6">
            {!file ? (
              <div 
                {...getRootProps()} 
                className={`
                  border-2 border-dashed rounded-md p-8
                  ${isDragActive ? 'border-primary/70 bg-primary/5' : 'border-gray-300/70 hover:border-primary/40'}
                  transition-colors duration-200 cursor-pointer text-center
                `}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {isDragActive ? 'Drop the file here' : 'Drag and drop file here'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Accepts Excel (.xlsx, .xls) or CSV files
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div className="flex items-center space-x-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                    Remove
                  </Button>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleProcessFile} 
                    disabled={isProcessing}
                    className="flex items-center gap-2"
                  >
                    <FileUp className="h-4 w-4" />
                    {isProcessing ? 'Processing...' : 'Process File'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FileUpload;
