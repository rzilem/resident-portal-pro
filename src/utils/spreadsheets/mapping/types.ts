
/**
 * Type definitions for spreadsheet mapping functionality
 */

export interface ColumnMapping {
  sourceColumn: string;
  targetField: string;
  sourceIndex?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  message: string;
  validationResults?: {
    total: number;
    valid: number;
    warnings: number;
    errors: number;
  };
}

export interface FieldOption {
  label: string;
  value: string;
  required?: boolean;
  category?: string;
  description?: string;
}
