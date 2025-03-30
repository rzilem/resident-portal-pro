
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
  
  const { user } = useAuth();
  
  // Debug logs on state changes
  useEffect(() => {
    console.log("Step changed:", step);
  }, [step]);

  useEffect(() => {
    console.log("Validation results updated:", validationResults);
  }, [validationResults]);
  
  const handleFileProcessed = (data: {headers: string[]; rows: Record<string, any>[]}) => {
    console.log("File processed:", { 
      headers: data.headers, 
      rowCount: data.rows.length 
    });
    setFileData(data);
    
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
        />
      )}
      
      {step === 'validation' && (
        <ValidationResults
          validationResults={validationResults}
          onStepChange={handleStepChange}
          fileData={fileData}
          mappings={mappings}
          onComplete={onComplete}
        />
      )}
    </div>
  );
};

export default UploadDataTab;
