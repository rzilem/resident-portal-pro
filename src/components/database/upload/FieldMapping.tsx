
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { 
  ColumnMapping, 
  ValidationResult, 
  validateMappings 
} from '@/utils/spreadsheets/mapping';
import MappingHeader from './mapping/MappingHeader';
import MappingFieldsList from './mapping/MappingFieldsList';
import MappingFooter from './mapping/MappingFooter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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
  importType?: string;
  onImportTypeChange?: (type: string) => void;
}

const FieldMapping: React.FC<FieldMappingProps> = ({ 
  fileData, 
  mappings,
  onMappingsChange,
  onStepChange,
  onValidationPrepared,
  importType = "association",
  onImportTypeChange
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
      rowsCount: fileData?.rows.length,
      importType
    });
  }, [fileData, mappings, importType]);

  const handleContinueToValidation = () => {
    // Pass importType instead of fileData to validateMappings
    const validationResult = validateMappings(mappings, importType);
    
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

  const handleImportTypeChange = (value: string) => {
    if (onImportTypeChange) {
      onImportTypeChange(value);
    }
  };

  if (!fileData) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-medium">Field Mapping</h3>
          <p className="text-sm text-muted-foreground">
            Map your spreadsheet columns to system fields
          </p>
        </div>
        
        <div className="w-full sm:w-auto">
          <Label htmlFor="import-type" className="mb-1 block">Import Type</Label>
          <Select value={importType} onValueChange={handleImportTypeChange}>
            <SelectTrigger id="import-type" className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Import Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="association">Association Data</SelectItem>
              <SelectItem value="property">Property Data</SelectItem>
              <SelectItem value="resident">Resident Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <MappingHeader fileData={fileData} />
      <MappingFieldsList 
        mappings={mappings} 
        fileData={fileData} 
        onUpdateMapping={handleUpdateMapping}
        importType={importType}
      />
      <MappingFooter 
        onStepChange={onStepChange} 
        onContinue={handleContinueToValidation} 
      />
    </div>
  );
};

export default FieldMapping;
