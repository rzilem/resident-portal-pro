
import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { generateAutoMappings } from '@/utils/spreadsheets/autoMapping';
import { exportToExcel, generateOnboardingTemplate } from '@/utils/exportToExcel';

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
  
  const handleFileProcessed = (data: {headers: string[]; rows: Record<string, any>[]}) => {
    setFileData(data);
    
    // Generate default mappings based on headers
    const autoMappings = generateAutoMappings(data.headers);
    setMappings(autoMappings);
  };

  const handleValidationPrepared = (results: {
    total: number;
    valid: number;
    warnings: number;
    errors: number;
  }) => {
    setValidationResults(results);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {step === 'initial' && (
        <FileUpload 
          onFileProcessed={handleFileProcessed}
          onStepChange={setStep}
        />
      )}
      
      {step === 'mapping' && fileData && (
        <FieldMapping
          fileData={fileData}
          mappings={mappings}
          onMappingsChange={setMappings}
          onStepChange={setStep}
          onValidationPrepared={handleValidationPrepared}
        />
      )}
      
      {step === 'validation' && validationResults && (
        <ValidationResults
          validationResults={validationResults}
          onStepChange={setStep}
          fileData={fileData}
          mappings={mappings}
          onComplete={onComplete}
        />
      )}
    </div>
  );
};

export default UploadDataTab;
