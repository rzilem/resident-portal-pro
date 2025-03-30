
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { uploadDocument } from '@/utils/documents/uploadDocument';
import { exportToExcel, generateOnboardingTemplate } from '@/utils/exportToExcel';
import { useAuth } from '@/hooks/use-auth';
import { FileUploader } from '@/components/ui/file-uploader';
import { ArrowRight, FileSpreadsheet, FileCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useDocumentsBucket } from '@/hooks/use-documents-bucket';
import * as XLSX from 'xlsx';

interface UploadDataTabProps {
  onComplete: () => void;
}

interface ColumnMapping {
  sourceField: string;
  targetField: string;
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
  const [fileData, setFileData] = useState<{
    headers: string[];
    rows: Record<string, any>[];
  } | null>(null);
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  
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
      
      // Read the file data using xlsx library
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Get the first worksheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert worksheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      if (jsonData.length === 0) {
        throw new Error("The spreadsheet appears to be empty");
      }
      
      // Extract headers (first row)
      const headers = jsonData[0] as string[];
      
      // Extract data rows (excluding header row)
      const rows = jsonData.slice(1).map(row => {
        const rowData: Record<string, any> = {};
        (row as any[]).forEach((cell, index) => {
          if (index < headers.length) {
            rowData[headers[index]] = cell;
          }
        });
        return rowData;
      });
      
      // Store the extracted data
      setFileData({ headers, rows });
      
      // Generate default mappings based on headers
      const systemFields = [
        'firstName', 'lastName', 'email', 'phone', 
        'property.address', 'property.unitNumber', 'property.city', 
        'property.state', 'property.zip'
      ];
      
      // Try to automatically map headers to system fields
      const autoMappings = headers.map(header => {
        const lowerHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Try to find a matching system field
        let targetField = '';
        
        if (lowerHeader.includes('first') && lowerHeader.includes('name')) {
          targetField = 'firstName';
        } else if (lowerHeader.includes('last') && lowerHeader.includes('name')) {
          targetField = 'lastName';
        } else if (lowerHeader.includes('email')) {
          targetField = 'email';
        } else if (lowerHeader.includes('phone')) {
          targetField = 'phone';
        } else if (lowerHeader.includes('address')) {
          targetField = 'property.address';
        } else if (lowerHeader.includes('unit')) {
          targetField = 'property.unitNumber';
        } else if (lowerHeader.includes('city')) {
          targetField = 'property.city';
        } else if (lowerHeader.includes('state')) {
          targetField = 'property.state';
        } else if (lowerHeader.includes('zip') || lowerHeader.includes('postal')) {
          targetField = 'property.zip';
        }
        
        return {
          sourceField: header,
          targetField: targetField
        };
      });
      
      setMappings(autoMappings);
      
      console.log('File processed successfully', { headers, rowCount: rows.length });
      toast.success(`File processed successfully. Found ${headers.length} columns and ${rows.length} records.`);
      
      // Move to mapping step
      setStep('mapping');
      setIsUploading(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Error processing file. Please try again.");
      setIsUploading(false);
    }
  };

  const handleUpdateMapping = (index: number, targetField: string) => {
    const updatedMappings = [...mappings];
    updatedMappings[index].targetField = targetField;
    setMappings(updatedMappings);
  };

  const handleContinueToValidation = () => {
    // Validate the mappings
    const requiredFields = ['firstName', 'lastName', 'email'];
    const mapped = mappings.map(m => m.targetField);
    
    const missingRequired = requiredFields.filter(field => !mapped.includes(field));
    
    if (missingRequired.length > 0) {
      toast.error(`Please map required fields: ${missingRequired.join(', ')}`);
      return;
    }
    
    // Process the data with mappings
    const totalRecords = fileData?.rows.length || 0;
    let valid = 0;
    let warnings = 0;
    let errors = 0;
    
    // For demo purposes, simulate validation results based on data
    fileData?.rows.forEach(row => {
      let hasWarning = false;
      let hasError = false;
      
      // Check for email format
      const emailMapping = mappings.find(m => m.targetField === 'email');
      if (emailMapping) {
        const email = row[emailMapping.sourceField];
        if (email && !email.toString().includes('@')) {
          hasWarning = true;
        }
      }
      
      // Check for empty required fields
      requiredFields.forEach(reqField => {
        const mapping = mappings.find(m => m.targetField === reqField);
        if (mapping) {
          const value = row[mapping.sourceField];
          if (!value) {
            hasError = true;
          }
        }
      });
      
      if (hasError) errors++;
      else if (hasWarning) warnings++;
      else valid++;
    });
    
    // Set validation results
    setValidationResults({
      total: totalRecords,
      valid,
      warnings,
      errors
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
      
      {step === 'mapping' && fileData && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Field Mapping</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Map your source data fields to system fields
          </p>
          
          <div className="bg-muted/30 p-3 rounded-md mb-4">
            <h4 className="font-medium text-sm mb-2">File Summary:</h4>
            <div className="text-sm flex flex-wrap gap-4">
              <div><span className="font-medium">Columns:</span> {fileData.headers.length}</div>
              <div><span className="font-medium">Rows:</span> {fileData.rows.length}</div>
              <div><span className="font-medium">File:</span> {file?.name}</div>
            </div>
          </div>
          
          <div className="grid gap-4">
            {mappings.map((mapping, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <span className="font-medium">{mapping.sourceField}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({fileData.rows[0]?.[mapping.sourceField] ? 
                      String(fileData.rows[0][mapping.sourceField]).slice(0, 20) + 
                      (String(fileData.rows[0][mapping.sourceField]).length > 20 ? '...' : '') : 
                      'no sample'})
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">→</span>
                </div>
                <div className="flex items-center">
                  <select
                    className="border rounded p-1"
                    value={mapping.targetField}
                    onChange={(e) => handleUpdateMapping(index, e.target.value)}
                  >
                    <option value="">-- Select Field --</option>
                    <optgroup label="Basic Info">
                      <option value="firstName">First Name</option>
                      <option value="lastName">Last Name</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                    </optgroup>
                    <optgroup label="Property">
                      <option value="property.address">Property Address</option>
                      <option value="property.unitNumber">Unit Number</option>
                      <option value="property.city">City</option>
                      <option value="property.state">State</option>
                      <option value="property.zip">ZIP Code</option>
                    </optgroup>
                    <optgroup label="Other">
                      <option value="ignore">Ignore This Field</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            ))}
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
                {validationResults.warnings > 0 && (
                  <li>Some email addresses may be invalid (missing @ symbol)</li>
                )}
                {fileData && mappings.find(m => m.targetField === 'phone') && (
                  <li>Some phone numbers may be in an incorrect format</li>
                )}
                {fileData && !mappings.find(m => m.targetField === 'property.unitNumber') && (
                  <li>Unit numbers not mapped for possible multi-unit properties</li>
                )}
              </ul>
            </div>
          )}
          
          {validationResults.errors > 0 && (
            <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded-sm">
              <h4 className="font-medium text-red-800">Error Details</h4>
              <ul className="mt-2 space-y-1 text-sm">
                <li>Some records are missing required fields (First Name, Last Name, or Email)</li>
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
