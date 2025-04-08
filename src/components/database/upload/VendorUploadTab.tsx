
import React, { useState } from 'react';
import FileUpload from './FileUpload';
import VendorMappingFieldsList from './vendors/VendorMappingFieldsList';
import ValidationResults from './ValidationResults';
import SuccessState from './SuccessState';
import { validateVendorData } from '@/utils/spreadsheets/vendors/vendorImportUtils';
import { generateAutoMappings } from '@/utils/spreadsheets/mapping/autoMappingGenerator';
import { toast } from 'sonner';

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
  const [importResults, setImportResults] = useState<{
    recordsImported: number;
    recordsWithWarnings: number;
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
    
    // Map "Provider Name" to "name" for vendors
    const updatedMappings = autoMappings.map(mapping => {
      if (mapping.sourceField === 'Provider Name') {
        return { ...mapping, targetField: 'name' };
      }
      return mapping;
    });
    
    console.log("Generated mappings:", updatedMappings);
    setMappings(updatedMappings);
    
    // Move to mapping step
    setStep('mapping');
    
    toast.info(`File processed. ${data.rows.length} records found.`);
  };
  
  const handleMappingUpdate = (index: number, targetField: string) => {
    const updatedMappings = [...mappings];
    updatedMappings[index].targetField = targetField;
    setMappings(updatedMappings);
  };

  const handleContinueToValidation = () => {
    if (!fileData) {
      toast.error("No file data available");
      return;
    }
    
    console.log("Proceeding to validation with mappings:", mappings);
    
    // Transform data using mappings before validation
    const transformedRows = fileData.rows.map(row => {
      const transformedRow: Record<string, any> = {};
      
      mappings.forEach(mapping => {
        if (mapping.targetField && mapping.targetField !== 'ignore') {
          transformedRow[mapping.targetField] = row[mapping.sourceField];
        }
      });
      
      return transformedRow;
    });
    
    console.log("Transformed data sample:", transformedRows.slice(0, 2));
    
    // Validate the transformed data
    const validation = validateVendorData(
      Object.keys(transformedRows[0] || {}),
      transformedRows
    );
    
    setValidationResults({
      total: fileData.rows.length,
      valid: validation.validCount,
      warnings: validation.warningCount,
      errors: validation.errorCount
    });
    
    toast.info(`Validation complete. ${validation.validCount} valid records found.`);
    setStep('validation');
  };

  const handleComplete = (results: { recordsImported: number, recordsWithWarnings: number }) => {
    console.log("Vendor import completed with results:", results);
    setImportResults(results);
    toast.success(`Vendor import completed successfully! ${results.recordsImported} vendors imported.`);
    setStep('success');
  };

  const handleReset = () => {
    setFileData(null);
    setMappings([]);
    setValidationResults(null);
    setImportResults(null);
    setFileName("");
    setStep('initial');
    toast.info("Ready for a new import");
  };
  
  const handleClose = () => {
    // This could navigate away or close a modal depending on implementation
    handleReset();
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
          onClose={handleClose}
          message="Vendor import completed successfully"
          details={`${importResults?.recordsImported || 0} vendors were imported`}
        />
      )}
    </div>
  );
};

export default VendorUploadTab;
