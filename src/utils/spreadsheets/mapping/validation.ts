
import { ColumnMapping, ValidationResult } from './types';
import { findMissingRequiredFields } from './fieldMatchers';

/**
 * Validate column mappings
 */
export const validateMappings = (mappings: ColumnMapping[], importType: string): ValidationResult => {
  const errors: string[] = [];
  const requiredFields: Record<string, string[]> = {
    association: ['association_name', 'city', 'state'],
    property: ['property_address', 'association_name'],
    resident: ['first_name', 'last_name', 'email']
  };
  
  const requiredForType = requiredFields[importType] || [];
  const missingFields = findMissingRequiredFields(mappings, requiredForType);
  
  // Check if all required fields are mapped
  missingFields.forEach(field => {
    errors.push(`Required field "${field}" is not mapped.`);
  });
  
  // Create mock validation results for demonstration
  const mockValidationResults = {
    total: mappings.length,
    valid: mappings.length - errors.length,
    warnings: Math.floor(mappings.length * 0.1), // 10% have warnings
    errors: errors.length
  };
  
  return {
    isValid: errors.length === 0,
    errors,
    message: errors.length > 0 ? `${errors.length} errors found` : "Validation successful",
    validationResults: mockValidationResults
  };
};
