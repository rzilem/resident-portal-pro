
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { FileDown, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from './FileUpload';
import { exportToExcel, generateVendorTemplate } from '@/utils/exportToExcel';
import { Progress } from "@/components/ui/progress";

interface ValidationResult {
  total: number;
  valid: number;
  warnings: number;
  errors: number;
  records: Record<string, any>[];
}

const VendorUploadTab = () => {
  const [step, setStep] = useState<'initial' | 'mapping' | 'validation' | 'success'>('initial');
  const [fileData, setFileData] = useState<{
    headers: string[];
    rows: Record<string, any>[];
    fileName: string;
  } | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResult | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  
  const handleFileProcessed = (data: {
    headers: string[]; 
    rows: Record<string, any>[];
    fileName: string;
  }) => {
    console.log("Vendor file processed:", { 
      headers: data.headers, 
      rowCount: data.rows.length,
      fileName: data.fileName
    });
    
    setFileData(data);
    
    // Automatically validate the data
    validateVendorData(data);
  };

  const validateVendorData = (data: {
    headers: string[];
    rows: Record<string, any>[];
  }) => {
    // Check for required fields
    const requiredFields = ['Provider Name', 'Contact', 'Phone', 'eMail', 'Provider Type'];
    const missingFields = requiredFields.filter(field => 
      !data.headers.some(header => header === field || header.toLowerCase() === field.toLowerCase())
    );
    
    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    // Validate each row
    let valid = 0;
    let warnings = 0;
    let errors = 0;
    
    const validatedRecords = data.rows.map(row => {
      let hasError = false;
      let hasWarning = false;
      
      // Check required fields in each row
      for (const field of requiredFields) {
        const fieldKey = data.headers.find(
          h => h === field || h.toLowerCase() === field.toLowerCase()
        );
        
        if (fieldKey && (!row[fieldKey] || row[fieldKey].toString().trim() === '')) {
          hasError = true;
          row._errors = row._errors || {};
          row._errors[fieldKey] = 'Required field is missing';
        }
      }
      
      // Email validation
      const emailField = data.headers.find(
        h => h === 'eMail' || h.toLowerCase() === 'email'
      );
      
      if (emailField && row[emailField]) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(row[emailField])) {
          hasWarning = true;
          row._warnings = row._warnings || {};
          row._warnings[emailField] = 'Invalid email format';
        }
      }
      
      if (hasError) errors++;
      else if (hasWarning) warnings++;
      else valid++;
      
      return row;
    });
    
    setValidationResults({
      total: data.rows.length,
      valid,
      warnings,
      errors,
      records: validatedRecords
    });
    
    setStep('validation');
  };

  const handleImport = async () => {
    if (!validationResults || !fileData) return;
    
    setIsImporting(true);
    
    try {
      // Simulate import process with progress updates
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i);
        // Wait for 200ms to simulate processing time
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      toast.success(`Successfully imported ${validationResults.valid} vendors`);
      setStep('success');
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Error importing vendors');
    } finally {
      setIsImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    generateVendorTemplate();
    toast.success('Vendor template downloaded');
  };

  const handleReset = () => {
    setStep('initial');
    setFileData(null);
    setValidationResults(null);
    setImportProgress(0);
  };

  const renderValidationResults = () => {
    if (!validationResults) return null;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold">{validationResults.total}</p>
            <p className="text-xs text-muted-foreground">Total Records</p>
          </Card>
          
          <Card className="p-4 text-center bg-green-50">
            <p className="text-2xl font-bold text-green-600">{validationResults.valid}</p>
            <p className="text-xs text-muted-foreground">Valid</p>
          </Card>
          
          <Card className="p-4 text-center bg-amber-50">
            <p className="text-2xl font-bold text-amber-600">{validationResults.warnings}</p>
            <p className="text-xs text-muted-foreground">Warnings</p>
          </Card>
          
          <Card className="p-4 text-center bg-red-50">
            <p className="text-2xl font-bold text-red-600">{validationResults.errors}</p>
            <p className="text-xs text-muted-foreground">Errors</p>
          </Card>
        </div>
        
        {validationResults.errors > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  {validationResults.errors} vendors have errors
                </p>
                <p className="text-sm text-red-700 mt-1">
                  Please fix the errors in your spreadsheet before importing or choose to skip error records.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleReset}>
            Cancel
          </Button>
          
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={handleDownloadTemplate}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Download Template
            </Button>
            
            <Button 
              onClick={handleImport} 
              disabled={isImporting || validationResults.valid === 0}
            >
              {isImporting ? (
                <>
                  <div className="w-[100px]">
                    <Progress value={importProgress} className="h-2" />
                  </div>
                  <span className="ml-2">{importProgress}%</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Import Vendors
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderSuccessState = () => {
    if (!validationResults) return null;
    
    return (
      <div className="py-8 text-center">
        <div className="mx-auto bg-green-100 h-20 w-20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-xl font-medium">Import Successful!</h3>
        <p className="text-muted-foreground mt-2">
          {validationResults.valid} vendors have been imported successfully.
        </p>
        
        <div className="mt-8 flex justify-center space-x-4">
          <Button variant="outline" onClick={handleReset}>
            Import More Vendors
          </Button>
          <Button onClick={handleReset}>
            Done
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-medium">Vendor Import</h3>
          <p className="text-sm text-muted-foreground">
            Upload your vendor data in bulk using a spreadsheet
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleDownloadTemplate}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          <span>Download Template</span>
        </Button>
      </div>
      
      {step === 'initial' && (
        <FileUpload 
          onFileProcessed={handleFileProcessed}
          onStepChange={setStep}
        />
      )}
      
      {step === 'validation' && renderValidationResults()}
      
      {step === 'success' && renderSuccessState()}
    </div>
  );
};

export default VendorUploadTab;
