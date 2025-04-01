
/**
 * Validation utilities for column mappings
 */
import { ColumnMapping, ValidationResult } from './types';

/**
 * Validate mappings against file data
 * @param mappings Array of column mappings
 * @param importType Import type string ('association', 'property', 'resident')
 * @returns Validation result object
 */
export const validateMappings = (
  mappings: ColumnMapping[],
  importType: string
): ValidationResult => {
  const errors: string[] = [];
  const requiredFields: Record<string, string[]> = {
    association: ['association_name', 'city', 'state'],
    property: ['property_address', 'association_name'],
    resident: ['first_name', 'last_name', 'email']
  };
  
  const requiredForType = requiredFields[importType as keyof typeof requiredFields] || [];
  const mappedFields = mappings.map(m => m.targetField);
  
  // Check if all required fields are mapped
  requiredForType.forEach(field => {
    if (!mappedFields.includes(field)) {
      errors.push(`Required field "${field}" is not mapped.`);
    }
  });

  // Simulate validation results for UI display
  const validationResults = {
    total: mappings.length,
    valid: mappings.length - errors.length,
    warnings: 0,
    errors: errors.length
  };
  
  return {
    isValid: errors.length === 0,
    errors,
    message: errors.length > 0 ? `${errors.length} errors found` : "Validation successful",
    validationResults
  };
};
