
import { ValidationResult } from '@/utils/spreadsheets/mapping/types';
import { validateMappings } from '@/utils/spreadsheets/mapping';
import { ColumnMapping } from '@/utils/spreadsheets/mapping/types';

/**
 * Perform validation for field mappings 
 */
export const validateFieldMappings = (
  mappings: ColumnMapping[],
  importType: string
): ValidationResult => {
  return validateMappings(mappings, importType);
};
