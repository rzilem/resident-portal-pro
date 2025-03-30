
/**
 * Type definitions for column mapping functionality
 */

export interface ColumnMapping {
  sourceField: string;
  targetField: string;
}

export interface FieldOption {
  name: string;
  label: string;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
  validationResults?: {
    total: number;
    valid: number;
    warnings: number;
    errors: number;
  };
}
