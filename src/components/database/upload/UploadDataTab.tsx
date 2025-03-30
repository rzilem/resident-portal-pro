
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { uploadFile } from '@/utils/supabase/storage/uploadFile';
import { exportToExcel, generateOnboardingTemplate } from '@/utils/exportToExcel';
import { useAuth } from '@/hooks/use-auth';
import { FileUploader } from '@/components/ui/file-uploader';

interface UploadDataTabProps {
  onComplete: () => void;
}

const UploadDataTab: React.FC<UploadDataTabProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'initial' | 'mapping' | 'validation'>('initial');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  
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
      
      // Upload file to storage
      const uploadPath = `imports/data/${Date.now()}-${file.name}`;
      const url = await uploadFile(file, 'documents', uploadPath);
      
      if (!url) {
        throw new Error("Failed to upload file");
      }
      
      toast.success("File uploaded successfully");
      
      // Move to mapping step
      setStep('mapping');
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinueToValidation = () => {
    // In a real app, you would process the mapping here
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

  return (
    <div className="space-y-6">
      {step === 'initial' && (
        <div className="space-y-6">
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <FileUploader
              file={file}
              setFile={setFile}
              disabled={isUploading}
              acceptedTypes=".csv,.xls,.xlsx"
              maxSize={10 * 1024 * 1024} // 10MB max size
            />
            
            <div className="mt-4 flex flex-col sm:flex-row justify-center gap-3">
              <Button 
                onClick={handleFileUpload} 
                disabled={!file || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload File"}
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
            {/* Example mapping UI */}
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
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setStep('initial')}>Back</Button>
            <Button onClick={handleContinueToValidation}>Continue</Button>
          </div>
        </div>
      )}
      
      {step === 'validation' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Validation</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Check your data for errors before finalizing
          </p>
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Total Records</span>
              <span className="bg-primary/10 text-primary font-medium py-1 px-3 rounded-full">143</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Valid Records</span>
              <span className="bg-green-100 text-green-800 font-medium py-1 px-3 rounded-full">139</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Records with Warnings</span>
              <span className="bg-amber-100 text-amber-800 font-medium py-1 px-3 rounded-full">4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Records with Errors</span>
              <span className="bg-red-100 text-red-800 font-medium py-1 px-3 rounded-full">0</span>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setStep('mapping')}>Back</Button>
            <Button onClick={handleFinalize}>Finalize Upload</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDataTab;
