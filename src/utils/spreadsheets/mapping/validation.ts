
import { ColumnMapping, ValidationResult } from './types';

/**
 * Validate column mappings
 */
export const validateMappings = (mappings: ColumnMapping[], importType: string): ValidationResult => {
  const errors: string[] = [];
  
  // Define required fields based on import type
  const requiredFields: Record<string, string[]> = {
    vendor: ['name'],
    association: ['association_name', 'city', 'state'],
    property: ['property_address', 'association_name'],
    resident: ['first_name', 'last_name', 'email']
  };
  
  const requiredForType = requiredFields[importType] || [];
  const mappedFields = mappings.map(m => m.targetField);
  
  // Check if all required fields are mapped
  requiredForType.forEach(field => {
    if (!mappedFields.includes(field)) {
      errors.push(`Required field "${field}" is not mapped.`);
    }
  });
  
  // Generate validation results
  const totalFields = mappings.length;
  const validFields = mappings.filter(m => m.targetField && m.targetField !== 'ignore').length;
  
  return {
    isValid: errors.length === 0,
    errors,
    message: errors.length > 0 ? `${errors.length} errors found` : "Validation successful",
    validationResults: {
      total: totalFields,
      valid: validFields,
      warnings: 0,
      errors: errors.length
    }
  };
};
