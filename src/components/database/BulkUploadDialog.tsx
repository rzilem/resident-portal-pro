
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, X, Check, AlertCircle, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BulkUploadDialog: React.FC<BulkUploadDialogProps> = ({
  open,
  onOpenChange
}) => {
  const [step, setStep] = useState<'upload' | 'mapping' | 'validation' | 'complete'>('upload');
  const [recordType, setRecordType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<{
    total: number;
    valid: number;
    warnings: number;
    errors: number;
  } | null>(null);

  const resetDialog = () => {
    setStep('upload');
    setRecordType('');
    setFile(null);
    setProgress(0);
    setValidationResults(null);
  };

  const handleClose = () => {
    resetDialog();
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!recordType) {
      toast.error("Please select a record type");
      return;
    }

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    
    // Simulate upload progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setStep('mapping');
      }
    }, 300);
  };

  const handleContinueToValidation = () => {
    setStep('validation');
    
    // Simulate validation
    setTimeout(() => {
      setValidationResults({
        total: 150,
        valid: 142,
        warnings: 5,
        errors: 3
      });
    }, 1000);
  };

  const handleImport = () => {
    setStep('complete');
    
    // Simulate import
    setTimeout(() => {
      toast.success("Data imported successfully");
      handleClose();
    }, 1500);
  };

  const downloadTemplate = () => {
    toast.success("Template downloaded");
  };

  const renderStepContent = () => {
    switch (step) {
      case 'upload':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Bulk Upload Data</DialogTitle>
              <DialogDescription>
                Upload a spreadsheet to import multiple records at once.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="record-type" className="text-sm font-medium">Record Type</label>
                <Select value={recordType} onValueChange={setRecordType}>
                  <SelectTrigger id="record-type">
                    <SelectValue placeholder="Select record type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="associations">Associations</SelectItem>
                    <SelectItem value="properties">Properties</SelectItem>
                    <SelectItem value="residents">Residents</SelectItem>
                    <SelectItem value="vendors">Vendors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="file-upload" className="text-sm font-medium">Upload File</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {file ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-blue-500 mr-2" />
                        <div className="text-left">
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Drag & drop your file here or click to browse
                      </p>
                      <Input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                      />
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        Select File
                      </Button>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Accepted formats: .xlsx, .xls, .csv
                </p>
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={downloadTemplate}>
                  Download Template
                </Button>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!file || !recordType || isUploading}>
                {isUploading ? 'Uploading...' : 'Upload & Continue'}
              </Button>
            </DialogFooter>
          </>
        );
        
      case 'mapping':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Map Fields</DialogTitle>
              <DialogDescription>
                Match your spreadsheet columns to our database fields.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="border rounded-lg divide-y">
                {['Name', 'Email', 'Phone', 'Address', 'City', 'State'].map((field, index) => (
                  <div key={index} className="flex items-center justify-between p-3">
                    <span className="text-sm font-medium">{field}</span>
                    <Select defaultValue={`column_${index + 1}`}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={`column_${index + 1}`}>Column {index + 1}</SelectItem>
                        <SelectItem value="ignore">Ignore this field</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button onClick={handleContinueToValidation}>
                Continue
              </Button>
            </DialogFooter>
          </>
        );
        
      case 'validation':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Validate Data</DialogTitle>
              <DialogDescription>
                Review the validation results before importing.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {validationResults ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-muted p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold">{validationResults.total}</p>
                      <p className="text-xs text-muted-foreground">Total Records</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-600">{validationResults.valid}</p>
                      <p className="text-xs text-muted-foreground">Valid</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-yellow-600">{validationResults.warnings}</p>
                      <p className="text-xs text-muted-foreground">Warnings</p>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg text-center">
                      <p className="text-2xl font-bold text-red-600">{validationResults.errors}</p>
                      <p className="text-xs text-muted-foreground">Errors</p>
                    </div>
                  </div>
                  
                  {validationResults.errors > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                      <div className="flex">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-red-800">
                            {validationResults.errors} records have errors
                          </p>
                          <p className="text-sm text-red-700 mt-1">
                            Please fix the errors before importing or choose to skip them.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">Validating data...</p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('mapping')}>
                Back
              </Button>
              <Button 
                onClick={handleImport} 
                disabled={!validationResults || validationResults.errors > 0}
              >
                Import Data
              </Button>
            </DialogFooter>
          </>
        );
        
      case 'complete':
        return (
          <>
            <DialogHeader>
              <DialogTitle>Import Complete</DialogTitle>
              <DialogDescription>
                Your data has been successfully imported.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-8 text-center">
              <div className="mx-auto bg-green-100 h-12 w-12 rounded-full flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Import Successful!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {validationResults?.valid} records have been imported successfully.
              </p>
            </div>
            
            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadDialog;
