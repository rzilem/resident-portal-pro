
export interface ColumnMapping {
  sourceField: string;
  targetField: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  message?: string;
  validationResults?: {
    total: number;
    valid: number;
    warnings: number;
    errors: number;
  };
}

export interface FieldOption {
  name: string;
  label: string;
  description?: string;
}
