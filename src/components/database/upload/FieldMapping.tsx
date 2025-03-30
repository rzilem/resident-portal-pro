import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { ColumnMapping, validateMappings } from '@/utils/spreadsheets/mapping';
import MappingHeader from './mapping/MappingHeader';
import MappingFieldsList from './mapping/MappingFieldsList';
import MappingFooter from './mapping/MappingFooter';

interface FieldMappingProps {
  fileData: {
    headers: string[];
    rows: Record<string, any>[];
  } | null;
  mappings: ColumnMapping[];
  onMappingsChange: (mappings: ColumnMapping[]) => void;
  onStepChange: (step: 'initial' | 'mapping' | 'validation') => void;
  onValidationPrepared: (validationResults: {
    total: number;
    valid: number;
    warnings: number;
    errors: number;
  }) => void;
}

const FieldMapping: React.FC<FieldMappingProps> = ({ 
  fileData, 
  mappings,
  onMappingsChange,
  onStepChange,
  onValidationPrepared
}) => {
  const handleUpdateMapping = (index: number, targetField: string) => {
    const updatedMappings = [...mappings];
    updatedMappings[index].targetField = targetField;
    onMappingsChange(updatedMappings);
  };

  useEffect(() => {
    // Log to help with debugging
    console.log("Field mapping component loaded with data:", { 
      hasFileData: !!fileData, 
      mappingsCount: mappings.length,
      rowsCount: fileData?.rows.length
    });
  }, [fileData, mappings]);

  const handleContinueToValidation = () => {
    const validationResult = validateMappings(mappings, fileData);
    
    if (!validationResult.isValid) {
      toast.error(validationResult.message);
      return;
    }
    
    if (validationResult.validationResults) {
      console.log("Validation results:", validationResult.validationResults);
      onValidationPrepared(validationResult.validationResults);
      onStepChange('validation');
    }
  };

  if (!fileData) return null;

  return (
    <div className="space-y-4">
      <MappingHeader fileData={fileData} />
      <MappingFieldsList 
        mappings={mappings} 
        fileData={fileData} 
        onUpdateMapping={handleUpdateMapping} 
      />
      <MappingFooter 
        onStepChange={onStepChange} 
        onContinue={handleContinueToValidation} 
      />
    </div>
  );
};

export default FieldMapping;
