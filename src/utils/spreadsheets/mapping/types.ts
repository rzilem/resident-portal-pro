
export interface ColumnMapping {
  sourceField: string;
  targetField: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
