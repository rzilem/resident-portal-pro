
/**
 * Validation utilities for column mappings
 */
import { ColumnMapping, ValidationResult } from './types';

/**
 * Validate mappings against file data
 * @param mappings Array of column mappings
 * @param fileData File data with headers and rows
 * @returns Validation result object
 */
export const validateMappings = (
  mappings: ColumnMapping[],
  fileData: { headers: string[]; rows: Record<string, any>[] } | null
): ValidationResult => {
  if (!fileData || fileData.rows.length === 0) {
    return {
      isValid: false,
      message: "No data to validate"
    };
  }

  const requiredFields = [
    'association_name',
    'association_address',
    'association_phone',
    'association_email',
    'property_units_count'
  ];

  // Check if required fields are mapped
  const mappedFields = mappings.map(m => m.targetField).filter(f => f);
  const missingFields = requiredFields.filter(field => !mappedFields.includes(field));

  if (missingFields.length > 0) {
    return {
      isValid: false,
      message: `Missing required field mappings: ${missingFields.join(', ')}`
    };
  }

  // Perform basic validation of the imported data
  const totalRecords = fileData.rows.length;
  let validRecords = 0;
  let warningRecords = 0;
  let errorRecords = 0;

  // Simulate data validation - in a real app, this would be more comprehensive
  fileData.rows.forEach(row => {
    let hasError = false;
    let hasWarning = false;

    // Get mapped values for required fields
    const mappedValues: Record<string, any> = {};
    mappings.forEach(mapping => {
      if (mapping.targetField) {
        mappedValues[mapping.targetField] = row[mapping.sourceField];
      }
    });

    // Check for missing values in required fields
    requiredFields.forEach(field => {
      const mappedField = mappings.find(m => m.targetField === field);
      if (mappedField) {
        const value = row[mappedField.sourceField];
        if (!value) {
          hasError = true;
        }
      }
    });

    // Check email format
    const emailMapping = mappings.find(m => m.targetField === 'association_email' || m.targetField === 'homeowner_email');
    if (emailMapping && row[emailMapping.sourceField]) {
      const email = row[emailMapping.sourceField];
      if (!email.includes('@')) {
        hasWarning = true;
      }
    }

    // Check phone format
    const phoneMapping = mappings.find(m => m.targetField === 'association_phone' || m.targetField === 'homeowner_phone');
    if (phoneMapping && row[phoneMapping.sourceField]) {
      const phone = row[phoneMapping.sourceField];
      if (!/^\+?[\d\s\-()]+$/.test(phone)) {
        hasWarning = true;
      }
    }

    if (hasError) {
      errorRecords++;
    } else if (hasWarning) {
      warningRecords++;
      validRecords++;
    } else {
      validRecords++;
    }
  });

  return {
    isValid: true,
    message: "Validation complete",
    validationResults: {
      total: totalRecords,
      valid: validRecords,
      warnings: warningRecords,
      errors: errorRecords
    }
  };
};
