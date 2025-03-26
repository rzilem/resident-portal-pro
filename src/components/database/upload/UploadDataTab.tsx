
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface UploadDataTabProps {
  onComplete: () => void;
}

const UploadDataTab: React.FC<UploadDataTabProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'initial' | 'mapping' | 'validation'>('initial');

  const handleUpload = () => {
    // Simulate upload process
    setStep('mapping');
    
    // After mapping is done, move to validation
    setTimeout(() => {
      setStep('validation');
      
      // Finally complete the process
      setTimeout(() => {
        onComplete();
      }, 2000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {step === 'initial' && (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Drag and drop files here</h3>
          <p className="text-sm text-muted-foreground mb-4">
            or click to select files for upload (Excel, CSV)
          </p>
          <Button onClick={handleUpload}>Select Files</Button>
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
            {/* More mappings would go here */}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline">Back</Button>
            <Button onClick={() => setStep('validation')}>Continue</Button>
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
            <Button variant="outline">Back</Button>
            <Button onClick={onComplete}>Finalize Upload</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDataTab;
