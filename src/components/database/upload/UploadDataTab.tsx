
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { generateAutoMappings } from '@/utils/spreadsheets/mapping';
import { exportToExcel, generateOnboardingTemplate } from '@/utils/exportToExcel';
import { toast } from 'sonner';

// Import refactored components
import FileUpload from './FileUpload';
import FieldMapping from './FieldMapping';
import ValidationResults from './ValidationResults';

interface UploadDataTabProps {
  onComplete: () => void;
}

interface ColumnMapping {
  sourceField: string;
  targetField: string;
}

const UploadDataTab: React.FC<UploadDataTabProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'initial' | 'mapping' | 'validation'>('initial');
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
  const [fileName, setFileName] = useState<string>("");
  const [importType, setImportType] = useState<string>("association");
  
  const { user } = useAuth();
  
  // Debug logs on state changes
  useEffect(() => {
    console.log("Step changed:", step);
  }, [step]);

  useEffect(() => {
    console.log("Validation results updated:", validationResults);
  }, [validationResults]);
  
  const handleFileProcessed = (data: {
    headers: string[]; 
    rows: Record<string, any>[];
    fileName: string;
  }) => {
    console.log("File processed:", { 
      headers: data.headers, 
      rowCount: data.rows.length,
      fileName: data.fileName
    });
    setFileData(data);
    setFileName(data.fileName);
    
    // Determine import type based on headers
    let detectedType = "association";
    
    const headerSet = new Set(data.headers.map(h => h.toLowerCase()));
    
    if (headerSet.has("unit_number") || 
        headerSet.has("property_address") || 
        headerSet.has("bedrooms") || 
        headerSet.has("bathrooms")) {
      detectedType = "property";
    }
    
    if (headerSet.has("homeowner_first_name") || 
        headerSet.has("homeowner_last_name") || 
        headerSet.has("homeowner_email") || 
        headerSet.has("resident_type")) {
      detectedType = "resident";
    }
    
    setImportType(detectedType);
    console.log("Detected import type:", detectedType);
    
    // Generate default mappings based on headers
    const autoMappings = generateAutoMappings(data.headers);
    setMappings(autoMappings);
    
    // Move to mapping step
    setStep('mapping');
  };

  const handleValidationPrepared = (results: {
    total: number;
    valid: number;
    warnings: number;
    errors: number;
  }) => {
    console.log("Setting validation results:", results);
    setValidationResults(results);
  };

  const handleStepChange = (newStep: 'initial' | 'mapping' | 'validation') => {
    console.log("Changing step from", step, "to", newStep);
    setStep(newStep);
  };

  const handleImportTypeChange = (type: string) => {
    setImportType(type);
    console.log("Import type changed to:", type);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {step === 'initial' && (
        <FileUpload 
          onFileProcessed={handleFileProcessed}
          onStepChange={handleStepChange}
        />
      )}
      
      {step === 'mapping' && fileData && (
        <FieldMapping
          fileData={fileData}
          mappings={mappings}
          onMappingsChange={setMappings}
          onStepChange={handleStepChange}
          onValidationPrepared={handleValidationPrepared}
          importType={importType}
          onImportTypeChange={handleImportTypeChange}
        />
      )}
      
      {step === 'validation' && (
        <ValidationResults
          validationResults={validationResults}
          onStepChange={handleStepChange}
          fileData={fileData}
          mappings={mappings}
          onComplete={onComplete}
          fileName={fileName}
          importType={importType}
        />
      )}
    </div>
  );
};

export default UploadDataTab;
