
import React, { useState } from 'react';
import FileUpload from './FileUpload';
import FieldMapping from './FieldMapping';
import ValidationResults from './ValidationResults';
import VendorMappingFieldsList from './vendors/VendorMappingFieldsList';
import SuccessState from './SuccessState';
import { validateVendorData } from '@/utils/spreadsheets/vendors/vendorImportUtils';
import { generateAutoMappings } from '@/utils/spreadsheets/mapping/autoMappingGenerator';

const VendorUploadTab = () => {
  const [step, setStep] = useState<'initial' | 'mapping' | 'validation' | 'success'>('initial');
  const [fileData, setFileData] = useState<{
    headers: string[];
    rows: Record<string, any>[];
  } | null>(null);
  const [mappings, setMappings] = useState<{
    sourceField: string;
    targetField: string;
  }[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [validationResults, setValidationResults] = useState<{
    total: number;
    valid: number;
    warnings: number;
    errors: number;
  } | null>(null);

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
    setFileName(data.fileName);
    
    // Generate vendor-specific mappings
    const autoMappings = generateAutoMappings(data.headers);
    setMappings(autoMappings);
    
    // Move to mapping step
    setStep('mapping');
  };
  
  const handleMappingUpdate = (index: number, targetField: string) => {
    const updatedMappings = [...mappings];
    updatedMappings[index].targetField = targetField;
    setMappings(updatedMappings);
  };

  const handleContinueToValidation = () => {
    if (!fileData) return;
    
    console.log("Proceeding to validation with mappings:", mappings);
    
    // Validate the data with the mappings
    const validation = validateVendorData(
      fileData.headers,
      fileData.rows
    );
    
    setValidationResults({
      total: fileData.rows.length,
      valid: validation.validCount,
      warnings: validation.warningCount,
      errors: validation.errorCount
    });
    
    setStep('validation');
  };

  const handleComplete = () => {
    console.log("Vendor import completed");
    setStep('success');
  };

  const handleReset = () => {
    setFileData(null);
    setMappings([]);
    setValidationResults(null);
    setFileName("");
    setStep('initial');
  };

  return (
    <div className="space-y-6">
      {step === 'initial' && (
        <FileUpload 
          onFileProcessed={handleFileProcessed}
          onStepChange={setStep}
        />
      )}
      
      {step === 'mapping' && fileData && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-lg font-medium">Vendor Data Mapping</h3>
              <p className="text-sm text-muted-foreground">
                Map your spreadsheet columns to vendor fields
              </p>
            </div>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-md mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">File:</span>
              <span>{fileName}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Records:</span>
              <span>{fileData.rows.length}</span>
            </div>
          </div>
          
          <VendorMappingFieldsList
            mappings={mappings}
            fileData={fileData}
            onUpdateMapping={handleMappingUpdate}
          />
          
          <div className="flex justify-end space-x-2 mt-6">
            <button
              onClick={() => setStep('initial')}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Back
            </button>
            <button
              onClick={handleContinueToValidation}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
      {step === 'validation' && fileData && (
        <ValidationResults
          validationResults={validationResults}
          onStepChange={setStep}
          fileData={fileData}
          mappings={mappings}
          onComplete={handleComplete}
          fileName={fileName}
          importType="vendor"
        />
      )}
      
      {step === 'success' && (
        <SuccessState 
          onReset={handleReset}
          onClose={() => {}}
          message="Vendor import completed successfully"
          details={`${validationResults?.valid || 0} vendors were imported`}
        />
      )}
    </div>
  );
};

export default VendorUploadTab;
