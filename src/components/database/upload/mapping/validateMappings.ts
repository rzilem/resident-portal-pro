
import { validateMappings as validateMappingsUtility } from '@/utils/spreadsheets/mapping';
import { ColumnMapping } from '@/utils/spreadsheets/mapping';

/**
 * Validate mappings and prepare validation results
 * @param mappings Array of column mappings
 * @param fileData File data with headers and rows
 * @returns Validation result object
 */
export const validateMappings = (
  mappings: ColumnMapping[],
  fileData: { headers: string[]; rows: Record<string, any>[] } | null
) => {
  return validateMappingsUtility(mappings, fileData);
};

