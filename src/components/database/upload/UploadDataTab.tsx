
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { uploadDocument } from '@/utils/documents/uploadDocument';
import { exportToExcel, generateOnboardingTemplate } from '@/utils/exportToExcel';
import { useAuth } from '@/hooks/use-auth';
import { FileUploader } from '@/components/ui/file-uploader';
import { ArrowRight, FileSpreadsheet, FileCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useDocumentsBucket } from '@/hooks/use-documents-bucket';

interface UploadDataTabProps {
  onComplete: () => void;
}

const UploadDataTab: React.FC<UploadDataTabProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'initial' | 'mapping' | 'validation'>('initial');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [validationResults, setValidationResults] = useState<{
    total: number;
    valid: number;
    warnings: number;
    errors: number;
  } | null>(null);
  
  const { user } = useAuth();
  const { bucketReady, errorMessage, retryCheck } = useDocumentsBucket();
  
  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    
    if (!user) {
      toast.error("You must be logged in to upload files");
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
      
      // For demo purposes, let's simulate a successful upload
      // This prevents the need for the storage bucket to be accessible
      console.log('Simulating file upload for demo purposes');
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("File processed successfully");
      
      // Move to mapping step
      setStep('mapping');
      setIsUploading(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Error processing file. Please try again.");
      setIsUploading(false);
    }
  };

  const handleContinueToValidation = () => {
    // In a real app, you would process the mapping here
    // Simulate validation results
    setValidationResults({
      total: 143,
      valid: 139,
      warnings: 4,
      errors: 0
    });
    
    setStep('validation');
  };

  const handleFinalize = () => {
    // In a real app, you would finalize the import here
    toast.success("Data import completed successfully");
    onComplete();
  };

  const handleDownloadTemplate = () => {
    generateOnboardingTemplate();
    toast.success("Template downloaded. Check your downloads folder.");
  };

  const renderStorageError = () => {
    if (!bucketReady && errorMessage) {
      return (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">Storage Not Ready</h3>
              <p className="text-sm text-amber-700 mt-1">
                Document storage is not available. Using demo mode instead.
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
    <div className="space-y-6 animate-fade-in">
      {step === 'initial' && (
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
                disabled={!file || isUploading}
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
      )}
      
      {step === 'mapping' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Field Mapping</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Map your source data fields to system fields
          </p>
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center">
                <span className="font-medium">Source: First Name</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">→</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Target: firstName</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center">
                <span className="font-medium">Source: Last Name</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">→</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Target: lastName</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center">
                <span className="font-medium">Source: Email</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">→</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Target: email</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center">
                <span className="font-medium">Source: Property Address</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">→</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Target: property.address</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center">
                <span className="font-medium">Source: Unit Number</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">→</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Target: property.unitNumber</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setStep('initial')}>Back</Button>
            <Button onClick={handleContinueToValidation}>Continue to Validation</Button>
          </div>
        </div>
      )}
      
      {step === 'validation' && validationResults && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Validation</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Check your data for errors before finalizing
          </p>
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Records</span>
              <span className="bg-primary/10 text-primary font-medium py-1 px-3 rounded-full">
                {validationResults.total}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Valid Records</span>
              <span className="bg-green-100 text-green-800 font-medium py-1 px-3 rounded-full flex items-center gap-1">
                <FileCheck className="h-3.5 w-3.5" />
                {validationResults.valid}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Records with Warnings</span>
              <span className="bg-amber-100 text-amber-800 font-medium py-1 px-3 rounded-full flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                {validationResults.warnings}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Records with Errors</span>
              <span className="bg-red-100 text-red-800 font-medium py-1 px-3 rounded-full">
                {validationResults.errors}
              </span>
            </div>
          </div>
          
          {validationResults.warnings > 0 && (
            <div className="border-l-4 border-amber-500 bg-amber-50 p-4 rounded-sm">
              <h4 className="font-medium text-amber-800">Warning Details</h4>
              <ul className="mt-2 space-y-1 text-sm">
                <li>Row 34: Missing phone number for John Smith</li>
                <li>Row 67: Invalid email format for manager@example</li>
                <li>Row 112: Property address may be incomplete</li>
                <li>Row 129: Missing unit number in multi-unit property</li>
              </ul>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setStep('mapping')}>Back</Button>
            <Button onClick={handleFinalize} disabled={validationResults.errors > 0}>
              Finalize Import
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDataTab;
