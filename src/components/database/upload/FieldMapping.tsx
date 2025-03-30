
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ColumnMapping {
  sourceField: string;
  targetField: string;
}

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

  const handleContinueToValidation = () => {
    if (!fileData) return;
    
    // Validate the mappings
    const requiredFields = ['firstName', 'lastName', 'email'];
    const mapped = mappings.map(m => m.targetField);
    
    const missingRequired = requiredFields.filter(field => !mapped.includes(field));
    
    if (missingRequired.length > 0) {
      toast.error(`Please map required fields: ${missingRequired.join(', ')}`);
      return;
    }
    
    // Process the data with mappings
    const totalRecords = fileData.rows.length || 0;
    let valid = 0;
    let warnings = 0;
    let errors = 0;
    
    // Simulate validation results based on data
    fileData.rows.forEach(row => {
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
    onValidationPrepared({
      total: totalRecords,
      valid,
      warnings,
      errors
    });
    
    onStepChange('validation');
  };

  if (!fileData) return null;

  return (
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
        <Button variant="outline" onClick={() => onStepChange('initial')}>Back</Button>
        <Button onClick={handleContinueToValidation}>Continue to Validation</Button>
      </div>
    </div>
  );
};

export default FieldMapping;
